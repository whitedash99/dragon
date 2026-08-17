import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any) as any,
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
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { profile: true },
          });

          if (existingUser) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                lastLogin: new Date(),
                loginCount: { increment: 1 },
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                avatar: user.image || existingUser.avatar,
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            });

            if (!existingUser.profile) {
              await prisma.userProfile.create({
                data: {
                  userId: existingUser.id,
                  country: "United States",
                  language: "en-US",
                  theme: "dark",
                  notificationSettings: JSON.stringify({ email: true, push: true }),
                },
              }).catch((e: unknown) => console.warn("UserProfile creation warning:", e));
            }
          }
        } catch (error) {
          console.error("Google Auth SignIn Sync Error:", error);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/login") || url.includes("/register")) {
        return `${baseUrl}/dashboard`;
      }
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.picture = user.image;
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
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "USER";
        session.user.image = (token.picture as string) || session.user.image;
      }
      return session;
    },
  },
};

export function getSession() {
  return getServerSession(authOptions);
}
