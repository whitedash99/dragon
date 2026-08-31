import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { verifyOtpCode } from "@/lib/otp";
import { prisma } from "@/lib/prisma";
import { parseProfileMetadata } from "@/lib/user-profile";
import { checkRateLimit } from "@dragon/utils";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  try {
    const body = await req.json().catch(() => ({}));
    const { code, email: bodyEmail } = body;

    // Identify target email: from NextAuth session, pending cookie, or request body
    const session = await getServerSession(authOptions).catch(() => null);
    const pendingCookieEmail = req.cookies.get("dragon_pending_email")?.value;
    const targetEmail = (session?.user?.email || pendingCookieEmail || bodyEmail || "").toLowerCase().trim();

    if (!targetEmail) {
      return NextResponse.json(
        { success: false, error: "Authentication session or email reference required." },
        { status: 401 }
      );
    }

    // Rate limit verification attempts (max 10 attempts per 10 minutes per identity)
    const verifyLimit = checkRateLimit(`otp:verify:${targetEmail}:${ip}`, 10, 10 * 60 * 1000);
    if (!verifyLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many verification attempts. Please request a new code." },
        { status: 429 }
      );
    }

    if (!code || typeof code !== "string" || !/^\d{6}$/.test(code.trim())) {
      return NextResponse.json(
        { success: false, error: "Invalid verification code format. Enter a 6-digit code." },
        { status: 400 }
      );
    }

    // Verify candidate OTP against PostgreSQL hashed records
    const result = await verifyOtpCode(targetEmail, code.trim(), ip);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "That verification code is incorrect." },
        { status: 400 }
      );
    }

    // 1. Mark email as verified on user model in database
    const dbUser = await prisma.user.update({
      where: { email: targetEmail },
      data: {
        emailVerified: new Date(),
        status: "ACTIVE",
      },
      include: { profile: true },
    });

    // 2. Issue persistent dragon_session cookie for direct session validation
    const sessionToken = `dragon_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await prisma.session.create({
      data: {
        sessionToken,
        userId: dbUser.id,
        expiresAt: expires,
        ipAddress: ip,
        userAgent: req.headers.get("user-agent") || undefined,
      },
    }).catch(() => {});

    // 3. Determine correct redirect URL from onboarding state
    const meta = parseProfileMetadata(dbUser.profile?.notificationSettings, dbUser.name);
    const redirectUrl = meta.hasCompletedDragonId
      ? "/dashboard"
      : meta.hasCompletedWelcome
      ? "/dragon-id/setup"
      : "/welcome";

    const response = NextResponse.json({
      success: true,
      verified: true,
      hasDragonId: meta.hasCompletedDragonId,
      hasCompletedWelcome: meta.hasCompletedWelcome,
      redirectUrl,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        dragonId: dbUser.dragonId,
        gamerTag: meta.gamerTag,
      },
      message: "Identity confirmed. Access granted.",
    });

    // Set secure HTTP-only session cookie
    response.cookies.set("dragon_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires,
      path: "/",
    });

    // Clear pending email cookie
    response.cookies.delete("dragon_pending_email");

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    console.error("[API:OTP:Verify] Error:", msg);
    return NextResponse.json(
      { success: false, error: "Connection problem. Please try again." },
      { status: 500 }
    );
  }
}
