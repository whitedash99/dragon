import crypto from "crypto";

const INSTALLATION_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dragon-studios-installation-secret-salt-2026";

export const INSTALLATION_COOKIE_NAME = "dragon_installation";

/**
 * Generate an installation token for a specific user and browser.
 */
export function generateInstallationToken(userId: string): string {
  const randomPart = crypto.randomBytes(16).toString("hex");
  const payload = `${userId}:${Date.now()}:${randomPart}`;
  const signature = crypto
    .createHmac("sha256", INSTALLATION_SECRET)
    .update(payload)
    .digest("hex");
  return Buffer.from(JSON.stringify({ payload, signature })).toString("base64url");
}

/**
 * Verify if an installation token belongs to the given user and is tamper-free.
 */
export function verifyInstallationToken(userId: string, token: string): boolean {
  if (!token || !userId) return false;
  try {
    const raw = Buffer.from(token, "base64url").toString("utf-8");
    const { payload, signature } = JSON.parse(raw);
    if (!payload || !signature) return false;

    const [tokenUserId] = payload.split(":");
    if (tokenUserId !== userId) return false;

    const expectedSignature = crypto
      .createHmac("sha256", INSTALLATION_SECRET)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
}
