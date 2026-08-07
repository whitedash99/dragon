export type RoleType =
  | "OWNER"
  | "SUPER_ADMIN"
  | "ADMINISTRATOR"
  | "DEVELOPER"
  | "SUPPORT"
  | "MARKETING"
  | "EDITOR"
  | "VIEWER";

export type PermissionAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "publish"
  | "archive"
  | "export"
  | "manage_users"
  | "manage_cms"
  | "manage_crm"
  | "manage_ai"
  | "manage_security";

export type ResourceType =
  | "cms"
  | "crm"
  | "games"
  | "media"
  | "users"
  | "analytics"
  | "ai"
  | "security"
  | "settings";

const ROLE_PERMISSIONS: Record<RoleType, Partial<Record<ResourceType, PermissionAction[]>>> = {
  OWNER: {
    cms: ["create", "read", "update", "delete", "publish", "archive", "export", "manage_cms"],
    crm: ["create", "read", "update", "delete", "publish", "archive", "export", "manage_crm"],
    games: ["create", "read", "update", "delete", "publish", "archive", "export"],
    media: ["create", "read", "update", "delete", "export"],
    users: ["create", "read", "update", "delete", "export", "manage_users"],
    analytics: ["read", "export"],
    ai: ["create", "read", "update", "manage_ai"],
    security: ["create", "read", "update", "delete", "manage_security"],
    settings: ["create", "read", "update", "delete"],
  },
  SUPER_ADMIN: {
    cms: ["create", "read", "update", "delete", "publish", "archive", "export", "manage_cms"],
    crm: ["create", "read", "update", "delete", "publish", "archive", "export", "manage_crm"],
    games: ["create", "read", "update", "delete", "publish", "archive", "export"],
    media: ["create", "read", "update", "delete", "export"],
    users: ["create", "read", "update", "delete", "export", "manage_users"],
    analytics: ["read", "export"],
    ai: ["create", "read", "update", "manage_ai"],
    security: ["create", "read", "update", "manage_security"],
    settings: ["create", "read", "update"],
  },
  ADMINISTRATOR: {
    cms: ["create", "read", "update", "publish", "archive", "export"],
    crm: ["create", "read", "update", "publish", "export"],
    games: ["create", "read", "update", "publish"],
    media: ["create", "read", "update", "delete"],
    users: ["create", "read", "update"],
    analytics: ["read"],
    ai: ["create", "read", "update"],
    security: ["read"],
    settings: ["read", "update"],
  },
  DEVELOPER: {
    games: ["create", "read", "update"],
    media: ["create", "read", "update"],
    analytics: ["read"],
    ai: ["create", "read"],
    security: ["read"],
    settings: ["read"],
  },
  SUPPORT: {
    crm: ["create", "read", "update", "publish"],
    users: ["read"],
    analytics: ["read"],
    ai: ["read"],
  },
  MARKETING: {
    cms: ["create", "read", "update", "publish"],
    media: ["create", "read", "update"],
    analytics: ["read"],
  },
  EDITOR: {
    cms: ["create", "read", "update"],
    media: ["create", "read"],
  },
  VIEWER: {
    cms: ["read"],
    crm: ["read"],
    games: ["read"],
    media: ["read"],
    analytics: ["read"],
  },
};

export function hasPermission(
  role: RoleType,
  resource: ResourceType,
  action: PermissionAction
): boolean {
  const resourcePermissions = ROLE_PERMISSIONS[role]?.[resource];
  if (!resourcePermissions) return false;
  return resourcePermissions.includes(action);
}
