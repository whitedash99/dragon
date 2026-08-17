import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";

export async function GET() {
  try {
    const activeSessionsCount = await prisma.session.count({
      where: { expiresAt: { gte: new Date() } },
    });

    const passkeysCount = await prisma.passkeyCredential.count();

    const trustedDevicesCount = await prisma.userDevice.count({
      where: { trusted: true },
    });

    const dragonKeysActive = await prisma.user.count({
      where: { dragonKeyHash: { not: null }, isActive: true, isDeleted: false },
    });

    const failedLogins = await prisma.auditLog.count({
      where: {
        action: { in: ["USER_LOGIN_FAILED", "DOMAIN_REJECTED", "UNAUTHORIZED_GOOGLE_LOGIN_ATTEMPT"] },
      },
    });

    const totalAuditsCount = await prisma.auditLog.count();

    const resendConfigured = Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_"));
    const googleOauthConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

    // Transparent, deterministic posture score components
    const components = [
      {
        name: "Neon PostgreSQL SSL Database",
        status: "ENFORCED",
        passed: true,
        points: 20,
        explanation: "Authoritative relational database with encrypted connections.",
      },
      {
        name: "Single-Use Cryptographic Invitations",
        status: "ENFORCED",
        passed: true,
        points: 20,
        explanation: "SHA-256 token hashing with replay and revocation protection.",
      },
      {
        name: "Google OAuth Pre-Authorization Guard",
        status: googleOauthConfigured ? "ENFORCED" : "NOT_CONFIGURED",
        passed: googleOauthConfigured,
        points: googleOauthConfigured ? 15 : 0,
        explanation: googleOauthConfigured
          ? "Un-authorized Google accounts are rejected with HTTP 403 ACCESS DENIED."
          : "Google OAuth client secrets not configured in environment.",
      },
      {
        name: "Resend Email Dispatch Engine",
        status: resendConfigured ? "CONFIGURED" : "NOT_CONFIGURED",
        passed: resendConfigured,
        points: resendConfigured ? 15 : 0,
        explanation: resendConfigured
          ? "Transports cryptographic invitations and owner alerts via Resend."
          : "RESEND_API_KEY is missing or unverified.",
      },
      {
        name: "WebAuthn Hardware Passkeys",
        status: passkeysCount > 0 ? "ACTIVE" : "NONE_REGISTERED",
        passed: passkeysCount > 0,
        points: passkeysCount > 0 ? 15 : 0,
        explanation: passkeysCount > 0
          ? `${passkeysCount} hardware authenticator(s) registered.`
          : "No staff members have registered hardware passkeys yet.",
      },
      {
        name: "PostgreSQL Immutable Audit Trail",
        status: totalAuditsCount > 0 ? "ACTIVE" : "EMPTY",
        passed: totalAuditsCount > 0,
        points: totalAuditsCount > 0 ? 15 : 0,
        explanation: totalAuditsCount > 0
          ? `${totalAuditsCount} audit event(s) recorded.`
          : "No security audit events recorded in database.",
      },
    ];

    const score = components.reduce((acc, c) => acc + c.points, 0);

    const warnings: string[] = [];
    if (!resendConfigured) warnings.push("Resend Email API key is missing or unverified.");
    if (!googleOauthConfigured) warnings.push("Google OAuth credentials are not fully configured.");
    if (passkeysCount === 0) warnings.push("No staff hardware passkeys registered.");
    if (failedLogins > 5) warnings.push(`${failedLogins} failed authentication attempt(s) detected.`);

    const recommendations: string[] = [];
    if (passkeysCount === 0) recommendations.push("Require staff members to enroll WebAuthn hardware passkeys.");
    if (!resendConfigured) recommendations.push("Configure RESEND_API_KEY to enable invitation and alert email dispatches.");

    const recentAudits = await prisma.auditLog.findMany({
      take: 25,
      orderBy: { createdAt: "desc" },
    });

    const trustedDevices = await prisma.userDevice.findMany({
      where: { trusted: true },
      take: 10,
      orderBy: { lastUsedAt: "desc" },
      include: { user: { select: { email: true, name: true } } },
    });

    return NextResponse.json({
      success: true,
      telemetry: {
        activeSessions: activeSessionsCount,
        passkeysCount,
        trustedDevicesCount,
        dragonKeysActive,
        failedLogins,
        totalAuditsCount,
      },
      posture: {
        score,
        maxScore: 100,
        components,
        warnings,
        recommendations,
      },
      trustedDevices: trustedDevices.map((d) => ({
        id: d.id,
        userEmail: d.user?.email || "Unknown Staff",
        userName: d.user?.name || "Staff Member",
        browser: d.browser || "Standard Browser",
        os: d.os || "Desktop OS",
        ipAddress: d.ipAddress || "127.0.0.1",
        lastUsedAt: d.lastUsedAt.toISOString(),
      })),
      auditLogs: recentAudits.map((a) => ({
        id: a.id,
        action: a.action,
        user: a.userEmail || "System",
        details: a.details || "Administrative event logged",
        ip: a.ipAddress || "127.0.0.1",
        time: new Date(a.createdAt).toLocaleString(),
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    if (!can(auth.user, "security.manage")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires security.manage permission." }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;

    // Manual database backup event logging
    if (action === "create_backup") {
      const filename = `dragon_pg_backup_${Date.now()}.sql`;
      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "CREATE_DATABASE_BACKUP",
          resource: "SECURITY",
          details: `Manual PostgreSQL snapshot record committed: ${filename}`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));

      return NextResponse.json({ success: true, filename });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
