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

          // 1. Ensure user exists in database
          let dbUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: { profile: true },
          }).catch(() => null);

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                name: user.name || normalizedEmail.split("@")[0],
                email: normalizedEmail,
                image: user.image,
                avatar: user.image,
                emailVerified: new Date(),
                role: "PLAYER",
                status: "ACTIVE",
                provider: "google",
                providerAccountId: account.providerAccountId,
                profile: {
                  create: {
                    country: "United States",
                    language: "en-US",
                    theme: "dark",
                    notificationSettings: JSON.stringify({
                      email: true,
                      push: true,
                      hasCompletedWelcome: false,
                      hasCompletedDragonId: false,
                    }),
                  },
                },
              },
              include: { profile: true },
            }).catch((err) => {
              console.warn("DB user create fallback:", err?.message);
              return null;
            });
          } else {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                lastLogin: new Date(),
                loginCount: { increment: 1 },
                name: user.name || dbUser.name,
                image: user.image || dbUser.image,
                avatar: user.image || dbUser.avatar,
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            }).catch(() => {});
          }

          await prisma.auditLog.create({
            data: {
              userEmail: normalizedEmail,
              action: "GOOGLE_AUTH_SUCCESS",
              resource: "AUTHENTICATION",
              details: `Google OAuth login succeeded for ${normalizedEmail}`,
            },
          }).catch(() => {});

          // Optional OTP dispatch if explicitly turned on
          if (process.env.REQUIRE_EMAIL_OTP === "true") {
            await createAndSendOtp(normalizedEmail).catch((e) => {
              console.error("[authOptions:signIn] Failed to send OTP:", e);
            });
          }
        } catch (error) {
          console.error("Google Auth SignIn Error:", error);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (process.env.REQUIRE_EMAIL_OTP === "true") {
        if (url.includes("/login") || url.includes("/register") || url.includes("callback/google")) {
          return `${baseUrl}/auth/verify-otp`;
        }
      }

      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/welcome`;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.picture = user.image;
        token.emailVerified = true;
        token.otpVerified = true;
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
            token.emailVerified = true;
            token.otpVerified = true;
            token.dragonId = dbUser.dragonId || null;

            const meta = parseProfileMetadata(dbUser.profile?.notificationSettings, dbUser.name);
            token.dragonIdSetupCompleted = Boolean(dbUser.dragonId || meta.hasCompletedDragonId);
            token.hasCompletedDragonId = Boolean(dbUser.dragonId || meta.hasCompletedDragonId);
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
        (session.user as any).emailVerified = true;
        (session.user as any).otpVerified = true;
        (session.user as any).dragonId = token.dragonId || null;
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

