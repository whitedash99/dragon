export interface DragonIdMetadata {
  gamerTag: string;
  primaryTitle: string;
  bannerTheme: string;
  bannerUrl?: string;
  avatarId?: string;
  bio?: string;
  hasCompletedWelcome: boolean;
  hasCompletedDragonId: boolean;
  welcomeCompletedAt?: string;
  dragonIdCompletedAt?: string;
  onboardingStep?: "WELCOME" | "DRAGON_ID_FORGE" | "COMPLETED";
}

export const DEFAULT_DRAGON_ID_METADATA: DragonIdMetadata = {
  gamerTag: "Player",
  primaryTitle: "Dragon Operative",
  bannerTheme: "lightning-cyan",
  bannerUrl: "",
  avatarId: "obsidian-lightning-dragon",
  hasCompletedWelcome: false,
  hasCompletedDragonId: false,
  onboardingStep: "WELCOME",
};

/**
 * Safely parse notificationSettings string into structured DragonIdMetadata
 */
export function parseProfileMetadata(rawSettings?: string | null, fallbackName?: string | null): DragonIdMetadata {
  const defaultTag = fallbackName ? fallbackName.trim().replace(/\s+/g, "_") : "Player";
  
  if (!rawSettings) {
    return {
      ...DEFAULT_DRAGON_ID_METADATA,
      gamerTag: defaultTag,
    };
  }

  try {
    const parsed = JSON.parse(rawSettings);
    return {
      gamerTag: parsed.gamerTag || defaultTag,
      primaryTitle: parsed.primaryTitle || "Dragon Operative",
      bannerTheme: parsed.bannerTheme || "lightning-cyan",
      bannerUrl: parsed.bannerUrl || "",
      avatarId: parsed.avatarId || parsed.avatar || "obsidian-lightning-dragon",
      hasCompletedWelcome: Boolean(parsed.hasCompletedWelcome),
      hasCompletedDragonId: Boolean(parsed.hasCompletedDragonId),
      welcomeCompletedAt: parsed.welcomeCompletedAt,
      dragonIdCompletedAt: parsed.dragonIdCompletedAt,
      onboardingStep: parsed.hasCompletedDragonId
        ? "COMPLETED"
        : parsed.hasCompletedWelcome
        ? "DRAGON_ID_FORGE"
        : "WELCOME",
    };
  } catch {
    return {
      ...DEFAULT_DRAGON_ID_METADATA,
      gamerTag: defaultTag,
    };
  }
}

/**
 * Serialize DragonIdMetadata into string for database storage
 */
export function serializeProfileMetadata(
  current: DragonIdMetadata,
  updates: Partial<DragonIdMetadata>
): string {
  const merged: DragonIdMetadata = {
    ...current,
    ...updates,
  };

  // Determine onboarding step
  if (merged.hasCompletedDragonId) {
    merged.onboardingStep = "COMPLETED";
  } else if (merged.hasCompletedWelcome) {
    merged.onboardingStep = "DRAGON_ID_FORGE";
  } else {
    merged.onboardingStep = "WELCOME";
  }

  return JSON.stringify(merged);
}

/**
 * Generates an isolated, personalized, cryptographically unique Personal Dragon ID
 * Format: DRG-[HANDLE_PREFIX]-[NUMBERS] (e.g. DRG-ZDF-9415 or DRGZ-122-9415)
 */
export function generateCanonicalDragonId(handleOrName?: string): string {
  let prefix = "ZDF";
  if (handleOrName) {
    const clean = handleOrName.replace(/^@/, "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (clean.length >= 3) {
      prefix = clean.slice(0, 3);
    } else if (clean.length > 0) {
      prefix = clean.padEnd(3, "X");
    }
  }
  const part1 = Math.floor(100 + Math.random() * 900); // e.g. 122
  const part2 = Math.floor(1000 + Math.random() * 9000); // e.g. 9415
  return `DRG-${prefix}-${part1}-${part2}`;
}

/**
 * Generates an isolated Personal Cryptographic Dragon Pass Key
 * e.g. DRG-KEY-8942-XF92
 */
export function generateDragonPassKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  const num = Math.floor(1000 + Math.random() * 9000);
  return `DRG-KEY-${num}-${suffix}`;
}

/**
 * Validate Dragon ID handle
 */
export function validateDragonIdHandle(handle: string): { valid: boolean; error?: string } {
  const clean = handle.trim();
  if (clean.length < 3) {
    return { valid: false, error: "Dragon ID must be at least 3 characters long." };
  }
  if (clean.length > 20) {
    return { valid: false, error: "Dragon ID cannot exceed 20 characters." };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
    return { valid: false, error: "Dragon ID can only contain letters, numbers, underscores, and hyphens." };
  }
  return { valid: true };
}
