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
  B2_ENDPOINT: string;
  B2_REGION: string;
  B2_BUCKET_NAME: string;
  B2_KEY_ID: string;
  B2_APPLICATION_KEY: string;
  VERCEL_TOKEN?: string;
  VERCEL_PROJECT_ID?: string;
  VERCEL_DEPLOY_HOOK_URL?: string;
  GEMINI_API_KEY?: string;
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
    B2_ENDPOINT: process.env.B2_ENDPOINT || "https://s3.us-east-005.backblazeb2.com",
    B2_REGION: process.env.B2_REGION || "us-east-005",
    B2_BUCKET_NAME: process.env.B2_BUCKET_NAME || "dragon-games-production",
    B2_KEY_ID: process.env.B2_KEY_ID || process.env.BACKBLAZE_KEY_ID || "",
    B2_APPLICATION_KEY: process.env.B2_APPLICATION_KEY || process.env.BACKBLAZE_APPLICATION_KEY || "",
    VERCEL_TOKEN: process.env.VERCEL_TOKEN,
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
    VERCEL_DEPLOY_HOOK_URL: process.env.VERCEL_DEPLOY_HOOK_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
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

// Explicit Integration Health Check Helpers (Never exposes secret strings)
export const isDatabaseConfigured = () => Boolean(env.DATABASE_URL);
export const isB2Configured = () => Boolean(env.B2_KEY_ID && env.B2_APPLICATION_KEY);
export const isEmailConfigured = () => Boolean(env.RESEND_API_KEY && env.RESEND_API_KEY.startsWith("re_"));
export const isGoogleOAuthConfigured = () => Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
export const isVercelConfigured = () => Boolean((env.VERCEL_TOKEN && env.VERCEL_PROJECT_ID) || env.VERCEL_DEPLOY_HOOK_URL);
export const isGeminiConfigured = () => Boolean(env.GEMINI_API_KEY);
