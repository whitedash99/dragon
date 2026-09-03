import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export type AdminRole = "OWNER" | "ADMIN" | "EDITOR" | "MODERATOR" | "ANALYST";

export interface AuthenticatedAdminContext {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    status: string;
    department: string | null;
    isProtected: boolean;
    isActive: boolean;
    isDeleted: boolean;
  };
  session: {
    id: string;
    sessionToken: string;
    createdAt: Date;
    expiresAt: Date;
    ipAddress: string | null;
    userAgent: string | null;
  };
}

/**
 * Returns configured initial owner emails.
 * Official Owner Email with God-Level Supreme Access:
 * - whitedash99@gmail.com (ONLY)
 */
export function getInitialOwnerEmails(): string[] {
  return ["whitedash99@gmail.com"];
}

/**
 * Validates whether an email matches the sole authorized owner.
 * Strictly enforces that ONLY whitedash99@gmail.com is allowed.
 */
export function isConfiguredOwnerEmail(email: string): boolean {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  return clean === "whitedash99@gmail.com";
}

/**
 * Server-Side Guard: Enforces that the request has an active, authenticated staff session.
 */
export async function requireAuthenticatedUser(): Promise<
  | { authorized: false; response: NextResponse; context: null }
  | { authorized: true; response: null; context: AuthenticatedAdminContext }
> {
  const auth = await getAuthenticatedUser();

  if (!auth || !auth.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "401 Unauthorized: Valid session required." },
        { status: 401 }
      ),
      context: null,
    };
  }

  const { user, session } = auth;

  // Supreme Owner Auto-Promotion & Safety Protection
  if (isConfiguredOwnerEmail(user.email)) {
    user.role = "OWNER";
    user.isProtected = true;
    user.status = "ACTIVE";
    user.isActive = true;
    user.isDeleted = false;
  }

  // Account status check (ACTIVE only)
  if (user.status !== "ACTIVE" || !user.isActive || user.isDeleted) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "403 Forbidden: Account suspended or disabled." },
        { status: 403 }
      ),
      context: null,
    };
  }

  // Reject customer accounts from admin panel
  if (user.role === "USER") {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "403 Forbidden: Customer accounts cannot access the administrative control system." },
        { status: 403 }
      ),
      context: null,
    };
  }

  // Strict Security Isolation: For now, ONLY whitedash99@gmail.com is authorized to access the system
  if (user.email.toLowerCase().trim() !== "whitedash99@gmail.com") {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "403 Forbidden: Access restricted. Only whitedash99@gmail.com is authorized." },
        { status: 403 }
      ),
      context: null,
    };
  }

  return {
    authorized: true,
    response: null,
    context: { user, session },
  };
}

/**
 * Server-Side Guard: Enforces Admin or Owner role.
 */
export async function requireAdmin(): Promise<
  | { authorized: false; response: NextResponse; context: null }
  | { authorized: true; response: null; context: AuthenticatedAdminContext }
> {
  const authResult = await requireAuthenticatedUser();
  if (!authResult.authorized) return authResult;

  const role = authResult.context.user.role.toUpperCase();
  const allowedRoles = ["OWNER", "FOUNDER", "BREAK_GLASS", "SUPER_ADMIN", "ADMIN", "ADMINISTRATOR", "CEO", "CTO"];

  if (!allowedRoles.includes(role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "403 Forbidden: Administrative privileges required." },
        { status: 403 }
      ),
      context: null,
    };
  }

  return authResult;
}

/**
 * Server-Side Guard: Strictly enforces Owner-only authorization.
 */
export async function requireOwner(): Promise<
  | { authorized: false; response: NextResponse; context: null }
  | { authorized: true; response: null; context: AuthenticatedAdminContext }
