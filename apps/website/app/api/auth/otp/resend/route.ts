import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAndSendOtp } from "@/lib/otp";
import { checkRateLimit } from "@dragon/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Authentication session required." },
        { status: 401 }
      );
    }

    const email = session.user.email.toLowerCase().trim();

    // Rate limiting: 60s cooldown, max 5 per hour
    const cooldownLimit = checkRateLimit(`otp:cooldown:${email}`, 1, 60 * 1000);
    if (!cooldownLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `You can request another code in ${cooldownLimit.retryAfterSeconds} seconds.`,
          retryAfter: cooldownLimit.retryAfterSeconds,
        },
        { status: 429 }
      );
    }

    const emailLimit = checkRateLimit(`otp:send:email:${email}`, 5, 60 * 60 * 1000);
    if (!emailLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Maximum verification attempts reached for this hour." },
        { status: 429 }
      );
    }

    const result = await createAndSendOtp(email, session.user.id);
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
