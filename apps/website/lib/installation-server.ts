import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { generateInstallationToken } from "./installation";

/**
 * Register or update the browser installation in PostgreSQL database.
 */
export async function registerBrowserInstallation(
  userId: string,
  userAgent?: string,
  ipAddress?: string
): Promise<string> {
  const token = generateInstallationToken(userId);

  try {
    const deviceId = `dev_${crypto.createHash("md5").update(token).digest("hex").slice(0, 24)}`;
    await prisma.userDevice.upsert({
      where: { deviceId },
      update: {
        lastUsedAt: new Date(),
        trusted: true,
        ipAddress: ipAddress || undefined,
      },
      create: {
        userId,
        deviceId,
        browser: userAgent ? userAgent.slice(0, 100) : "Dragon Web Client",
        ipAddress: ipAddress || undefined,
        trusted: true,
        lastUsedAt: new Date(),
      },
    });
  } catch (err) {
    // Non-fatal database fallback for device table
    console.warn("[Installation] Device registration fallback:", err);
  }

  return token;
}
