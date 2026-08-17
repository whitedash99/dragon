import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/database/prisma";

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

        // Security Guard: Domain Whitelist for Admin OS Google Login
        const ownerConfigEmail = (process.env.OWNER_NOTIFICATION_EMAIL || "whitedash99@gmail.com").toLowerCase().trim();
        const isOwnerEmail =
          cleanEmail === ownerConfigEmail ||
          cleanEmail === "whitedash99@gmail.com" ||
          cleanEmail === "dragongamingstudio1212@gmail.com" ||
          cleanEmail === "dragonstudiosofficial01@gmail.com" ||
          cleanEmail === "dragonstudiosofficial02@gmail.com" ||
          cleanEmail.includes("owner") ||
          cleanEmail.includes("founder");
        const isAllowedDomain = cleanEmail.endsWith("@dragonstudios.com") || isOwnerEmail;
        if (!isAllowedDomain) {
          console.warn(`[Google OAuth Blocked] Attempted Admin login from unapproved domain: ${cleanEmail}`);
          return false;
        }

        try {
          const dbUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
          if (dbUser) {
            // Reject customer accounts
            if (dbUser.role === "USER") {
              console.warn(`[Google OAuth Blocked] Customer account attempted Admin OS login: ${cleanEmail}`);
              return false;
            }
            if (dbUser.status !== "ACTIVE" || !dbUser.isActive || dbUser.isDeleted) {
              return false;
            }
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
          }
        } catch (err) {
          console.error("Admin Google Auth Error:", err);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id?: string; role?: string; image?: string };
        token.id = u.id;
        token.role = u.role || "ADMIN";
        token.picture = u.image;
      } else if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, role: true, name: true, image: true, avatar: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.picture = dbUser.image || dbUser.avatar || token.picture;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sUser = session.user as unknown as { id?: string; role?: string; image?: string | null };
        sUser.id = token.id as string;
        sUser.role = (token.role as string) || "ADMIN";
        session.user.image = (token.picture as string) || session.user.image;
      }
      return session;
    },
  },
};
