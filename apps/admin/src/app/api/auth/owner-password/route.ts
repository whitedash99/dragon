import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { hashPassword, invalidateAllUserSessions } from "@/lib/auth/auth";
import {
  isConfiguredOwnerEmail,
  validateAdminPasswordPolicy,
  checkRateLimit,
  recordSecurityAudit,
} from "@/lib/auth/security";

export async function POST(req: NextRequest) {
  try {
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "localhost";
    const body = await req.json();
    const { email, newPassword, securityCode } = body;

    // Strict rate limiting: 3 attempts per 30 minutes
    const rateLimit = checkRateLimit(`owner_pwd_${ipAddress}`, 3, 30 * 60 * 1000);
    if (!rateLimit.allowed) {
      await recordSecurityAudit({
        userEmail: email || "unknown",
        action: "OWNER_RECOVERY_RATE_LIMITED",
        resource: "OWNER_VAULT",
        details: `Rate limit triggered on owner recovery from IP: ${ipAddress}`,
        severity: "CRITICAL",
        ipAddress,
      });

      return NextResponse.json(
        { success: false, error: "Too many attempts. Owner vault locked for 30 minutes." },
        { status: 429 }
      );
    }

    if (!email || !newPassword || !securityCode) {
      return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email matches configured initial owners
    if (!isConfiguredOwnerEmail(cleanEmail)) {
      await recordSecurityAudit({
        userEmail: cleanEmail,
        action: "UNAUTHORIZED_OWNER_RECOVERY_ATTEMPT",
        resource: "OWNER_VAULT",
        details: `Non-owner email attempted owner recovery: ${cleanEmail}`,
        severity: "CRITICAL",
        ipAddress,
      });

      return NextResponse.json({ success: false, error: "Access Denied: Invalid clearance." }, { status: 403 });
    }

    // Clearance Code verification from secure environment variables only
    const envRecoverySecret = process.env.OWNER_RECOVERY_SECRET || process.env.OWNER_CLEARANCE_KEY;
    if (!envRecoverySecret || securityCode !== envRecoverySecret) {
      await recordSecurityAudit({
        userEmail: cleanEmail,
        action: "INVALID_OWNER_CLEARANCE_CODE",
        resource: "OWNER_VAULT",
        details: `Invalid clearance code provided for ${cleanEmail} from IP ${ipAddress}`,
        severity: "CRITICAL",
        ipAddress,
      });

      return NextResponse.json({ success: false, error: "Access Denied: Invalid Owner Security Clearance Code." }, { status: 401 });
    }

    // Password policy validation
    const passCheck = validateAdminPasswordPolicy(newPassword);
    if (!passCheck.valid) {
      return NextResponse.json({ success: false, error: passCheck.error || "Password policy validation failed." }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);

    const updatedUser = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        password: passwordHash,
        role: "OWNER",
        status: "ACTIVE",
        isActive: true,
        isDeleted: false,
        isProtected: true,
        permissions: JSON.stringify(["*"]),
      },
      create: {
        email: cleanEmail,
        name: cleanEmail.split("@")[0],
        password: passwordHash,
        role: "OWNER",
        status: "ACTIVE",
        isActive: true,
        isDeleted: false,
        isProtected: true,
        permissions: JSON.stringify(["*"]),
      },
    });

    // Invalidate all active sessions for security
    await invalidateAllUserSessions(updatedUser.id);

    await recordSecurityAudit({
      userId: updatedUser.id,
      userEmail: updatedUser.email,
      action: "OWNER_CREDENTIALS_RESET_VAULT",
      resource: "OWNER_VAULT",
      details: `Owner password updated via recovery vault and all sessions revoked from ${ipAddress}`,
      severity: "CRITICAL",
      ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: "Owner credentials securely updated. All active sessions invalidated. Please log in.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
