import { describe, it } from "node:test";
import assert from "node:assert";
import {
  validateAdminPasswordPolicy,
  generateSecureToken,
  hashToken,
  checkRateLimit,
  isConfiguredOwnerEmail,
} from "../src/lib/auth/security";

describe("Dragon Studios Admin Ultra-Security Suite", () => {
  describe("1. Password Policy Enforcement (Military Grade: 16+ Chars, Multi-Entropy)", () => {
    it("should reject passwords shorter than 16 characters", () => {
      const result = validateAdminPasswordPolicy("Dragon123!Short");
      assert.strictEqual(result.valid, false);
      assert.match(result.error || "", /16 characters/);
    });

    it("should reject passwords missing uppercase letters", () => {
      const result = validateAdminPasswordPolicy("dragon_master_key_12345!");
      assert.strictEqual(result.valid, false);
      assert.match(result.error || "", /uppercase/);
    });

    it("should reject passwords missing lowercase letters", () => {
      const result = validateAdminPasswordPolicy("DRAGON_MASTER_KEY_12345!");
      assert.strictEqual(result.valid, false);
      assert.match(result.error || "", /lowercase/);
    });

    it("should reject passwords missing numbers", () => {
      const result = validateAdminPasswordPolicy("Dragon_Master_Key_Secret!");
      assert.strictEqual(result.valid, false);
      assert.match(result.error || "", /numeric digit/);
    });

    it("should reject passwords missing special character symbols", () => {
      const result = validateAdminPasswordPolicy("DragonMasterKey123456789");
      assert.strictEqual(result.valid, false);
      assert.match(result.error || "", /special character/);
    });

    it("should accept compliant, high-entropy passwords", () => {
      const result = validateAdminPasswordPolicy("Dragon#Founder#2026!SecureKey");
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.error, undefined);
    });
  });

  describe("2. Cryptographic Token Generation & SHA-256 Hashing", () => {
    it("should generate a 64-character (256-bit) hexadecimal token", () => {
      const token = generateSecureToken();
      assert.strictEqual(typeof token, "string");
      assert.strictEqual(token.length, 64);
      assert.match(token, /^[0-9a-f]{64}$/);
    });

    it("should deterministically hash tokens with SHA-256", () => {
      const token = "DRG-INV-abcdef0123456789";
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);
      assert.strictEqual(hash1, hash2);
      assert.strictEqual(hash1.length, 64);
    });

    it("should generate different hashes for different tokens", () => {
      const hash1 = hashToken("token_1");
      const hash2 = hashToken("token_2");
      assert.notStrictEqual(hash1, hash2);
    });
  });

  describe("3. Sliding-Window Rate Limiting Engine", () => {
    it("should allow requests under the maximum limit", () => {
      const key = `test_limit_${Date.now()}`;
      const res1 = checkRateLimit(key, 3, 10000);
      assert.strictEqual(res1.allowed, true);
      assert.strictEqual(res1.remaining, 2);

      const res2 = checkRateLimit(key, 3, 10000);
      assert.strictEqual(res2.allowed, true);
      assert.strictEqual(res2.remaining, 1);

      const res3 = checkRateLimit(key, 3, 10000);
      assert.strictEqual(res3.allowed, true);
      assert.strictEqual(res3.remaining, 0);
    });

    it("should block requests exceeding the rate limit", () => {
      const key = `test_blocked_${Date.now()}`;
      checkRateLimit(key, 2, 10000);
      checkRateLimit(key, 2, 10000);
      const blocked = checkRateLimit(key, 2, 10000);
      assert.strictEqual(blocked.allowed, false);
      assert.strictEqual(blocked.remaining, 0);
      assert.ok(blocked.resetMs > 0);
    });
  });

  describe("4. Dynamic Initial Owner Resolution", () => {
    it("should recognize configured owner emails", () => {
      process.env.INITIAL_OWNER_EMAIL_1 = "owner1@dragonstudios.com";
      process.env.INITIAL_OWNER_EMAIL_2 = "owner2@dragonstudios.com";

      assert.strictEqual(isConfiguredOwnerEmail("owner1@dragonstudios.com"), true);
      assert.strictEqual(isConfiguredOwnerEmail("OWNER2@DRAGONSTUDIOS.COM"), true);
      assert.strictEqual(isConfiguredOwnerEmail("attacker@gmail.com"), false);
    });
  });
});
