import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/database/prisma";
import { isConfiguredOwnerEmail, recordSecurityAudit } from "@/lib/auth/security";

export const adminAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
          role: "ADMIN",
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

        // 1. Supreme Owner check
        const isOwner = isConfiguredOwnerEmail(cleanEmail);

        try {
          const dbUser = await prisma.user.findUnique({ where: { email: cleanEmail } });

          // If official owner, guarantee full ACTIVE OWNER state
          if (isOwner) {
            if (!dbUser) {
              await prisma.user.create({
                data: {
                  email: cleanEmail,
                  name: user.name || cleanEmail.split("@")[0],
                  role: "OWNER",
                  status: "ACTIVE",
                  isActive: true,
                  isProtected: true,
                  permissions: JSON.stringify(["*"]),
                  image: user.image,
                  avatar: user.image,
                },
              });
            } else {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                  role: "OWNER",
                  status: "ACTIVE",
                  isActive: true,
                  isProtected: true,
                  permissions: JSON.stringify(["*"]),
                  lastLogin: new Date(),
                  loginCount: { increment: 1 },
                  name: user.name || dbUser.name,
                  image: user.image || dbUser.image,
                  avatar: user.image || dbUser.avatar,
                },
              });
            }

            await recordSecurityAudit({
              userEmail: cleanEmail,
              action: "SUPREME_OWNER_GOOGLE_LOGIN_SUCCESS",
              resource: "GOOGLE_OAUTH",
              details: `Official Dragon Studios Owner authenticated: ${cleanEmail}`,
              severity: "LOW",
            });

            return true;
          }

          // If not configured owner and not in DB as an approved admin, deny access
          if (!dbUser) {
            await recordSecurityAudit({
              userEmail: cleanEmail,
              action: "UNAUTHORIZED_GOOGLE_OAUTH_ATTEMPT",
              resource: "GOOGLE_OAUTH",
              details: `Uninvited Google OAuth sign-in rejected for ${cleanEmail}`,
              severity: "MEDIUM",
            });
            return false;
          }

          // Reject customer accounts
          if (dbUser.role === "USER") {
            await recordSecurityAudit({
              userId: dbUser.id,
              userEmail: cleanEmail,
              action: "CUSTOMER_OAUTH_BLOCKED",
              resource: "GOOGLE_OAUTH",
              details: `Customer account attempted admin panel OAuth sign-in`,
              severity: "HIGH",
            });
            return false;
          }

          // Reject suspended, pending, or inactive accounts
          if (dbUser.status !== "ACTIVE" || !dbUser.isActive || dbUser.isDeleted) {
            await recordSecurityAudit({
              userId: dbUser.id,
              userEmail: cleanEmail,
              action: "SUSPENDED_OAUTH_BLOCKED",
              resource: "GOOGLE_OAUTH",
              details: `Inactive/suspended account attempted OAuth sign-in: ${dbUser.status}`,
              severity: "HIGH",
            });
            return false;
          }

          // Update login metrics
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              lastLogin: new Date(),
              loginCount: { increment: 1 },
              name: user.name || dbUser.name,
              image: user.image || dbUser.image,
              avatar: user.image || dbUser.avatar,
            },
          });

          await recordSecurityAudit({
            userId: dbUser.id,
            userEmail: cleanEmail,
            action: "GOOGLE_OAUTH_SUCCESS",
            resource: "GOOGLE_OAUTH",
            details: `Staff member authenticated via Google OAuth (${dbUser.role})`,
            severity: "LOW",
          });
        } catch (err) {
          console.error("[Google Auth Callback Error]:", err);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id?: string; role?: string; image?: string };
        token.id = u.id;
        token.role = isConfiguredOwnerEmail(token.email || "") ? "OWNER" : u.role || "ADMIN";
        token.picture = u.image;
      } else if (token.email) {
        if (isConfiguredOwnerEmail(token.email)) {
          token.role = "OWNER";
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, role: true, name: true, image: true, avatar: true, status: true, isActive: true, isDeleted: true },
          });
          if (dbUser && dbUser.status === "ACTIVE" && dbUser.isActive && !dbUser.isDeleted) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.picture = dbUser.image || dbUser.avatar || token.picture;
          } else {
            token.id = undefined;
            token.role = undefined;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sUser = session.user as unknown as { id?: string; role?: string; image?: string | null };
        sUser.id = token.id as string;
        sUser.role = isConfiguredOwnerEmail(session.user.email || "") ? "OWNER" : (token.role as string) || "ADMIN";
        session.user.image = (token.picture as string) || session.user.image;
      }
      return session;
    },
  },
};
