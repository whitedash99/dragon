import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOtpVerificationEmail } from "@dragon/email";

const OTP_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dragon-studios-otp-secure-salt-2026";

const OTP_EXPIRY_MINUTES = 5;
const MAX_VERIFICATION_ATTEMPTS = 5;

/**
 * Mask an email address for safe UI display (e.g. t***@gmail.com).
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email || "your email";
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const maskedLocal = local.length > 2
    ? `${local[0]}***${local[local.length - 1]}`
    : `${local[0]}***`;
  return `${maskedLocal}@${domain}`;
}

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
export async function createAndSendOtp(
  email: string,
  userId?: string,
  ipAddress?: string
): Promise<{ success: boolean; error?: string }> {
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
      return { success: false, error: "Failed to deliver verification code. Please try again." };
    }

    // 5. Record Security Audit Log
    await prisma.auditLog.create({
      data: {
        userId: userId || undefined,
        userEmail: normalizedEmail,
        action: "OTP_SENT",
        resource: "AUTHENTICATION",
        details: `6-digit OTP dispatched to ${normalizedEmail} (expires in ${OTP_EXPIRY_MINUTES}m)`,
        ipAddress: ipAddress || undefined,
      },
    }).catch(() => {});

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
  candidateOtp: string,
  ipAddress?: string
): Promise<{ success: boolean; error?: string; userId?: string | null }> {
  const normalizedEmail = email.toLowerCase().trim();
  const cleanOtp = candidateOtp.trim();

  if (!/^\d{6}$/.test(cleanOtp)) {
    return { success: false, error: "Invalid verification code format. Must be 6 digits." };
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

    await prisma.auditLog.create({
      data: {
        userId: record.userId || undefined,
        userEmail: normalizedEmail,
        action: "OTP_FAILED",
        resource: "AUTHENTICATION",
        details: `OTP verification locked: Exceeded maximum attempts (${MAX_VERIFICATION_ATTEMPTS})`,
        ipAddress: ipAddress || undefined,
      },
    }).catch(() => {});

    return {
      success: false,
      error: "Too many attempts. Request a new verification code.",
    };
  }

  // 3. Check expiration (5 minutes)
  if (new Date() > record.expiresAt) {
    await prisma.emailVerificationCode.update({
      where: { id: record.id },
      data: { consumedAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        userId: record.userId || undefined,
        userEmail: normalizedEmail,
        action: "OTP_EXPIRED",
        resource: "AUTHENTICATION",
        details: `Expired OTP verification attempted for ${normalizedEmail}`,
        ipAddress: ipAddress || undefined,
      },
    }).catch(() => {});

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

    await prisma.auditLog.create({
      data: {
        userId: record.userId || undefined,
        userEmail: normalizedEmail,
        action: "OTP_FAILED",
        resource: "AUTHENTICATION",
        details: `Invalid OTP attempt ${updatedAttempts}/${MAX_VERIFICATION_ATTEMPTS} for ${normalizedEmail}`,
        ipAddress: ipAddress || undefined,
      },
    }).catch(() => {});

    if (updatedAttempts >= MAX_VERIFICATION_ATTEMPTS) {
      return {
        success: false,
        error: "Too many attempts. Request a new verification code.",
      };
    }

    return { success: false, error: "Invalid verification code." };
  }

  // 5. Success: Consume the code immediately to prevent replay attacks
  await prisma.emailVerificationCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  // Record Success Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: record.userId || undefined,
      userEmail: normalizedEmail,
      action: "OTP_VERIFIED",
      resource: "AUTHENTICATION",
      details: `Successful OTP verification for ${normalizedEmail}`,
      ipAddress: ipAddress || undefined,
    },
  }).catch(() => {});

  await prisma.auditLog.create({
    data: {
      userId: record.userId || undefined,
      userEmail: normalizedEmail,
      action: "AUTH_SESSION_CREATED",
      resource: "AUTHENTICATION",
      details: `Final authenticated session issued for ${normalizedEmail}`,
      ipAddress: ipAddress || undefined,
    },
  }).catch(() => {});

  return { success: true, userId: record.userId };
}
