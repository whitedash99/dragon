import { parseProfileMetadata } from "@/lib/user-profile";
import { verifyInstallationToken } from "@/lib/installation";

export type PlayerEntryState =
  | "UNAUTHENTICATED"
  | "OTP_REQUIRED"
  | "WELCOME_REQUIRED"
  | "DRAGON_ID_SETUP"
  | "DRAGON_ID_RECOGNITION"
  | "AUTHENTICATED";

export interface PlayerEntryContext {
  token?: {
    id?: string;
    email?: string;
    emailVerified?: boolean | null;
    otpVerified?: boolean | null;
    hasCompletedWelcome?: boolean;
    hasCompletedDragonId?: boolean;
    dragonIdSetupCompleted?: boolean;
  } | null;
  dbUser?: {
    id: string;
    email: string;
    dragonId?: string | null;
    emailVerified?: Date | null;
    profile?: {
      notificationSettings?: string | null;
    } | null;
  } | null;
  installationCookie?: string | null;
}

export interface PlayerEntryDecision {
  state: PlayerEntryState;
  redirectUrl: string;
  isRecognizedInstallation: boolean;
  hasDragonId: boolean;
  dragonId?: string | null;
  gamerTag?: string;
}

/**
 * Authoritative Server Decision Engine.
 * Reconciles Layer 1 (Database Account), Layer 2 (Session), and Layer 3 (Browser Installation).
 */
export function resolvePlayerEntryState(context: PlayerEntryContext): PlayerEntryDecision {
  const { token, dbUser, installationCookie } = context;

  // 1. Unauthenticated (No session and no user)
  if (!token && !dbUser) {
    return {
      state: "UNAUTHENTICATED",
      redirectUrl: "/login",
      isRecognizedInstallation: false,
      hasDragonId: false,
    };
  }

  // 2. Email OTP verification status check
  const isOtpVerified = Boolean(token?.otpVerified);

  if (!isOtpVerified) {
    return {
      state: "OTP_REQUIRED",
      redirectUrl: "/auth/verify-otp",
      isRecognizedInstallation: false,
      hasDragonId: false,
    };
  }

  // 3. Extract Database & Token Account Truth
  const meta = parseProfileMetadata(dbUser?.profile?.notificationSettings);
  const userId = dbUser?.id || token?.id || "";
  const existingDragonId = dbUser?.dragonId || null;

  const hasDragonId = Boolean(
    existingDragonId ||
    meta.hasCompletedDragonId ||
    token?.hasCompletedDragonId ||
    token?.dragonIdSetupCompleted
  );

  const hasCompletedWelcome = Boolean(
    meta.hasCompletedWelcome ||
    token?.hasCompletedWelcome
  );

  // 4. Check Browser Installation Marker (Layer 3)
  const isRecognizedInstallation = Boolean(
    userId &&
    installationCookie &&
    verifyInstallationToken(userId, installationCookie)
  );

  // ═══════════════════════════════════════════════════════════════════════
  // SCENARIO EVALUATION
  // ═══════════════════════════════════════════════════════════════════════

  // SCENARIO B: Returning completed player on trusted/existing browser installation
  if (hasDragonId && hasCompletedWelcome && isRecognizedInstallation) {
    return {
      state: "AUTHENTICATED",
      redirectUrl: "/dashboard",
      isRecognizedInstallation: true,
      hasDragonId: true,
      dragonId: existingDragonId,
      gamerTag: meta.gamerTag,
    };
  }

  // SCENARIO C: Returning completed player on Fresh Browser / Cleared Chrome Site Data
  // Account and Dragon ID exist in DB, but installation token is absent
  if (hasDragonId && !isRecognizedInstallation) {
    return {
      state: "WELCOME_REQUIRED",
      redirectUrl: "/welcome",
      isRecognizedInstallation: false,
      hasDragonId: true,
      dragonId: existingDragonId,
      gamerTag: meta.gamerTag,
    };
  }

  // SCENARIO D: Partially onboarded account (Welcome finished, Dragon ID incomplete)
  if (!hasDragonId && hasCompletedWelcome) {
    return {
      state: "DRAGON_ID_SETUP",
      redirectUrl: "/dragon-id/setup",
      isRecognizedInstallation: false,
      hasDragonId: false,
    };
  }

  // SCENARIO A: Brand new account (Neither welcome nor Dragon ID forged)
  return {
    state: "WELCOME_REQUIRED",
    redirectUrl: "/welcome",
    isRecognizedInstallation: false,
    hasDragonId: false,
  };
}
