import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyOtpCode } from "@/lib/otp";
import { prisma } from "@/lib/prisma";
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

    // Rate limit verification attempts (max 10 attempts per 10 minutes)
    const verifyLimit = checkRateLimit(`otp:verify:${email}`, 10, 10 * 60 * 1000);
    if (!verifyLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many verification attempts. Please request a new code." },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { code } = body;

    if (!code || typeof code !== "string" || !/^\d{6}$/.test(code.trim())) {
      return NextResponse.json(
        { success: false, error: "That verification code is incorrect." },
        { status: 400 }
      );
    }

    // Verify candidate OTP against PostgreSQL hashed records
    const result = await verifyOtpCode(email, code.trim());
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "That verification code is incorrect." },
        { status: 400 }
      );
    }

    // 1. Mark email as verified on user model
    const dbUser = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
      include: { profile: true },
    });

    // 2. Check if Dragon ID setup is already complete
    let hasDragonId = false;
    if (dbUser.profile?.notificationSettings) {
      try {
        const meta = JSON.parse(dbUser.profile.notificationSettings);
        if (meta.gamerTag && meta.gamerTag !== "Player" && meta.gamerTag !== "operative") {
          hasDragonId = true;
        }
      } catch {}
    }

    return NextResponse.json({
      success: true,
      verified: true,
      hasDragonId,
      message: "Dragon ID verification confirmed.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    console.error("[API:OTP:Verify] Error:", msg);
    return NextResponse.json(
      { success: false, error: "Connection problem. Please try again." },
      { status: 500 }
    );
  }
}
