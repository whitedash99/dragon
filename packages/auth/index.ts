import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'EDITOR' | 'USER';

export function hasPermission(role: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    USER: 1,
    EDITOR: 2,
    ADMIN: 3,
    SUPER_ADMIN: 4,
  };
  return (roleHierarchy[role] || 0) >= (roleHierarchy[requiredRole] || 0);
}