> {
  const authResult = await requireAuthenticatedUser();
  if (!authResult.authorized) return authResult;

  const role = authResult.context.user.role.toUpperCase();
  const isOwner = role === "OWNER" || role === "FOUNDER" || role === "BREAK_GLASS" || isConfiguredOwnerEmail(authResult.context.user.email);

  if (!isOwner) {
    await recordSecurityAudit({
      userId: authResult.context.user.id,
      userEmail: authResult.context.user.email,
      action: "UNAUTHORIZED_OWNER_ACTION_ATTEMPT",
      resource: "OWNER_GATEWAY",
      details: `User with role ${role} attempted an owner-restricted operation`,
    });

    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: "403 Forbidden: Owner authorization required for this critical operation." },
        { status: 403 }
      ),
      context: null,
    };
  }

  return authResult;
}

/**
 * Server-Side Guard: Enforces specific allowed roles.
 */
export async function requireRole(allowedRoles: string[]): Promise<
  | { authorized: false; response: NextResponse; context: null }
  | { authorized: true; response: null; context: AuthenticatedAdminContext }
> {
  const authResult = await requireAuthenticatedUser();
  if (!authResult.authorized) return authResult;

  const role = authResult.context.user.role.toUpperCase();
  const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

  // Owners always satisfy any role requirement with full god-level access
  if (role === "OWNER" || role === "FOUNDER" || role === "BREAK_GLASS" || isConfiguredOwnerEmail(authResult.context.user.email)) {
    return authResult;
  }

  if (!normalizedAllowed.includes(role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: `403 Forbidden: Required role [${allowedRoles.join(", ")}] not held.` },
        { status: 403 }
      ),
      context: null,
    };
  }

  return authResult;
}

/**
 * Server-Side Guard: Enforces granular permission check.
 */
export async function requirePermission(permission: string): Promise<
  | { authorized: false; response: NextResponse; context: null }
  | { authorized: true; response: null; context: AuthenticatedAdminContext }
> {
  const authResult = await requireAuthenticatedUser();
  if (!authResult.authorized) return authResult;

  const user = authResult.context.user;
  const role = user.role.toUpperCase();

  // Owners have all permissions by default
  if (role === "OWNER" || role === "FOUNDER" || role === "BREAK_GLASS" || isConfiguredOwnerEmail(user.email)) {
    return authResult;
  }

  // Parse permissions array
  let userPerms: string[] = [];
  try {
    const raw = (user as unknown as { permissions?: string | null }).permissions;
    if (raw) userPerms = JSON.parse(raw);
  } catch {}

  if (!userPerms.includes(permission) && !userPerms.includes("*") && role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: `403 Forbidden: Missing required permission [${permission}].` },
        { status: 403 }
      ),
      context: null,
    };
  }

  return authResult;
}

/**
 * Step-Up Authentication Guard: Requires recent authentication within maxAgeMs (default 15 mins).
 */
export async function requireRecentAuthentication(maxAgeMs = 15 * 60 * 1000): Promise<
  | { authorized: false; response: NextResponse; context: null }
  | { authorized: true; response: null; context: AuthenticatedAdminContext }
> {
  const authResult = await requireAuthenticatedUser();
  if (!authResult.authorized) return authResult;

  const sessionCreatedAt = new Date(authResult.context.session.createdAt).getTime();
  const sessionAge = Date.now() - sessionCreatedAt;

  if (sessionAge > maxAgeMs) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          success: false,
          error: "401 Step-Up Authentication Required: Please re-enter your credentials for this sensitive operation.",
          requireReauth: true,
        },
        { status: 401 }
      ),
      context: null,
    };
  }

  return authResult;
}

/**
 * Zero-Owner Safety Invariant: Prevents deleting, demoting, or suspending the final active Owner account.
 */
