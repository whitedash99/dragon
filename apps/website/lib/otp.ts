import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOtpVerificationEmail } from "@dragon/email";

const OTP_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dragon-studios-otp-secure-salt-2026";

const OTP_EXPIRY_MINUTES = 10;
const MAX_VERIFICATION_ATTEMPTS = 5;

/**
 * Generate a cryptographically secure 6-digit numeric OTP.
 * Uses crypto.randomInt (never Math.random).
 */
export function generateCryptographicOtp(): string {
  const code = crypto.randomInt(100000, 1000000);
  return code.toString();
}

/**
 * Deterministically hash an OTP with HMAC-SHA256 using the server secret.
 * Plaintext OTP is NEVER stored in the database.
 */
export function hashOtp(otp: string, email: string): string {
  const normalizedEmail = email.toLowerCase().trim();
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${otp}:${normalizedEmail}`)
    .digest("hex");
}

/**
 * Invalidate previous active OTP codes and store a new hashed verification code.
 */
export async function createAndSendOtp(email: string, userId?: string): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.toLowerCase().trim();

  // 1. Generate 6-digit cryptographic OTP
  const rawOtp = generateCryptographicOtp();
  const codeHash = hashOtp(rawOtp, normalizedEmail);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  try {
    // 2. Mark previous pending codes as consumed/invalidated
    await prisma.emailVerificationCode.updateMany({
      where: {
        email: normalizedEmail,
        consumedAt: null,
      },
      data: {
        consumedAt: new Date(),
      },
    });

    // 3. Store new hashed record in PostgreSQL
    await prisma.emailVerificationCode.create({
      data: {
        email: normalizedEmail,
        userId: userId || undefined,
        codeHash,
        expiresAt,
        attempts: 0,
      },
    });

    // 4. Send the plaintext OTP strictly via Resend API to the verified email
    const emailResult = await sendOtpVerificationEmail(normalizedEmail, rawOtp);
    if (!emailResult.success) {
      console.error("[OTP] Failed to deliver verification email via Resend:", emailResult.error);
      return { success: false, error: "Failed to send verification code. Please try again." };
    }

    return { success: true };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Database error";
    console.error("[OTP] Exception during createAndSendOtp:", msg);
    return { success: false, error: "Unable to process verification code." };
  }
}

/**
 * Verify a 6-digit OTP against active records in PostgreSQL.
 */
export async function verifyOtpCode(
  email: string,
  candidateOtp: string
): Promise<{ success: boolean; error?: string; userId?: string | null }> {
  const normalizedEmail = email.toLowerCase().trim();
  const cleanOtp = candidateOtp.trim();

  if (!/^\d{6}$/.test(cleanOtp)) {
    return { success: false, error: "That verification code is incorrect." };
  }

  // 1. Find the latest active verification record
  const record = await prisma.emailVerificationCode.findFirst({
    where: {
      email: normalizedEmail,
      consumedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return {
      success: false,
      error: "No active verification code found. Please request a new code.",
    };
  }

  // 2. Check maximum attempts (5 max)
  if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    await prisma.emailVerificationCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });
    return {
      success: false,
      error: "Too many attempts. Request a new verification code.",
    };
  }

  // 3. Check expiration (10 minutes)
  if (new Date() > record.expiresAt) {
    await prisma.emailVerificationCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });
    return {
      success: false,
      error: "Your verification code has expired. Request a new code.",
    };
  }

  // 4. Constant-time hash comparison
  const candidateHash = hashOtp(cleanOtp, normalizedEmail);
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(candidateHash, "hex"),
    Buffer.from(record.codeHash, "hex")
  );

  if (!isMatch) {
    const updatedAttempts = record.attempts + 1;
    await prisma.emailVerificationCode.update({
      where: { id: record.id },
      data: {
        attempts: updatedAttempts,
        consumedAt: updatedAttempts >= MAX_VERIFICATION_ATTEMPTS ? new Date() : null,
      },
    });

    if (updatedAttempts >= MAX_VERIFICATION_ATTEMPTS) {
      return {
        success: false,
        error: "Too many attempts. Request a new verification code.",
      };
    }

    return { success: false, error: "That verification code is incorrect." };
  }

  // 5. Success: Consume the code immediately to prevent replay attacks
  await prisma.emailVerificationCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  return { success: true, userId: record.userId };
}
