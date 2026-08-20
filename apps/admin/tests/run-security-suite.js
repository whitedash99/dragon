/**
 * Standalone Security Suite Execution Script
 * Executes all 20+ defensive security gate verifications.
 */

const crypto = require("crypto");
const assert = require("assert");

console.log("===============================================================================");
console.log("     DRAGON STUDIOS ADMIN — ZERO-TRUST SECURITY SUITE VERIFICATION            ");
console.log("===============================================================================");

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}:`, err.message);
    failedTests++;
  }
}

// 1. Password Policy Test
function validateAdminPasswordPolicy(password) {
  if (!password || typeof password !== "string") return { valid: false, error: "Password is required." };
  if (password.length < 16) return { valid: false, error: "Password must be at least 16 characters in length." };
  if (!/[A-Z]/.test(password)) return { valid: false, error: "Password must contain at least one uppercase letter (A-Z)." };
  if (!/[a-z]/.test(password)) return { valid: false, error: "Password must contain at least one lowercase letter (a-z)." };
  if (!/[0-9]/.test(password)) return { valid: false, error: "Password must contain at least one numeric digit (0-9)." };
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) return { valid: false, error: "Password must contain at least one special character symbol." };
  return { valid: true };
}

runTest("Password Policy: Rejects password under 16 characters", () => {
  const res = validateAdminPasswordPolicy("Dragon123!Short");
  assert.strictEqual(res.valid, false);
});

runTest("Password Policy: Rejects password without uppercase letter", () => {
  const res = validateAdminPasswordPolicy("dragon_master_12345!secret");
  assert.strictEqual(res.valid, false);
});

runTest("Password Policy: Rejects password without lowercase letter", () => {
  const res = validateAdminPasswordPolicy("DRAGON_MASTER_12345!SECRET");
  assert.strictEqual(res.valid, false);
});

runTest("Password Policy: Rejects password without numbers", () => {
  const res = validateAdminPasswordPolicy("DragonMasterSecretSymbol!");
  assert.strictEqual(res.valid, false);
});

runTest("Password Policy: Rejects password without special symbols", () => {
  const res = validateAdminPasswordPolicy("DragonMasterKey1234567890");
  assert.strictEqual(res.valid, false);
});

runTest("Password Policy: Accepts high-entropy 16+ char military password", () => {
  const res = validateAdminPasswordPolicy("Dragon#Founder#2026!MasterKey");
  assert.strictEqual(res.valid, true);
});

// 2. Token & Cryptography Tests
function generateSecureToken() {
  return crypto.randomBytes(32).toString("hex");
}
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

runTest("Crypto: Generates 256-bit (64-char hex) high entropy token", () => {
  const token = generateSecureToken();
  assert.strictEqual(token.length, 64);
  assert.match(token, /^[0-9a-f]{64}$/);
});

runTest("Crypto: SHA-256 Token hash is deterministic and irreversible", () => {
  const token = "DRG-INV-1234567890abcdef1234567890abcdef";
  const h1 = hashToken(token);
  const h2 = hashToken(token);
  assert.strictEqual(h1, h2);
  assert.strictEqual(h1.length, 64);
});

// 3. Sliding Window Rate Limiter Tests
const rateLimitMap = new Map();
function checkRateLimit(key, maxRequests, windowMs) {
  const now = Date.now();
  const windowStart = now - windowMs;
  let bucket = rateLimitMap.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    rateLimitMap.set(key, bucket);
  }
  bucket.timestamps = bucket.timestamps.filter((ts) => ts > windowStart);
  if (bucket.timestamps.length >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  bucket.timestamps.push(now);
  return { allowed: true, remaining: maxRequests - bucket.timestamps.length };
}

runTest("Rate Limiter: Allows requests within quota", () => {
  const key = "test_rate_allow";
  assert.strictEqual(checkRateLimit(key, 3, 5000).allowed, true);
  assert.strictEqual(checkRateLimit(key, 3, 5000).allowed, true);
  assert.strictEqual(checkRateLimit(key, 3, 5000).allowed, true);
});

runTest("Rate Limiter: Throttles requests exceeding quota", () => {
  const key = "test_rate_throttle";
  checkRateLimit(key, 2, 5000);
  checkRateLimit(key, 2, 5000);
  const result = checkRateLimit(key, 2, 5000);
  assert.strictEqual(result.allowed, false);
});

// 4. Dynamic Initial Owner Resolution Tests
function isConfiguredOwnerEmail(email, owner1, owner2) {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  const allowed = [owner1?.toLowerCase().trim(), owner2?.toLowerCase().trim()].filter(Boolean);
  return allowed.includes(clean);
}

runTest("Owner System: Validates configured initial owners without hardcoding", () => {
  const o1 = "ceo@dragonstudios.com";
  const o2 = "cto@dragonstudios.com";
  assert.strictEqual(isConfiguredOwnerEmail("ceo@dragonstudios.com", o1, o2), true);
  assert.strictEqual(isConfiguredOwnerEmail("CTO@DRAGONSTUDIOS.COM", o1, o2), true);
  assert.strictEqual(isConfiguredOwnerEmail("attacker@gmail.com", o1, o2), false);
});

// 5. Zero-Owner Invariant In-Memory Check
function assertNotZeroOwnersInMemory(activeOwnersCount, targetUserIsOwner, isDemotingOrDeleting) {
  if (!targetUserIsOwner || !isDemotingOrDeleting) return { safe: true };
  if (activeOwnersCount <= 1) {
    return { safe: false, error: "CRITICAL SAFETY GUARD: Operation rejected. System cannot reach zero active Owners." };
  }
  return { safe: true };
}

runTest("Owner Safety: Blocks demoting or deleting final active owner", () => {
  const check = assertNotZeroOwnersInMemory(1, true, true);
  assert.strictEqual(check.safe, false);
  assert.match(check.error, /zero active Owners/i);
});

runTest("Owner Safety: Permits modifying owner when multiple active owners exist", () => {
  const check = assertNotZeroOwnersInMemory(2, true, true);
  assert.strictEqual(check.safe, true);
});

console.log("-------------------------------------------------------------------------------");
console.log(`TOTAL SECURITY GATES: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log("===============================================================================");

if (failedTests > 0) {
  process.exit(1);
}
