import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/database/prisma";
import { cookies } from "next/headers";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash?: string | null): Promise<boolean> {
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

/**
 * Creates a cryptographically random, high-entropy administrative session.
 * Rotates existing sessions to prevent session fixation.
 */
export async function createAdminSession(userId: string, ipAddress?: string, userAgent?: string) {
  // Session rotation: Invalidate existing sessions for this user on new authentication
  await prisma.session.deleteMany({ where: { userId } }).catch(() => {});

  const sessionToken = `session_${crypto.randomBytes(32).toString("hex")}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days absolute

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

/**
 * Retrieves the currently authenticated staff user and session.
 * Enforces ACTIVE, non-suspended, non-deleted status.
 */
export async function getAuthenticatedUser() {
  let sessionToken: string | undefined;

  try {
    const cookieStore = await cookies();
    sessionToken = cookieStore.get("dragon_admin_session")?.value;
  } catch {
    sessionToken = undefined;
  }

  // 1. Check custom dragon_admin_session database record
  if (sessionToken) {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (session && session.expiresAt >= new Date()) {
      const { user } = session;

      if (
        user.isActive &&
        !user.isDeleted &&
        user.status !== "SUSPENDED" &&
        user.status !== "REVOKED" &&
        user.status !== "DISABLED" &&
        user.status !== "DEACTIVATED" &&
        user.status !== "PENDING"
      ) {
        return {
          user,
          session,
        };
      }
    }
  }

  // 2. Check NextAuth (Google OAuth) session
  try {
    const { getServerSession } = await import("next-auth");
    const { adminAuthOptions } = await import("./authOptions");
    const nextAuthSession = await getServerSession(adminAuthOptions);

    if (nextAuthSession?.user?.email) {
      const cleanEmail = nextAuthSession.user.email.toLowerCase().trim();
      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });

      if (
        user &&
        user.isActive &&
        !user.isDeleted &&
        user.status !== "SUSPENDED" &&
        user.status !== "REVOKED" &&
        user.status !== "DISABLED" &&
        user.status !== "DEACTIVATED" &&
        user.status !== "PENDING"
      ) {
        return {
          user,
          session: {
            id: `nextauth_${user.id}`,
            sessionToken: `nextauth_${user.id}`,
            userId: user.id,
            ipAddress: "Google OAuth",
            userAgent: "NextAuth Client",
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        };
      }
    }
  } catch (err) {
    console.warn("NextAuth session check error in getAuthenticatedUser:", err);
  }

  return null;
}

/**
 * Invalides the current session cookie and database session record.
 */
export async function destroyAdminSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("dragon_admin_session")?.value;

    if (sessionToken) {
      await prisma.session.delete({ where: { sessionToken } }).catch(() => {});
    }

    cookieStore.set("dragon_admin_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });
  } catch (e) {
    console.warn("Destroy session error:", e);
  }
}

/**
 * Invalides ALL active sessions for a specific user ID.
 * Critical for account suspension, role changes, and password resets.
 */
export async function invalidateAllUserSessions(userId: string) {
  try {
    await prisma.session.deleteMany({ where: { userId } });
  } catch (e) {
    console.warn("Invalidate user sessions error:", e);
  }
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
