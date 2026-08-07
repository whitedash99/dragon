import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma";

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  department: string | null;
  avatar: string | null;
}

export async function verifyUserCredentials(email: string, password: string): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user || user.status === "SUSPENDED" || user.status === "BANNED") {
    return null;
  }

  if (!user.password) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    avatar: user.avatar,
  };
}
