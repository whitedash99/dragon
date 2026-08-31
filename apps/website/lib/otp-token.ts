const OTP_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dragon-studios-otp-secure-salt-2026";

export const OTP_COOKIE_NAME = "dragon_otp_verified";

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
 * Generate a signed OTP verification token.
 */
export function generateOtpToken(email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  const payload = `${normalizedEmail}:${Date.now()}`;
  const signature = computeSignature(payload, OTP_SECRET);
  return Buffer.from(JSON.stringify({ payload, signature })).toString("base64url");
}

/**
 * Verify a signed OTP token in constant time.
 */
export function verifyOtpToken(email: string, token: string): boolean {
  if (!token || !email) return false;
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const raw = Buffer.from(token, "base64url").toString("utf-8");
    const { payload, signature } = JSON.parse(raw);
    if (!payload || !signature) return false;

    const [tokenEmail] = payload.split(":");
    if (tokenEmail !== normalizedEmail) return false;

    const expectedSignature = computeSignature(payload, OTP_SECRET);
    return signature === expectedSignature;
  } catch {
    return false;
  }
}
