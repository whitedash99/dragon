import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { parseProfileMetadata, generateCanonicalDragonId } from "@/lib/user-profile";
import { createAndSendOtp } from "@/lib/otp";
import type { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters";



export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "USER",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dragon-studios-super-secret-auth-key-2026",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const normalizedEmail = user.email.toLowerCase().trim();

          await prisma.auditLog.create({
            data: {
              userEmail: normalizedEmail,
              action: "GOOGLE_AUTH_SUCCESS",
              resource: "AUTHENTICATION",
              details: `Google OAuth verification initiated for ${normalizedEmail}`,
            },
          }).catch(() => {});

          // Generate & Send 6-digit OTP to user's Google email
          // (Plaintext OTP is never stored in DB — only hashed challenge)
          await createAndSendOtp(normalizedEmail).catch((e) => {
            console.error("[authOptions:signIn] Failed to send OTP:", e);
          });
        } catch (error) {
          console.error("Google Auth SignIn Error:", error);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Direct user straight to OTP verification screen after Google OAuth
      if (url.includes("/login") || url.includes("/register") || url.includes("callback/google")) {
        return `${baseUrl}/auth/verify-otp`;
      }
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/auth/verify-otp`;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.picture = user.image;
        token.emailVerified = (user as any).emailVerified || null;
        token.otpVerified = false; // Must be explicitly verified via OTP screen
      }

      if (trigger === "update" && session) {
        if (session.otpVerified !== undefined) {
          token.otpVerified = session.otpVerified;
        }
        if (session.hasCompletedWelcome !== undefined) {
          token.hasCompletedWelcome = session.hasCompletedWelcome;
        }
        if (session.hasCompletedDragonId !== undefined) {
          token.hasCompletedDragonId = session.hasCompletedDragonId;
        }
      }
      
      if (token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email.toLowerCase().trim() },
            include: { profile: true },
          });

          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.picture = dbUser.image || dbUser.avatar || token.picture;
            token.emailVerified = dbUser.emailVerified ? true : false;

            const meta = parseProfileMetadata(dbUser.profile?.notificationSettings, dbUser.name);
            token.dragonIdSetupCompleted = meta.hasCompletedDragonId;
            token.hasCompletedDragonId = meta.hasCompletedDragonId;
            token.hasCompletedWelcome = meta.hasCompletedWelcome;
            token.gamerTag = meta.gamerTag;
            token.primaryTitle = meta.primaryTitle;
            token.bannerTheme = meta.bannerTheme;
          }
        } catch (err) {
          console.warn("[jwt callback] DB query failed, using cached token:", err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "USER";
        session.user.image = (token.picture as string) || session.user.image;
        (session.user as any).emailVerified = Boolean(token.emailVerified || token.otpVerified);
        (session.user as any).otpVerified = Boolean(token.emailVerified || token.otpVerified);
        (session.user as any).dragonIdSetupCompleted = Boolean(token.dragonIdSetupCompleted || token.hasCompletedDragonId);
        (session.user as any).hasCompletedDragonId = Boolean(token.hasCompletedDragonId || token.dragonIdSetupCompleted);
        (session.user as any).hasCompletedWelcome = Boolean(token.hasCompletedWelcome);
        (session.user as any).gamerTag = (token.gamerTag as string) || "Player";
        (session.user as any).primaryTitle = (token.primaryTitle as string) || "Dragon Operative";
        (session.user as any).bannerTheme = (token.bannerTheme as string) || "lightning-cyan";
      }
      return session;
    },
  },
};

export function getSession() {
  return getServerSession(authOptions);
}