export async function assertNotZeroOwners(targetUserId: string, newRole?: string, newStatus?: string): Promise<{ safe: boolean; error?: string }> {
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, email: true, role: true, status: true, isActive: true, isDeleted: true },
  });

  if (!targetUser) {
    return { safe: true };
  }

  // Official owners can never be demoted, suspended, or deleted
  if (isConfiguredOwnerEmail(targetUser.email)) {
    if (newRole && !["OWNER", "FOUNDER", "BREAK_GLASS"].includes(newRole.toUpperCase())) {
      return { safe: false, error: "CRITICAL SAFETY GUARD: Official Dragon Studios Owner account is protected and cannot be demoted." };
    }
    if (newStatus && newStatus !== "ACTIVE") {
      return { safe: false, error: "CRITICAL SAFETY GUARD: Official Dragon Studios Owner account cannot be disabled or suspended." };
    }
  }

  const targetIsOwner = ["OWNER", "FOUNDER", "BREAK_GLASS"].includes(targetUser.role.toUpperCase());
  if (!targetIsOwner) {
    return { safe: true };
  }

  const isDemoting = newRole && !["OWNER", "FOUNDER", "BREAK_GLASS"].includes(newRole.toUpperCase());
  const isDeactivating = newStatus && newStatus !== "ACTIVE";

  if (!isDemoting && !isDeactivating) {
    return { safe: true };
  }

  // Count remaining active owners in database
  const activeOwners = await prisma.user.count({
    where: {
      role: { in: ["OWNER", "FOUNDER", "BREAK_GLASS"] },
      status: "ACTIVE",
      isActive: true,
      isDeleted: false,
      id: { not: targetUserId },
    },
  });

  if (activeOwners < 1) {
    return {
      safe: false,
      error: "CRITICAL SAFETY GUARD: Operation rejected. The system cannot have zero active Owners.",
    };
  }

  return { safe: true };
}

/**
 * Military Password Policy Validator:
 * - Minimum 16 characters
 * - Uppercase letter (A-Z)
 * - Lowercase letter (a-z)
 * - Numeric digit (0-9)
 * - Special character symbol (!@#$%^&*...)
 */
export function validateAdminPasswordPolicy(password: string): { valid: boolean; error?: string } {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required." };
  }
  if (password.length < 16) {
    return { valid: false, error: "Password must be at least 16 characters in length." };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter (A-Z)." };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter (a-z)." };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one numeric digit (0-9)." };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character symbol." };
  }
  return { valid: true };
}

/**
 * Generates a cryptographically random 256-bit hex token.
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Computes a SHA-256 hash of a token for secure database storage.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Sliding-Window In-Memory Rate Limiter with automatic pruning.
 */
interface RateLimitBucket {
  timestamps: number[];
}
const rateLimitMap = new Map<string, RateLimitBucket>();

export function checkRateLimit(key: string, maxRequests: number, windowMs: number): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  let bucket = rateLimitMap.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    rateLimitMap.set(key, bucket);
  }

  bucket.timestamps = bucket.timestamps.filter((ts) => ts > windowStart);

  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.timestamps.length === 0 || v.timestamps[v.timestamps.length - 1] < windowStart) {
        rateLimitMap.delete(k);
      }
    }
  }

  if (bucket.timestamps.length >= maxRequests) {
    const oldestTimestamp = bucket.timestamps[0];
    const resetMs = Math.max(0, oldestTimestamp + windowMs - now);
    return { allowed: false, remaining: 0, resetMs };
  }

  bucket.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - bucket.timestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Structured Security Audit Logger with sanitized metadata.
 * NEVER logs passwords, tokens, API keys, or raw secrets.
 */
export async function recordSecurityAudit(params: {
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  details?: string;
  ipAddress?: string;
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}) {
  const { userId, userEmail, action, resource, details, ipAddress, severity = "MEDIUM" } = params;

  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        userEmail: userEmail || "system",
        action,
        resource,
        details: details || `Security event: ${action} on ${resource}`,
      },
    });

    await prisma.securityEvent.create({
      data: {
        eventType: action,
        severity,
        userEmail: userEmail || "system",
        ipAddress: ipAddress || null,
        details: details || null,
      },
    });
  } catch (err) {
    console.warn("[SecurityAudit Error]: Failed to record audit log:", err);
  }
}
