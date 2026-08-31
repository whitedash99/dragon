const INSTALLATION_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dragon-studios-installation-secret-salt-2026";

export const INSTALLATION_COOKIE_NAME = "dragon_installation";

function computeSignature(payload: string, secret: string): string {
  let hash = 5381;
  const combined = `${payload}:::${secret}`;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) + hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36) + "_" + combined.length.toString(36);
}

/**
 * Generate an installation token for a specific user and browser.
 */
export function generateInstallationToken(userId: string): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const payload = `${userId}:${Date.now()}:${randomPart}`;
  const signature = computeSignature(payload, INSTALLATION_SECRET);
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

    const expectedSignature = computeSignature(payload, INSTALLATION_SECRET);
    return signature === expectedSignature;
  } catch {
    return false;
  }
}
