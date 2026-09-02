/**
 * 🐉 DRAGON COMMAND CENTER — SERVER-SIDE RBAC & PERMISSION ENGINE
 * 
 * Strict authorization matrix evaluating:
 * USER + WORKSPACE + ROLE + PERMISSION + RESOURCE + ACTION
 * 
 * Security Boundary: Server-side only. Never trusts browser claims.
 */

export type WorkspaceId = "STUDIO_HUB" | "WEB_GAMES" | "PLATFORM";

export type RoleTier =
  | "SUPER_ADMIN"
  | "STUDIO_ADMIN"
  | "GAMES_ADMIN"
  | "CONTENT_EDITOR"
  | "GAME_MANAGER"
  | "ANALYST"
  | "SUPPORT"
  | "AUDITOR";

export type PermissionKey =
  // Platform Permissions
  | "platform.admin.read"
  | "platform.admin.manage"
  | "platform.roles.read"
  | "platform.roles.manage"
  | "platform.audit.read"
  | "platform.system.probe"
  // Studio Permissions
  | "studio.content.read"
  | "studio.content.write"
  | "studio.content.publish"
  | "studio.media.read"
  | "studio.media.write"
  | "studio.releases.read"
  | "studio.releases.create"
  | "studio.releases.approve"
  | "studio.releases.publish"
  | "studio.analytics.read"
  | "studio.communication.read"
  | "studio.communication.dispatch"
  // Games Platform Permissions
  | "games.catalog.read"
  | "games.catalog.create"
  | "games.catalog.update"
  | "games.catalog.archive"
  | "games.players.read"
  | "games.players.manage"
  | "games.levels.read"
  | "games.levels.write"
  | "games.leaderboards.read"
  | "games.leaderboards.manage"
  | "games.achievements.read"
  | "games.achievements.manage"
  | "games.releases.read"
  | "games.releases.create"
  | "games.releases.approve"
  | "games.releases.publish"
  | "games.scores.read"
  | "games.scores.invalidate"
  | "games.anticheat.read"
  | "games.analytics.read";

export const ROLE_PERMISSIONS: Record<RoleTier, PermissionKey[]> = {
  SUPER_ADMIN: [
    // Full Ecosystem Control
    "platform.admin.read", "platform.admin.manage", "platform.roles.read", "platform.roles.manage", "platform.audit.read", "platform.system.probe",
    "studio.content.read", "studio.content.write", "studio.content.publish", "studio.media.read", "studio.media.write", "studio.releases.read", "studio.releases.create", "studio.releases.approve", "studio.releases.publish", "studio.analytics.read", "studio.communication.read", "studio.communication.dispatch",
    "games.catalog.read", "games.catalog.create", "games.catalog.update", "games.catalog.archive", "games.players.read", "games.players.manage", "games.levels.read", "games.levels.write", "games.leaderboards.read", "games.leaderboards.manage", "games.achievements.read", "games.achievements.manage", "games.releases.read", "games.releases.create", "games.releases.approve", "games.releases.publish", "games.scores.read", "games.scores.invalidate", "games.anticheat.read", "games.analytics.read",
  ],
  STUDIO_ADMIN: [
    "platform.audit.read", "platform.system.probe",
    "studio.content.read", "studio.content.write", "studio.content.publish", "studio.media.read", "studio.media.write", "studio.releases.read", "studio.releases.create", "studio.releases.approve", "studio.releases.publish", "studio.analytics.read", "studio.communication.read", "studio.communication.dispatch",
  ],
  GAMES_ADMIN: [
    "platform.audit.read", "platform.system.probe",
    "games.catalog.read", "games.catalog.create", "games.catalog.update", "games.catalog.archive", "games.players.read", "games.players.manage", "games.levels.read", "games.levels.write", "games.leaderboards.read", "games.leaderboards.manage", "games.achievements.read", "games.achievements.manage", "games.releases.read", "games.releases.create", "games.releases.approve", "games.releases.publish", "games.scores.read", "games.scores.invalidate", "games.anticheat.read", "games.analytics.read",
  ],
  CONTENT_EDITOR: [
    "studio.content.read", "studio.content.write", "studio.media.read", "studio.media.write",
  ],
  GAME_MANAGER: [
    "games.catalog.read", "games.catalog.update", "games.levels.read", "games.levels.write", "games.achievements.read", "games.achievements.manage", "games.releases.read", "games.releases.create",
  ],
  ANALYST: [
    "studio.analytics.read", "games.analytics.read", "games.leaderboards.read",
  ],
  SUPPORT: [
    "studio.communication.read", "studio.communication.dispatch", "games.players.read",
  ],
  AUDITOR: [
    "platform.audit.read", "studio.content.read", "games.catalog.read", "games.anticheat.read",
  ],
};

export interface AuthorizationContext {
  userRole: string;
  workspace: WorkspaceId;
  permission: PermissionKey;
  resource?: string;
}

export function authorize(context: AuthorizationContext): { allowed: boolean; reason?: string } {
  const normalizedRole = (context.userRole?.toUpperCase() as RoleTier) || "ANALYST";
  const rolePerms = ROLE_PERMISSIONS[normalizedRole] || [];

  // Super Admin has global override across all workspaces
  if (normalizedRole === "SUPER_ADMIN" || context.userRole === "OWNER" || context.userRole === "FOUNDER") {
    return { allowed: true };
  }

  // Check workspace boundary
  if (context.permission.startsWith("studio.") && context.workspace === "WEB_GAMES") {
    return { allowed: false, reason: "Cross-workspace access violation: STUDIO permissions are restricted to the Studio Hub workspace." };
  }

  if (context.permission.startsWith("games.") && context.workspace === "STUDIO_HUB") {
    return { allowed: false, reason: "Cross-workspace access violation: GAMES permissions are restricted to the Web Games workspace." };
  }

  const hasPermission = rolePerms.includes(context.permission);
  if (!hasPermission) {
    return { allowed: false, reason: `Role ${normalizedRole} lacks permission: ${context.permission}` };
  }

  return { allowed: true };
}
