import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { hashPassword, invalidateAllUserSessions } from "@/lib/auth/auth";
import { validateAdminPasswordPolicy, checkRateLimit, recordSecurityAudit } from "@/lib/auth/security";

export async function POST(req: NextRequest) {
  try {
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "localhost";
    const body = await req.json();
    const { email, newPassword, token } = body;

    // Rate Limiting: 5 attempts per 15 minutes per IP
    const rateLimit = checkRateLimit(`pwd_reset_${ipAddress}`, 5, 15 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many password reset requests. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    if (!email || !newPassword || !token) {
      return NextResponse.json(
        { success: false, error: "Email, new password, and reset token are required." },
        { status: 400 }
      );
    }

    if (!token.startsWith("DRG-RST-")) {
      return NextResponse.json({ success: false, error: "Invalid or expired password reset token." }, { status: 400 });
    }

    const passCheck = validateAdminPasswordPolicy(newPassword);
    if (!passCheck.valid) {
      return NextResponse.json({ success: false, error: passCheck.error || "Password policy validation failed." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      // Account enumeration protection: Generic error
      return NextResponse.json({ success: false, error: "Invalid or expired password reset token." }, { status: 400 });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Invalidate all active sessions for security
    await invalidateAllUserSessions(user.id);

    await recordSecurityAudit({
      userId: user.id,
      userEmail: user.email,
      action: "PASSWORD_RESET_SUCCESS",
      resource: "AUTH_SECURITY",
      details: `Password reset successfully completed and all existing sessions revoked from ${ipAddress}`,
      severity: "HIGH",
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully. All active sessions invalidated. Please log in again.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
