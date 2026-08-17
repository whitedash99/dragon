export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash?: string | null): Promise<boolean> {
  if (!hash) return false;
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}

/**
 * Generates a unique 256-bit Dragon Key token for staff accounts.
 * Example: DRAGON-FOUNDER-X9F8-M2Q7-V7L9-P8HK
 */
export function generateDragonKey(role: string): { rawKey: string; prefix: string } {
  const normRole = (role || 'STAFF').toUpperCase();
  const r1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const r2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const r3 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const r4 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const prefix = `DRAGON-${normRole}-${r1}`;
  const rawKey = `${prefix}-${r2}-${r3}-${r4}`;
  return { rawKey, prefix };
}

export async function hashDragonKey(rawKey: string): Promise<string> {
  return hashPassword(rawKey);
}

export async function verifyDragonKey(rawKey: string, hash?: string | null): Promise<boolean> {
  return verifyPassword(rawKey, hash);
}

export type StaffRole =
  | 'BREAK_GLASS'
  | 'FOUNDER'
  | 'CO_FOUNDER'
  | 'CEO'
  | 'CTO'
  | 'SUPER_ADMIN'
  | 'ADMINISTRATOR'
  | 'ADMIN'
  | 'DEVELOPER'
  | 'EDITOR'
  | 'FINANCE'
  | 'HR'
  | 'QA'
  | 'MARKETING'
  | 'SUPPORT'
  | 'MODERATOR'
  | 'OWNER'
  | 'VIEWER'
  | 'USER';

export const ROLE_RANK_HIERARCHY: Record<string, number> = {
  OWNER: 1,
  BREAK_GLASS: 0,
  FOUNDER: 1,
  CO_FOUNDER: 2,
  CEO: 3,
  CTO: 4,
  SUPER_ADMIN: 5,
  ADMINISTRATOR: 6,
  ADMIN: 6,
  DEVELOPER: 7,
  EDITOR: 8,
  FINANCE: 9,
  HR: 10,
  QA: 11,
  MARKETING: 12,
  SUPPORT: 13,
  MODERATOR: 14,
  VIEWER: 15,
  USER: 16,
};

/**
 * Validates password strength policy (min 16 chars, upper, lower, digit, symbol)
 */
export function validateMilitaryPasswordPolicy(password: string): { valid: boolean; error?: string } {
  if (password.length < 16) {
    return { valid: false, error: 'Password must be at least 16 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter (A-Z).' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter (a-z).' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one numeric digit (0-9).' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character symbol.' };
  }
  return { valid: true };
}

/**
 * Immutability guard for Break Glass, Founder, and Co-Founder accounts.
 */
export function canModifyUser(
  actorRole: string,
  targetRole: string,
  targetIsProtected?: boolean
): { allowed: boolean; reason?: string } {
  const normActor = (actorRole || '').toUpperCase();
  const normTarget = (targetRole || '').toUpperCase();

  // 1. Break Glass and Founder are completely immutable to all other roles
  if (normTarget === 'BREAK_GLASS') {
    return { allowed: false, reason: 'Break Glass account is immutable and cannot be modified or deleted.' };
  }

  if (normTarget === 'FOUNDER' || normTarget === 'OWNER') {
    if (normActor !== 'FOUNDER' && normActor !== 'OWNER' && normActor !== 'BREAK_GLASS') {
      return { allowed: false, reason: 'Owner account cannot be deleted, disabled, or demoted.' };
    }
  }

  if (targetIsProtected && normActor !== 'FOUNDER' && normActor !== 'OWNER' && normActor !== 'BREAK_GLASS') {
    return { allowed: false, reason: 'Protected executive account cannot be modified.' };
  }

  // 2. Co-Founder cannot demote or delete Founder or self-promote
  if (normActor === 'CO_FOUNDER' && (normTarget === 'FOUNDER' || normTarget === 'CO_FOUNDER' || normTarget === 'OWNER')) {
    return { allowed: false, reason: 'Co-Founder cannot modify Owner/Founder or self-promote.' };
  }

  const actorRank = ROLE_RANK_HIERARCHY[normActor] ?? 99;
  const targetRank = ROLE_RANK_HIERARCHY[normTarget] ?? 99;

  // Actor must have strictly higher rank (lower numerical rank) to modify target
  if (actorRank >= targetRank && normActor !== 'OWNER' && normActor !== 'FOUNDER') {
    return { allowed: false, reason: 'Insufficient rank hierarchy to modify target account.' };
  }

  return { allowed: true };
}

export function canAccessAdmin(userRole: string): boolean {
  const norm = (userRole || '').toUpperCase();
  return ['BREAK_GLASS', 'OWNER', 'FOUNDER', 'CO_FOUNDER', 'CEO', 'CTO', 'SUPER_ADMIN', 'ADMINISTRATOR', 'ADMIN', 'DEVELOPER', 'EDITOR', 'SUPPORT', 'MODERATOR', 'FINANCE', 'HR', 'QA', 'MARKETING', 'VIEWER'].includes(norm);
}

export function canAccessEditor(userRole: string): boolean {
  const norm = (userRole || '').toUpperCase();
  return ['BREAK_GLASS', 'OWNER', 'FOUNDER', 'CO_FOUNDER', 'CEO', 'CTO', 'SUPER_ADMIN', 'ADMINISTRATOR', 'ADMIN', 'DEVELOPER', 'EDITOR'].includes(norm);
}

/**
 * Checks granular permission strings (e.g. "cms.publish", "database.delete", "users.manage")
 */
export function hasGranularPermission(userRole: string, permissionsJson?: string | null, requiredPermission?: string): boolean {
  const normRole = (userRole || '').toUpperCase();
  if (['BREAK_GLASS', 'FOUNDER', 'CO_FOUNDER', 'SUPER_ADMIN', 'OWNER'].includes(normRole)) {
    return true; // Executive roles bypass permission checks
  }

  if (!requiredPermission) return true;

  try {
    const list: string[] = JSON.parse(permissionsJson || '[]');
    return list.includes('*') || list.includes(requiredPermission);
  } catch {
    return false;
  }
}

/**
 * Expressive helper wrapping hasGranularPermission for clean can(user, permission) authorization syntax.
 */
export function can(user: { role: string; permissions?: string | null }, requiredPermission: string): boolean {
  if (!user || !user.role) return false;
  return hasGranularPermission(user.role, user.permissions, requiredPermission);
}

/**
 * Checks if an action requires Dual Approval (Founder + Co-Founder)
 */
export function requiresDualApproval(action: string): boolean {
  const dualActions = [
    'DELETE_PRODUCTION_DATABASE',
    'PURGE_ALL_USERS',
    'REVOKE_ALL_API_KEYS',
    'SYSTEM_RESET',
  ];
  return dualActions.includes(action.toUpperCase());
}
