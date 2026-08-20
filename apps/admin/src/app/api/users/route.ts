import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { invalidateAllUserSessions } from "@/lib/auth/auth";
import {
  requireAdmin,
  requireOwner,
  assertNotZeroOwners,
  recordSecurityAudit,
} from "@/lib/auth/security";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const q = searchParams.get("q");

    const users = await prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      include: { profile: true },
    });

    const filtered = users.filter((u) => {
      const matchesSearch =
        !q ||
        (u.name && u.name.toLowerCase().includes(q.toLowerCase())) ||
        u.email.toLowerCase().includes(q.toLowerCase()) ||
        (u.department && u.department.toLowerCase().includes(q.toLowerCase())) ||
        (u.provider && u.provider.toLowerCase().includes(q.toLowerCase()));
      const matchesRole = !role || role === "All" || u.role === role;
      return matchesSearch && matchesRole;
    });

    const userIds = filtered.map((u) => u.id);

    const [allPasskeys, allSessions, allAuditLogs] = await Promise.all([
      prisma.passkeyCredential.findMany({
        where: { userId: { in: userIds } },
        select: { id: true, userId: true, deviceType: true, createdAt: true },
      }),
      prisma.session.findMany({
        where: { userId: { in: userIds }, expiresAt: { gte: new Date() } },
        select: { id: true, userId: true, ipAddress: true, userAgent: true, expiresAt: true, createdAt: true },
      }),
      prisma.auditLog.findMany({
        where: { userId: { in: userIds } },
        take: 100,
        orderBy: { createdAt: "desc" },
        select: { id: true, userId: true, action: true, details: true, ipAddress: true, createdAt: true },
      }),
    ]);

    const passkeysByUserId = new Map<string, typeof allPasskeys>();
    for (const pk of allPasskeys) {
      const list = passkeysByUserId.get(pk.userId) || [];
      list.push(pk);
      passkeysByUserId.set(pk.userId, list);
    }

    const sessionsByUserId = new Map<string, typeof allSessions>();
    for (const s of allSessions) {
      const list = sessionsByUserId.get(s.userId) || [];
      list.push(s);
      sessionsByUserId.set(s.userId, list);
    }

    const auditByUserId = new Map<string, typeof allAuditLogs>();
    for (const a of allAuditLogs) {
      if (!a.userId) continue;
      const list = auditByUserId.get(a.userId) || [];
      list.push(a);
      auditByUserId.set(a.userId, list);
    }

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive && u.status === "ACTIVE").length;
    const adminsCount = users.filter(
      (u) => ["FOUNDER", "CO_FOUNDER", "SUPER_ADMIN", "ADMINISTRATOR", "ADMIN", "OWNER"].includes(u.role)
    ).length;
    const suspendedCount = users.filter((u) => !u.isActive || u.status === "SUSPENDED" || u.status === "DISABLED" || u.status === "DEACTIVATED").length;

    const enrichedUsers = filtered.map((u) => {
      const passkeys = passkeysByUserId.get(u.id) || [];
      const sessions = sessionsByUserId.get(u.id) || [];
      const userAuditLogs = auditByUserId.get(u.id) || [];
      return {
        ...u,
        passkeys,
        sessions,
        auditLogs: userAuditLogs,
        passkeysCount: passkeys.length,
        activeSessionsCount: sessions.length,
      };
    });

    return NextResponse.json({
      success: true,
      users: enrichedUsers,
      telemetry: {
        totalUsers,
        activeUsers,
        adminsCount,
        suspendedCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireOwner();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { user: actor } = authResult.context;
    const body = await req.json();
    const { action, id, name, email, role, department, status, isActive } = body;

    // Remote Session Revocation
    if (action === "revoke_sessions" && id) {
      const targetUser = await prisma.user.findUnique({ where: { id } });
      if (!targetUser) {
        return NextResponse.json({ success: false, error: "User account not found." }, { status: 404 });
      }

      await invalidateAllUserSessions(id);

      await recordSecurityAudit({
        userId: actor.id,
        userEmail: actor.email,
        action: "REVOKE_ALL_SESSIONS",
        resource: "USERS_IAM",
        details: `All active sessions revoked for ${targetUser.email} by ${actor.email}`,
        severity: "MEDIUM",
      });

      return NextResponse.json({ success: true, message: `All active sessions revoked for ${targetUser.email}.` });
    }

    if (!id && !email) {
      return NextResponse.json({ success: false, error: "User ID or Email is required." }, { status: 400 });
    }

    // Zero-Owner Invariant Check
    if (id) {
      const targetUser = await prisma.user.findUnique({ where: { id } });
      if (!targetUser) {
        return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
      }

      const zeroOwnerCheck = await assertNotZeroOwners(id, role, status);
      if (!zeroOwnerCheck.safe) {
        return NextResponse.json({ success: false, error: zeroOwnerCheck.error }, { status: 403 });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name: name !== undefined ? name : undefined,
          role: role !== undefined ? role : undefined,
          department: department !== undefined ? department : undefined,
          status: status !== undefined ? status : undefined,
          isActive: isActive !== undefined ? isActive : undefined,
          isProtected: role === "OWNER" || role === "FOUNDER" ? true : undefined,
          updatedAt: new Date(),
        },
      });

      // If status or role changed, invalidate user sessions
      if (status !== undefined || role !== undefined || isActive === false) {
        await invalidateAllUserSessions(id);
      }

      await recordSecurityAudit({
        userId: actor.id,
        userEmail: actor.email,
        action: "UPDATE_USER_IAM",
        resource: "USERS_IAM",
        details: `Modified administrator: ${updatedUser.email} -> Role: ${updatedUser.role}, Status: ${updatedUser.status}`,
        severity: "HIGH",
      });

      return NextResponse.json({ success: true, user: updatedUser });
    }

    return NextResponse.json({ success: false, error: "Direct provisioning without invitation is disabled. Use Owner Invitation." }, { status: 403 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireOwner();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { user: actor } = authResult.context;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action") || "suspend";

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    // Zero-Owner Invariant Check
    const zeroOwnerCheck = await assertNotZeroOwners(id, undefined, "SUSPENDED");
    if (!zeroOwnerCheck.safe) {
      return NextResponse.json({ success: false, error: zeroOwnerCheck.error }, { status: 403 });
    }

    if (action === "delete") {
      await prisma.user.update({
        where: { id },
        data: { isDeleted: true, status: "DELETED", isActive: false },
      });
      await invalidateAllUserSessions(id);
    } else {
      await prisma.user.update({
        where: { id },
        data: { status: "SUSPENDED", isActive: false },
      });
      await invalidateAllUserSessions(id);
    }

    await recordSecurityAudit({
      userId: actor.id,
      userEmail: actor.email,
      action: action === "delete" ? "DELETE_ADMIN_USER" : "SUSPEND_ADMIN_USER",
      resource: "USERS_IAM",
      details: `Administrator account ${action}ed: ${targetUser.email} by ${actor.email}`,
      severity: "CRITICAL",
    });

    return NextResponse.json({ success: true, message: `Administrator account ${action}ed successfully.` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
