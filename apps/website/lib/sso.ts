import crypto from "crypto";

const SSO_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  "dragon-studios-super-secret-auth-key-2026";

export interface SsoCodePayload {
  userId: string;
  dragonId: string;
  gamerTag: string;
  displayName: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  email: string;
  role: string;
  redirectUri: string;
  codeChallenge?: string;
  nonce?: string;
  iat: number;
  exp: number;
}

/**
 * Generates a signed OAuth 2.0 / Dragon ID authorization code
 */
export function generateSsoAuthorizationCode(params: {
  userId: string;
  dragonId: string;
  gamerTag: string;
  displayName: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  email: string;
  role: string;
  redirectUri: string;
  codeChallenge?: string;
  nonce?: string;
}): string {
  const iat = Date.now();
  const exp = iat + 10 * 60 * 1000; // 10 min TTL

  const payload: SsoCodePayload = {
    ...params,
    iat,
    exp,
  };

  const dataStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SSO_SECRET)
    .update(dataStr)
    .digest("base64url");

  return `drg_code_${dataStr}.${signature}`;
}

/**
 * Verifies and decodes an authorization code
 */
export function verifySsoAuthorizationCode(
  code: string,
  codeVerifier?: string
): { valid: boolean; payload?: SsoCodePayload; error?: string } {
  try {
    if (!code.startsWith("drg_code_")) {
      return { valid: false, error: "Invalid Dragon ID authorization code prefix." };
    }

    const raw = code.replace(/^drg_code_/, "");
    const [dataStr, signature] = raw.split(".");
    if (!dataStr || !signature) {
      return { valid: false, error: "Malformed authorization code structure." };
    }

    const expectedSignature = crypto
      .createHmac("sha256", SSO_SECRET)
      .update(dataStr)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return { valid: false, error: "Authorization code signature mismatch." };
    }

    const payload: SsoCodePayload = JSON.parse(
      Buffer.from(dataStr, "base64url").toString("utf-8")
    );

    if (Date.now() > payload.exp) {
      return { valid: false, error: "Authorization code has expired." };
    }

    // Verify PKCE if code_challenge was provided
    if (payload.codeChallenge && codeVerifier) {
      const derivedChallenge = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url");

      if (derivedChallenge !== payload.codeChallenge) {
        return { valid: false, error: "PKCE code_verifier verification failed." };
      }
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: "Failed to parse authorization code." };
  }
}

/**
 * Builds direct instant launch URL for Dragon Web Games portal
 */
export function getDragonWebGamesBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_DRAGON_GAMES_URL) {
    return process.env.NEXT_PUBLIC_DRAGON_GAMES_URL.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }
  return "http://localhost:3001";
}
