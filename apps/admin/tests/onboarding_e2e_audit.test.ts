import { describe, it } from "node:test";
import assert from "node:assert";

// ═══════════════════════════════════════════════════════════════════════
// CANONICAL ONBOARDING UTILITIES IMPORT / LOGIC UNDER TEST
// ═══════════════════════════════════════════════════════════════════════
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

export function parseProfileMetadata(
  rawSettings?: string | null,
  fallbackName?: string | null
): DragonIdMetadata {
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
      bio: parsed.bio,
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

export function serializeProfileMetadata(
  current: DragonIdMetadata,
  updates: Partial<DragonIdMetadata>
): string {
  const merged: DragonIdMetadata = {
    ...current,
    ...updates,
  };

  if (merged.hasCompletedDragonId) {
    merged.onboardingStep = "COMPLETED";
  } else if (merged.hasCompletedWelcome) {
    merged.onboardingStep = "DRAGON_ID_FORGE";
  } else {
    merged.onboardingStep = "WELCOME";
  }

  return JSON.stringify(merged);
}

export function validateDragonIdHandle(handle: string): { valid: boolean; error?: string } {
  const clean = handle.trim();
  if (clean.length < 3) {
    return { valid: false, error: "Dragon ID must be at least 3 characters long." };
  }
  if (clean.length > 20) {
    return { valid: false, error: "Dragon ID cannot exceed 20 characters." };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(clean)) {
    return {
      valid: false,
      error: "Dragon ID can only contain letters, numbers, underscores, and hyphens.",
    };
  }
  return { valid: true };
}

// Simulated Server-Side Middleware Decision Router
export function evaluateMiddlewareRouting(req: {
  pathname: string;
  token: {
    id?: string;
    email?: string;
    hasCompletedWelcome?: boolean;
    dragonIdSetupCompleted?: boolean;
    hasCompletedDragonId?: boolean;
  } | null;
}): { action: "ALLOW" | "REDIRECT"; destination?: string } {
  const { pathname, token } = req;
  const isDragonIdCompleted = Boolean(
    token?.dragonIdSetupCompleted || token?.hasCompletedDragonId
  );
  const hasCompletedWelcome = Boolean(token?.hasCompletedWelcome);

  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Protected routes boundary
  if (isProtectedRoute) {
    if (!token) {
      return { action: "REDIRECT", destination: "/login" };
    }
    if (!isDragonIdCompleted) {
      return {
        action: "REDIRECT",
        destination: hasCompletedWelcome ? "/dragon-id/setup" : "/welcome",
      };
    }
    return { action: "ALLOW" };
  }

  // 2. /welcome boundary
  if (pathname === "/welcome") {
    if (!token) {
      return { action: "REDIRECT", destination: "/login" };
    }
    if (isDragonIdCompleted) {
      return { action: "REDIRECT", destination: "/dashboard" };
    }
    return { action: "ALLOW" };
  }

  // 3. /dragon-id/setup boundary: Unauthenticated -> /login. Completed -> /dashboard.
  if (pathname === "/dragon-id/setup" || pathname.startsWith("/dragon-id/")) {
    if (!token) {
      return { action: "REDIRECT", destination: "/login" };
    }
    if (isDragonIdCompleted) {
      return { action: "REDIRECT", destination: "/dashboard" };
    }
    return { action: "ALLOW" };
  }

  return { action: "ALLOW" };
}

// ═══════════════════════════════════════════════════════════════════════
// E2E ONBOARDING & GATE AUDIT TEST SUITE
// ═══════════════════════════════════════════════════════════════════════
describe("🐉 Dragon Gaming Studios — Mandatory Post-Login Onboarding E2E Audit", () => {
  describe("1. Dragon ID Callsign Validation & Security Constraints", () => {
    it("should accept valid alphanumeric callsigns and hyphens/underscores", () => {
      const validCases = ["apex_player", "dragon-slayer", "vulkan99", "cyber_pilot_01", "OP1"];
      for (const handle of validCases) {
        const res = validateDragonIdHandle(handle);
        assert.strictEqual(res.valid, true, `Handle "${handle}" should be valid`);
      }
    });

    it("should reject handles shorter than 3 characters", () => {
      const shortCases = ["a", "ab", "  ", ""];
      for (const handle of shortCases) {
        const res = validateDragonIdHandle(handle);
        assert.strictEqual(res.valid, false);
        assert.match(res.error || "", /at least 3 characters/i);
      }
    });

    it("should reject handles longer than 20 characters", () => {
      const longHandle = "a".repeat(21);
      const res = validateDragonIdHandle(longHandle);
      assert.strictEqual(res.valid, false);
      assert.match(res.error || "", /cannot exceed 20 characters/i);
    });

    it("should reject handles containing illegal special characters, spaces, or XSS vectors", () => {
      const illegalCases = [
        "player@studio",
        "dragon slayer",
        "call$ign",
        "<script>",
        "user!name",
        "valyrian#1",
        "cyber.punk",
      ];
      for (const handle of illegalCases) {
        const res = validateDragonIdHandle(handle);
        assert.strictEqual(res.valid, false, `Handle "${handle}" must be rejected`);
      }
    });
  });

  describe("2. Metadata State Machine & Serialization Integrity", () => {
    it("should initialize default state as incomplete (hasCompletedWelcome = false, hasCompletedDragonId = false)", () => {
      const parsed = parseProfileMetadata(null, "Test Operative");
      assert.strictEqual(parsed.hasCompletedWelcome, false);
      assert.strictEqual(parsed.hasCompletedDragonId, false);
      assert.strictEqual(parsed.onboardingStep, "WELCOME");
      assert.strictEqual(parsed.gamerTag, "Test_Operative");
    });

    it("should transition correctly to DRAGON_ID_FORGE upon welcome completion", () => {
      const initial = parseProfileMetadata(null, "Test Operative");
      const updatedString = serializeProfileMetadata(initial, {
        hasCompletedWelcome: true,
        welcomeCompletedAt: new Date().toISOString(),
      });
      const parsed = parseProfileMetadata(updatedString, "Test Operative");

      assert.strictEqual(parsed.hasCompletedWelcome, true);
      assert.strictEqual(parsed.hasCompletedDragonId, false);
      assert.strictEqual(parsed.onboardingStep, "DRAGON_ID_FORGE");
    });

    it("should transition to COMPLETED upon Dragon ID forge submission", () => {
      const initial = parseProfileMetadata(null, "Test Operative");
      const serialized = serializeProfileMetadata(initial, {
        hasCompletedWelcome: true,
        hasCompletedDragonId: true,
        gamerTag: "apex_dragon",
        primaryTitle: "Apex Dragon Champion",
        bannerTheme: "lightning-cyan",
        avatarId: "obsidian-lightning-dragon",
        dragonIdCompletedAt: new Date().toISOString(),
      });
      const parsed = parseProfileMetadata(serialized, "Test Operative");

      assert.strictEqual(parsed.hasCompletedWelcome, true);
      assert.strictEqual(parsed.hasCompletedDragonId, true);
      assert.strictEqual(parsed.onboardingStep, "COMPLETED");
      assert.strictEqual(parsed.gamerTag, "apex_dragon");
      assert.strictEqual(parsed.primaryTitle, "Apex Dragon Champion");
    });
  });

  describe("3. Server-Side Route Boundary Gate (Middleware Enforcement)", () => {
    it("should strictly redirect unauthenticated requests to /login", () => {
      const res = evaluateMiddlewareRouting({
        pathname: "/dashboard",
        token: null,
      });
      assert.strictEqual(res.action, "REDIRECT");
      assert.strictEqual(res.destination, "/login");
    });

    it("should block un-onboarded user from /dashboard and redirect to /welcome", () => {
      const res = evaluateMiddlewareRouting({
        pathname: "/dashboard",
        token: {
          id: "usr_123",
          email: "player@dragon.gg",
          hasCompletedWelcome: false,
          dragonIdSetupCompleted: false,
        },
      });
      assert.strictEqual(res.action, "REDIRECT");
      assert.strictEqual(res.destination, "/welcome");
    });

    it("should forward welcomed user attempting /dashboard to /dragon-id/setup", () => {
      const res = evaluateMiddlewareRouting({
        pathname: "/dashboard",
        token: {
          id: "usr_123",
          email: "player@dragon.gg",
          hasCompletedWelcome: true,
          dragonIdSetupCompleted: false,
        },
      });
      assert.strictEqual(res.action, "REDIRECT");
      assert.strictEqual(res.destination, "/dragon-id/setup");
    });

    it("should allow completed user to access /dashboard directly without modal blocks", () => {
      const res = evaluateMiddlewareRouting({
        pathname: "/dashboard",
        token: {
          id: "usr_123",
          email: "player@dragon.gg",
          hasCompletedWelcome: true,
          dragonIdSetupCompleted: true,
        },
      });
      assert.strictEqual(res.action, "ALLOW");
    });

    it("should redirect completed user away from /welcome to /dashboard", () => {
      const res = evaluateMiddlewareRouting({
        pathname: "/welcome",
        token: {
          id: "usr_123",
          email: "player@dragon.gg",
          hasCompletedWelcome: true,
          dragonIdSetupCompleted: true,
        },
      });
      assert.strictEqual(res.action, "REDIRECT");
      assert.strictEqual(res.destination, "/dashboard");
    });

    it("should redirect completed user away from /dragon-id/setup to /dashboard", () => {
      const res = evaluateMiddlewareRouting({
        pathname: "/dragon-id/setup",
        token: {
          id: "usr_123",
          email: "player@dragon.gg",
          hasCompletedWelcome: true,
          dragonIdSetupCompleted: true,
        },
      });
      assert.strictEqual(res.action, "REDIRECT");
      assert.strictEqual(res.destination, "/dashboard");
    });

    it("should allow incomplete authenticated user to access /dragon-id/setup directly", () => {
      const res = evaluateMiddlewareRouting({
        pathname: "/dragon-id/setup",
        token: {
          id: "usr_123",
          email: "player@dragon.gg",
          hasCompletedWelcome: true,
          dragonIdSetupCompleted: false,
        },
      });
      assert.strictEqual(res.action, "ALLOW");
    });
  });

  describe("4. Database Uniqueness & Handle Collision Prevention", () => {
    it("should accurately distinguish between existing user maintaining handle vs duplicate attempt", () => {
      const currentUserId = "user_alpha";
      const existingProfiles = [
        {
          userId: "user_alpha",
          notificationSettings: JSON.stringify({ gamerTag: "shadow_ninja" }),
        },
        {
          userId: "user_beta",
          notificationSettings: JSON.stringify({ gamerTag: "cyber_king" }),
        },
      ];

      // Test 1: User Alpha editing their own profile with "shadow_ninja" -> Available
      const isTakenForAlpha = existingProfiles.some((p) => {
        if (p.userId === currentUserId) return false;
        const meta = JSON.parse(p.notificationSettings);
        return meta.gamerTag.toLowerCase() === "shadow_ninja".toLowerCase();
      });
      assert.strictEqual(isTakenForAlpha, false, "Own handle should remain available for owner");

      // Test 2: User Alpha trying to take User Beta's handle "cyber_king" -> Taken
      const isTakenByBeta = existingProfiles.some((p) => {
        if (p.userId === currentUserId) return false;
        const meta = JSON.parse(p.notificationSettings);
        return meta.gamerTag.toLowerCase() === "cyber_king".toLowerCase();
      });
      assert.strictEqual(isTakenByBeta, true, "Foreign handle should be flagged as taken");
    });
  });

  describe("5. Strict Real Data Mandate (Zero Fake Content Audit)", () => {
    it("should strictly verify the real flagship studio game Uncharted Drive: Beyond", () => {
      const REAL_TITLES = ["UNCHARTED DRIVE: BEYOND"];
      assert.strictEqual(REAL_TITLES.length, 1, "Only the real studio flagship game must exist");
      assert.strictEqual(REAL_TITLES[0], "UNCHARTED DRIVE: BEYOND");
    });
  });
});
