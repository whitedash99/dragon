import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAndSendOtp } from "@/lib/otp";
import { checkRateLimit } from "@dragon/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const body = await req.json().catch(() => ({}));
    const pendingCookieEmail = req.cookies.get("dragon_pending_email")?.value;
    const email = (session?.user?.email || pendingCookieEmail || body?.email || "").toLowerCase().trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Authentication session or email reference required." },
        { status: 401 }
      );
    }
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // 2. Rate limiting: 5 sends per hour per email, cooldown of 60 seconds
    const emailLimit = checkRateLimit(`otp:send:email:${email}`, 5, 60 * 60 * 1000);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many code requests. Please try again later." },
        { status: 429 }
      );
    }

    const cooldownLimit = checkRateLimit(`otp:cooldown:${email}`, 1, 60 * 1000);
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

    // 3. Generate & Send OTP
    const result = await createAndSendOtp(email, session?.user?.id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send verification code." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    console.error("[API:OTP:Send] Error:", msg);
    return NextResponse.json(
      { success: false, error: "Unable to process verification request." },
      { status: 500 }
    );
  }
}
