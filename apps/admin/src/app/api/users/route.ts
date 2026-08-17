import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can, canModifyUser } from "@dragon/auth";

export async function GET(req: NextRequest) {
  try {
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
    const suspendedCount = users.filter((u) => !u.isActive || u.status === "DISABLED" || u.status === "DEACTIVATED").length;

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
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (!can(auth.user, "users.manage")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires users.manage permission." }, { status: 403 });
    }

    const body = await req.json();
    const { action, id, name, email, role, department, status, isActive } = body;

    // Remote Session Revocation
    if (action === "revoke_sessions" && id) {
      const targetUser = await prisma.user.findUnique({ where: { id } });
      if (!targetUser) {
        return NextResponse.json({ success: false, error: "User account not found." }, { status: 404 });
      }

      const check = canModifyUser(auth.user.role, targetUser.role, targetUser.isProtected);
      if (!check.allowed && auth.user.id !== targetUser.id) {
        return NextResponse.json({ success: false, error: `Security Guard: ${check.reason}` }, { status: 403 });
      }

      await prisma.session.deleteMany({ where: { userId: id } });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "REVOKE_ALL_SESSIONS",
          resource: "USERS_IAM",
          details: `All active sessions revoked for ${targetUser.email} by ${auth.user.email}`,
        },
      }).catch((e: unknown) => console.warn("Audit log warning:", e));

      return NextResponse.json({ success: true, message: `All active sessions revoked for ${targetUser.email}.` });
    }

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify immutability rules if editing existing user
    if (id) {
      const targetUser = await prisma.user.findUnique({ where: { id } });
      if (targetUser) {
        const check = canModifyUser(auth.user.role, targetUser.role, targetUser.isProtected);
        if (!check.allowed) {
          return NextResponse.json({ success: false, error: `Security Guard: ${check.reason}` }, { status: 403 });
        }
      }
    }

    const user = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        name: name !== undefined ? name : undefined,
        role: role !== undefined ? role : undefined,
        department: department !== undefined ? department : undefined,
        status: status !== undefined ? status : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        updatedAt: new Date(),
      },
      create: {
        name: name || cleanEmail.split("@")[0],
        email: cleanEmail,
        password: "argon2id_hashed_default_pass",
        role: role || "USER",
        department: department || "General",
        status: status || "ACTIVE",
        provider: "credentials",
        isActive: isActive ?? true,
        isDeleted: false,
        profile: {
          create: {
            country: "United States",
            language: "en-US",
            theme: "dark",
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: id ? "UPDATE_USER" : "PROVISION_USER",
        resource: "USERS_IAM",
        details: `Modified User: ${user.email} -> Role: ${user.role}, Status: ${user.status}`,
      },
    }).catch((e: unknown) => console.warn("Audit log warning:", e));

    return NextResponse.json({ success: true, user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (!can(auth.user, "users.manage")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires users.manage permission." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const action = searchParams.get("action") || "disable";

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    // Verify immutability rules before disabling or deleting
    const check = canModifyUser(auth.user.role, user.role, user.isProtected);
    if (!check.allowed) {
      return NextResponse.json({ success: false, error: `Security Guard: ${check.reason}` }, { status: 403 });
    }

    if (action === "delete") {
      await prisma.user.update({
        where: { id },
        data: { isDeleted: true, status: "DELETED", isActive: false },
      });
      await prisma.session.deleteMany({ where: { userId: id } });
    } else {
      await prisma.user.update({
        where: { id },
        data: { status: "DISABLED", isActive: false },
      });
      await prisma.session.deleteMany({ where: { userId: id } });
    }

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: action === "delete" ? "DELETE_USER" : "DISABLE_USER",
        resource: "USERS_IAM",
        details: `User ${action}d: ${user.email} by ${auth.user.email}`,
      },
    }).catch((e: unknown) => console.warn("Audit log warning:", e));

    return NextResponse.json({ success: true, message: `User account ${action}d.` });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
