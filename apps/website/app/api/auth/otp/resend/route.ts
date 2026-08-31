import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAndSendOtp } from "@/lib/otp";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@dragon/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const pendingCookieEmail = req.cookies.get("dragon_pending_email")?.value;
    const body = await req.json().catch(() => ({}));
    const email = (session?.user?.email || pendingCookieEmail || body?.email || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Authentication session or email reference required." },
        { status: 401 }
      );
    }

    // Rate limiting: 60s cooldown, max 5 per hour
    const cooldownLimit = checkRateLimit(`otp:cooldown:${email}:${ip}`, 1, 60 * 1000);
    if (!cooldownLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Please wait ${cooldownLimit.retryAfterSeconds} seconds before requesting a new code.`,
          retryAfter: cooldownLimit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const emailLimit = checkRateLimit(`otp:send:email:${email}:${ip}`, 5, 60 * 60 * 1000);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Maximum verification code requests reached for this hour. Please try later." },
        { status: 429 }
      );
    }

    // Record Resend Audit Log
    await prisma.auditLog.create({
      data: {
        userEmail: email,
        action: "OTP_RESEND",
        resource: "AUTHENTICATION",
        details: `OTP resend requested for ${email}`,
        ipAddress: ip,
      },
    }).catch(() => {});

    const result = await createAndSendOtp(email, session?.user?.id, ip);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "We couldn't send a new code right now. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    console.error("[API:OTP:Resend] Error:", msg);
    return NextResponse.json(
      { success: false, error: "We couldn't send a new code right now. Please try again." },
      { status: 500 }
    );
  }
}
