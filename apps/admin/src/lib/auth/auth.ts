import bcrypt from "bcryptjs";
import { prisma } from "@/lib/database/prisma";
import { cookies } from "next/headers";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash?: string | null): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(userId: string, ipAddress?: string, userAgent?: string) {
  // Invalidate any existing sessions for this user to enforce session fixation protection & rotation
  await prisma.session.deleteMany({ where: { userId } }).catch(() => {});

  const sessionToken = `session_${Math.random().toString(36).substring(2, 18)}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await prisma.session.create({
    data: {
      userId,
      sessionToken,
      ipAddress: ipAddress || "127.0.0.1",
      userAgent: userAgent || "Dragon Admin Client",
      expiresAt,
    },
  });

  try {
    const cookieStore = await cookies();
    cookieStore.set("dragon_admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });
  } catch (e: unknown) {
    console.warn("Cookie set warning:", e);
  }

  return session;
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("dragon_admin_session")?.value;

  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  // Ensure active status and not deleted
  if (!session.user.isActive || session.user.isDeleted || session.user.status === "DISABLED" || session.user.status === "DEACTIVATED") {
    return null;
  }

  return {
    user: session.user,
    session,
  };
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("dragon_admin_session")?.value;

  if (sessionToken) {
    try {
      await prisma.session.delete({ where: { sessionToken } });
    } catch {
      // Session already removed
    }
  }

  cookieStore.set("dragon_admin_session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
}

/**
 * Enforces recent authentication (Step-Up Auth) within maxAgeMs (default 15 minutes) for sensitive operations.
 */
export function verifyRecentReauthentication(session: { createdAt: Date }, maxAgeMs = 15 * 60 * 1000): boolean {
  if (!session || !session.createdAt) return false;
  const age = Date.now() - new Date(session.createdAt).getTime();
  return age <= maxAgeMs;
}

/**
 * Centralized audit logging helper for security events.
 */
export async function recordAuditEvent(
  userId?: string | null,
  userEmail?: string | null,
  action: string = "UNKNOWN_ACTION",
  resource?: string,
  details?: string,
  ipAddress?: string
) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId,
        userEmail: userEmail || "System",
        action,
        resource: resource || "SYSTEM",
        details: details || "Security event logged",
        ipAddress: ipAddress || "127.0.0.1",
      },
    });
  } catch (e) {
    console.warn("Record audit event warning:", e);
    return null;
  }
}

export function checkRolePermission(userRole: string, resource: string): boolean {
  if (userRole === "OWNER" || userRole === "SUPER_ADMIN" || userRole === "FOUNDER" || userRole === "CO_FOUNDER") return true;

  if (userRole === "SUPPORT") {
    return resource === "crm" || resource === "knowledge" || resource === "notifications";
  }

  if (userRole === "EDITOR") {
    return resource === "cms font" || resource === "cms" || resource === "media";
  }

  if (userRole === "DEVELOPER") {
    return resource === "developer" || resource === "performance" || resource === "deployments" || resource === "api-platform";
  }

  return true;
}
