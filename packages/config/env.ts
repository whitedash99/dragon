/**
 * Centralized Enterprise Environment Variable Validator & Configuration Engine
 * Dragon Studios Monorepo
 */

export interface EnvConfig {
  DATABASE_URL: string;
  DIRECT_URL?: string;
  AUTH_SECRET: string;
  NEXTAUTH_SECRET: string;
  AUTH_URL: string;
  NEXTAUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  DEFAULT_FROM_EMAIL: string;
  OWNER_NOTIFICATION_EMAIL: string;
  SUPPORT_EMAIL: string;
  NEXT_PUBLIC_APP_URL: string;
  NEXT_PUBLIC_ADMIN_URL: string;
}

export function validateEnv(): EnvConfig {
  const isServer = typeof window === "undefined";

  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  const resendFromEmail = (process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || process.env.DEFAULT_FROM_EMAIL || "onboarding@resend.dev").trim();
  const ownerEmail = (process.env.OWNER_NOTIFICATION_EMAIL || "whitedash99@gmail.com").trim();

  const config: EnvConfig = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    DIRECT_URL: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
    AUTH_SECRET: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "",
    AUTH_URL: process.env.AUTH_URL || process.env.NEXTAUTH_URL || "https://dragongamingstudios.vercel.app",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || process.env.AUTH_URL || "https://dragongamingstudios.vercel.app",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
    RESEND_API_KEY: resendApiKey,
    RESEND_FROM_EMAIL: resendFromEmail,
    DEFAULT_FROM_EMAIL: resendFromEmail,
    OWNER_NOTIFICATION_EMAIL: ownerEmail,
    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || ownerEmail,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://dragongamingstudios.vercel.app",
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL || "https://dragoncontrol.vercel.app",
  };

  if (isServer) {
    const requiredVars: (keyof EnvConfig)[] = [
      "DATABASE_URL",
      "AUTH_SECRET",
      "OWNER_NOTIFICATION_EMAIL",
    ];

    const missing = requiredVars.filter((k) => !config[k]);
    if (missing.length > 0) {
      console.warn(`⚠️ [Environment Validator Warning] Missing required server variables: ${missing.join(", ")}`);
    }
  }

  return config;
}

export const env = validateEnv();
