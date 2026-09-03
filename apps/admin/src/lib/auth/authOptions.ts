import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/database/prisma";
import { isConfiguredOwnerEmail, recordSecurityAudit } from "@/lib/auth/security";

export const adminAuthOptions: NextAuthOptions = {
  // No database adapter needed — JWT strategy manages session securely and prevents adapter schema mismatches
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
          role: "OWNER",
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
        const cleanEmail = user.email.toLowerCase().trim();

        // STRICT SECURITY LOCKDOWN: For now, ONLY whitedash99@gmail.com is authorized to sign in
        if (cleanEmail !== "whitedash99@gmail.com") {
          await recordSecurityAudit({
            userEmail: cleanEmail,
            action: "UNAUTHORIZED_GOOGLE_OAUTH_ATTEMPT",
            resource: "GOOGLE_OAUTH",
            details: `Strict access policy: Only whitedash99@gmail.com is authorized. Rejected ${cleanEmail}`,
            severity: "HIGH",
          }).catch(() => {});

          console.warn(`[Security Lockdown] Access denied for ${cleanEmail}. ONLY whitedash99@gmail.com is permitted.`);
          return false;
        }

        // Guarantee whitedash99@gmail.com has ACTIVE OWNER status in the database
        try {
          await prisma.user.upsert({
            where: { email: "whitedash99@gmail.com" },
            update: {
              role: "OWNER",
              status: "ACTIVE",
              isActive: true,
              isProtected: true,
              name: user.name || "Tanish sharma",
              image: user.image,
              avatar: user.image,
              lastLogin: new Date(),
            },
            create: {
              email: "whitedash99@gmail.com",
              name: user.name || "Tanish sharma",
              role: "OWNER",
              status: "ACTIVE",
              isActive: true,
              isProtected: true,
              image: user.image,
              avatar: user.image,
              securityScore: 100,
            },
            select: {
              id: true,
              email: true,
              role: true,
            },
          });

          await recordSecurityAudit({
            userEmail: cleanEmail,
            action: "SUPREME_OWNER_GOOGLE_LOGIN_SUCCESS",
            resource: "GOOGLE_OAUTH",
            details: `Official Dragon Studios Owner authenticated: ${cleanEmail}`,
            severity: "LOW",
          }).catch(() => {});
        } catch (dbErr) {
          console.warn("[OAuth Database Sync Warning - Proceeding with JWT]:", dbErr);
        }

        return true;
      }

      return false;
    },

    async jwt({ token, user }) {
      if (token.email) {
        const cleanEmail = token.email.toLowerCase().trim();
        // Strict lockdown: only whitedash99@gmail.com is authorized
        if (cleanEmail !== "whitedash99@gmail.com") {
          return {};
        }

        token.role = "OWNER";
        if (user) {
          const u = user as unknown as { id?: string; role?: string; image?: string };
          token.id = u.id;
          token.picture = u.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        const cleanEmail = (session.user.email || "").toLowerCase().trim();
        if (cleanEmail !== "whitedash99@gmail.com") {
          return {} as any;
        }

        const sUser = session.user as unknown as { id?: string; role?: string; image?: string | null };
        sUser.id = (token.id as string) || "owner_whitedash99";
        sUser.role = "OWNER";
        session.user.image = (token.picture as string) || session.user.image;
      }
      return session;
    },
  },
};
