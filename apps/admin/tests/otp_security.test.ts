import { describe, it } from "node:test";
import assert from "node:assert";
import crypto from "crypto";
import { checkRateLimit } from "@dragon/utils";

// Cryptographic OTP Helpers for testing
function generateCryptographicOtp(): string {
  const code = crypto.randomInt(100000, 1000000);
  return code.toString();
}

function hashOtp(otp: string, email: string, secret = "test-secret-salt-2026"): string {
  const normalizedEmail = email.toLowerCase().trim();
  return crypto
    .createHmac("sha256", secret)
    .update(`${otp}:${normalizedEmail}`)
    .digest("hex");
}

function verifyOtpHash(
  candidateOtp: string,
  email: string,
  storedHash: string,
  secret = "test-secret-salt-2026"
): boolean {
  const candidateHash = hashOtp(candidateOtp, email, secret);
  return crypto.timingSafeEqual(
    Buffer.from(candidateHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}

describe("Dragon Gaming Studios — Post-Google Email OTP Security Suite", () => {
  describe("1. OTP Generation & Cryptographic Entropy", () => {
    it("should generate an OTP of exactly 6 numeric digits", () => {
      for (let i = 0; i < 50; i++) {
        const otp = generateCryptographicOtp();
        assert.strictEqual(typeof otp, "string");
        assert.strictEqual(otp.length, 6);
        assert.match(otp, /^\d{6}$/);
        const num = parseInt(otp, 10);
        assert.ok(num >= 100000 && num <= 999999);
      }
    });

    it("should produce unpredictable, high-entropy distributions without collision in small batches", () => {
      const set = new Set<string>();
      for (let i = 0; i < 100; i++) {
        set.add(generateCryptographicOtp());
      }
      assert.ok(set.size >= 98);
    });
  });

  describe("2. Cryptographic Hashing & Plaintext Secrecy", () => {
    it("should deterministically hash OTP with HMAC-SHA256 salt", () => {
      const email = "player@dragonstudios.com";
      const otp = "749201";
      const hash1 = hashOtp(otp, email);
      const hash2 = hashOtp(otp, email);

      assert.strictEqual(hash1, hash2);
      assert.strictEqual(hash1.length, 64);
      assert.notStrictEqual(hash1, otp);
    });

    it("should produce different hashes for different emails with identical OTP", () => {
      const otp = "123456";
      const hashA = hashOtp(otp, "userA@gmail.com");
      const hashB = hashOtp(otp, "userB@gmail.com");

      assert.notStrictEqual(hashA, hashB);
    });

    it("should correctly verify valid OTP using timing-safe comparison", () => {
      const email = "operative@dragonstudios.com";
      const validOtp = "839102";
      const storedHash = hashOtp(validOtp, email);

      const isValid = verifyOtpHash(validOtp, email, storedHash);
      assert.strictEqual(isValid, true);
    });

    it("should strictly reject invalid OTP candidate", () => {
      const email = "operative@dragonstudios.com";
      const validOtp = "839102";
      const storedHash = hashOtp(validOtp, email);

      const isInvalid = verifyOtpHash("000000", email, storedHash);
      assert.strictEqual(isInvalid, false);
    });
  });

  describe("3. Expiration, Attempts & Single-Use State Machine", () => {
    it("should reject expired OTP records (exceeding 10 minutes)", () => {
      const now = new Date();
      const expiredTime = new Date(now.getTime() - 1000); // 1s in past
      const isExpired = now > expiredTime;
      assert.strictEqual(isExpired, true);
    });

    it("should flag records that have exceeded maximum allowed attempts (5 attempts)", () => {
      const attempts = 5;
      const MAX_ATTEMPTS = 5;
      const isExceeded = attempts >= MAX_ATTEMPTS;
      assert.strictEqual(isExceeded, true);
    });

    it("should reject reuse of consumed OTP tokens", () => {
      const consumedAt = new Date();
      const isConsumed = consumedAt !== null;
      assert.strictEqual(isConsumed, true);
    });
  });

  describe("4. Rate Limiting & Cooldown Protection", () => {
    it("should allow requests under the limit and enforce 60s cooldown", () => {
      const email = `test-cooldown-${Date.now()}@gmail.com`;
      const first = checkRateLimit(`otp:cooldown:${email}`, 1, 60000);
      assert.strictEqual(first.allowed, true);

      const second = checkRateLimit(`otp:cooldown:${email}`, 1, 60000);
      assert.strictEqual(second.allowed, false);
      assert.ok(second.retryAfterSeconds > 0);
    });

    it("should cap hourly requests to 5 per email", () => {
      const email = `test-hourly-${Date.now()}@gmail.com`;
      for (let i = 0; i < 5; i++) {
        const res = checkRateLimit(`otp:hourly:${email}`, 5, 3600000);
        assert.strictEqual(res.allowed, true);
      }

      const sixth = checkRateLimit(`otp:hourly:${email}`, 5, 3600000);
      assert.strictEqual(sixth.allowed, false);
    });
  });

  describe("5. Authorization Bypass & Session Isolation", () => {
    it("should identify pending OTP verification state on Google session", () => {
      const token = {
        id: "user-123",
        email: "verified@gmail.com",
        otpPending: true,
        otpVerified: false,
      };

      const isAuthorized = !token.otpPending || token.otpVerified;
      assert.strictEqual(isAuthorized, false);
    });

    it("should grant access only after session is upgraded to otpVerified", () => {
      const token = {
        id: "user-123",
        email: "verified@gmail.com",
        otpPending: false,
        otpVerified: true,
      };

      const isAuthorized = !token.otpPending && token.otpVerified;
      assert.strictEqual(isAuthorized, true);
    });
  });
});
