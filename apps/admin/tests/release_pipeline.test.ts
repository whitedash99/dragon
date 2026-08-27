import { describe, it } from "node:test";
import assert from "node:assert";

type ReleaseStatus = "DRAFT" | "UPLOADING" | "VERIFIED" | "PUBLISHED" | "DEPRECATED" | "ARCHIVED";

interface MockRelease {
  id: string;
  gameId: string;
  version: string;
  platform: string;
  sha256: string;
  fileSizeBytes: number;
  status: ReleaseStatus;
  isPublished: boolean;
}

/**
 * Pure state machine validator replicating release transition logic
 */
function validateReleaseTransition(
  currentStatus: ReleaseStatus,
  targetStatus: ReleaseStatus
): { allowed: boolean; reason?: string } {
  const allowedTransitions: Record<ReleaseStatus, ReleaseStatus[]> = {
    DRAFT: ["UPLOADING", "ARCHIVED"],
    UPLOADING: ["VERIFIED", "ARCHIVED", "DRAFT"],
    VERIFIED: ["PUBLISHED", "ARCHIVED", "DRAFT"],
    PUBLISHED: ["DEPRECATED", "ARCHIVED"],
    DEPRECATED: ["ARCHIVED", "PUBLISHED"],
    ARCHIVED: ["DRAFT"],
  };

  const possible = allowedTransitions[currentStatus] || [];
  if (!possible.includes(targetStatus)) {
    return {
      allowed: false,
      reason: `Illegal state transition from ${currentStatus} to ${targetStatus}`,
    };
  }
  return { allowed: true };
}

/**
 * Public Download Authorization Rule
 */
function isDownloadAllowed(release: MockRelease): boolean {
  return release.status === "PUBLISHED" && release.isPublished === true;
}

describe("Dragon Studios Release State Machine & Distribution Security Suite", () => {
  describe("1. State Transition Rules", () => {
    it("should allow valid progression: DRAFT -> UPLOADING -> VERIFIED -> PUBLISHED", () => {
      assert.strictEqual(validateReleaseTransition("DRAFT", "UPLOADING").allowed, true);
      assert.strictEqual(validateReleaseTransition("UPLOADING", "VERIFIED").allowed, true);
      assert.strictEqual(validateReleaseTransition("VERIFIED", "PUBLISHED").allowed, true);
    });

    it("should strictly reject publishing an unverified release (DRAFT -> PUBLISHED)", () => {
      const result = validateReleaseTransition("DRAFT", "PUBLISHED");
      assert.strictEqual(result.allowed, false);
      assert.match(result.reason || "", /Illegal state transition/);
    });

    it("should strictly reject publishing an uploading release (UPLOADING -> PUBLISHED)", () => {
      const result = validateReleaseTransition("UPLOADING", "PUBLISHED");
      assert.strictEqual(result.allowed, false);
      assert.match(result.reason || "", /Illegal state transition/);
    });

    it("should allow deprecating a published release when a new version is released", () => {
      assert.strictEqual(validateReleaseTransition("PUBLISHED", "DEPRECATED").allowed, true);
    });
  });

  describe("2. Public Download Authorization Gate", () => {
    it("should block download requests for DRAFT releases", () => {
      const release: MockRelease = {
        id: "rel_1",
        gameId: "game_1",
        version: "1.0.0",
        platform: "windows",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        fileSizeBytes: 104857600,
        status: "DRAFT",
        isPublished: false,
      };
      assert.strictEqual(isDownloadAllowed(release), false);
    });

    it("should block download requests for UPLOADING releases", () => {
      const release: MockRelease = {
        id: "rel_2",
        gameId: "game_1",
        version: "1.0.0",
        platform: "windows",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        fileSizeBytes: 104857600,
        status: "UPLOADING",
        isPublished: false,
      };
      assert.strictEqual(isDownloadAllowed(release), false);
    });

    it("should block download requests for VERIFIED but unpublished releases", () => {
      const release: MockRelease = {
        id: "rel_3",
        gameId: "game_1",
        version: "1.0.0",
        platform: "windows",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        fileSizeBytes: 104857600,
        status: "VERIFIED",
        isPublished: false,
      };
      assert.strictEqual(isDownloadAllowed(release), false);
    });

    it("should allow download requests ONLY for PUBLISHED releases", () => {
      const release: MockRelease = {
        id: "rel_4",
        gameId: "game_1",
        version: "1.0.0",
        platform: "windows",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        fileSizeBytes: 104857600,
        status: "PUBLISHED",
        isPublished: true,
      };
      assert.strictEqual(isDownloadAllowed(release), true);
    });
  });

  describe("3. Cryptographic Checksum & Metadata Integrity", () => {
    it("should validate valid SHA-256 hexadecimal checksum strings (64 chars)", () => {
      const validHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      assert.match(validHash, /^[a-f0-9]{64}$/i);
    });

    it("should reject malformed or truncated hashes", () => {
      const shortHash = "e3b0c44298fc";
      const nonHex = "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
      assert.strictEqual(/^[a-f0-9]{64}$/i.test(shortHash), false);
      assert.strictEqual(/^[a-f0-9]{64}$/i.test(nonHex), false);
    });
  });
});
