/**
 * Fine-Grained Permission Authorization Engine
 *
 * Checks if a user possesses a specific permission string or wildcards.
 * Owners and Super Admins inherit full permissions (`*`).
 */

export const SYSTEM_PERMISSIONS = [
  "cms.read",
  "cms.write",
  "studio.read",
  "studio.write",
  "tickets.read",
  "tickets.write",
  "users.read",
  "users.manage",
  "games.read",
  "games.write",
  "analytics.read",
  "security.manage",
] as const;

export type SystemPermission = typeof SYSTEM_PERMISSIONS[number];

export function hasPermission(
  userRole: string,
  userPermissionsRaw: string | string[] | null | undefined,
  requiredPermission: string
): boolean {
  // 1. Owners, Founders, Co-Founders, and Super Admins inherit all permissions
  if (["OWNER", "FOUNDER", "CO_FOUNDER", "SUPER_ADMIN"].includes(userRole?.toUpperCase())) {
    return true;
  }

  if (!userPermissionsRaw) return false;

  let permissionsList: string[] = [];
  if (typeof userPermissionsRaw === "string") {
    try {
      permissionsList = JSON.parse(userPermissionsRaw);
    } catch {
      permissionsList = [];
    }
  } else if (Array.isArray(userPermissionsRaw)) {
    permissionsList = userPermissionsRaw;
  }

  // Check explicit wildcard or exact match
  if (permissionsList.includes("*") || permissionsList.includes("all")) {
    return true;
  }

  return permissionsList.includes(requiredPermission);
}
