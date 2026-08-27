import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { parseProfileMetadata, generateCanonicalDragonId } from "@/lib/user-profile";
import type { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters";

// ═══════════════════════════════════════════════════════════════════════
// CRASH-PROOF DRAGON ADAPTER
// Handles ALL database failures gracefully so Google OAuth never shows
// error=Callback. Since we use JWT strategy, the adapter is only needed
// for initial user creation & Account linking.
// ═══════════════════════════════════════════════════════════════════════
function createDragonAdapter(): Adapter {
  return {
    async createUser(data: Omit<AdapterUser, "id">): Promise<AdapterUser> {
      try {
        const email = (data.email || "").toLowerCase().trim();
        // Check if user already exists (e.g. registered via email form earlier)
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return {
            id: existing.id,
            name: existing.name,
            email: existing.email,
            emailVerified: existing.emailVerified,
            image: existing.image,
          } as AdapterUser;
        }

        const dragonId = generateCanonicalDragonId();
        let user;
        try {
          user = await prisma.user.create({
            data: {
              name: data.name || email.split("@")[0],
              email,
              image: data.image,
              emailVerified: data.emailVerified || new Date(),
              dragonId,
              role: "PLAYER",
              provider: "google",
            },
          });
        } catch {
          // Fallback without dragonId if column doesn't exist
          user = await prisma.user.create({
            data: {
              name: data.name || email.split("@")[0],
              email,
              image: data.image,
              emailVerified: data.emailVerified || new Date(),
              role: "PLAYER",
              provider: "google",
            },
          });
        }

        // Create default profile
        await prisma.userProfile.create({
          data: {
            userId: user.id,
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
        }).catch(() => {});

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        } as AdapterUser;
      } catch (err) {
        console.error("[DragonAdapter] createUser error:", err);
        // Return a minimal user object so NextAuth doesn't crash
        return {
          id: `temp-${Date.now()}`,
          name: data.name || "Dragon Operative",
          email: data.email || "",
          emailVerified: null,
          image: data.image || null,
        } as AdapterUser;
      }
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        } as AdapterUser;
      } catch {
        return null;
      }
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      try {
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });
        if (!user) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        } as AdapterUser;
      } catch {
        return null;
      }
    },

    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }): Promise<AdapterUser | null> {
      try {
        const account = await prisma.account.findUnique({
          where: { provider_providerAccountId: { provider, providerAccountId } },
          include: { user: true },
        });
        if (!account?.user) return null;
        return {
          id: account.user.id,
          name: account.user.name,
          email: account.user.email,
          emailVerified: account.user.emailVerified,
          image: account.user.image,
        } as AdapterUser;
      } catch {
        return null;
      }
    },

    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
      try {
        const user = await prisma.user.update({
          where: { id: data.id },
          data: {
            name: data.name ?? undefined,
            email: data.email ?? undefined,
            image: data.image ?? undefined,
            emailVerified: data.emailVerified ?? undefined,
          },
        });
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        } as AdapterUser;
      } catch {
        return data as AdapterUser;
      }
    },

    async linkAccount(account: AdapterAccount): Promise<void> {
      try {
        await prisma.account.create({
          data: {
            userId: account.userId,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token ?? null,
            access_token: account.access_token ?? null,
            expires_at: account.expires_at ?? null,
            token_type: account.token_type ?? null,
            scope: account.scope ?? null,
            id_token: account.id_token ?? null,
            session_state: (account.session_state as string) ?? null,
          },
        });
      } catch (err: any) {
        // Unique constraint violation = account already linked, that's OK
        if (err?.code === "P2002") {
          console.log("[DragonAdapter] Account already linked, skipping.");
          return;
        }
        console.warn("[DragonAdapter] linkAccount non-fatal error:", err?.message);
        // Don't throw — this prevents the Callback error
      }
    },

    async createSession() {
      // JWT strategy — sessions are not stored in DB
      throw new Error("JWT strategy used");
    },
    async getSessionAndUser() {
      throw new Error("JWT strategy used");
    },
    async updateSession() {
      throw new Error("JWT strategy used");
    },
    async deleteSession() {
      // noop
    },

    async createVerificationToken(data: { identifier: string; token: string; expires: Date }) {
      try {
        return await prisma.verificationToken.create({ data });
      } catch {
        return null as any;
      }
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
      try {
        return await prisma.verificationToken.delete({
          where: { identifier_token: { identifier, token } },
        });
      } catch {
        return null;
      }
    },

    async deleteUser(id: string) {
      try {
        await prisma.user.delete({ where: { id } });
      } catch {}
    },

    async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
      try {
        await prisma.account.delete({
          where: { provider_providerAccountId: { provider, providerAccountId } },
        });
      } catch {}
    },
  };
}

export const authOptions: NextAuthOptions = {
  adapter: createDragonAdapter(),
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
          const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: { profile: true },
          }).catch(() => null);

          if (existingUser) {
            // Update login metadata — safe fallback for dragonId
            try {
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
                  emailVerified: existingUser.emailVerified || new Date(),
                  dragonId: existingUser.dragonId || generateCanonicalDragonId(),
                },
              });
            } catch {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  lastLogin: new Date(),
                  loginCount: { increment: 1 },
                  name: user.name || existingUser.name,
                  image: user.image || existingUser.image,
                  provider: "google",
                  providerAccountId: account.providerAccountId,
                  emailVerified: existingUser.emailVerified || new Date(),
                },
              }).catch((e) => console.warn("User update fallback:", e?.message));
            }

            if (!existingUser.profile) {
              await prisma.userProfile.create({
                data: {
                  userId: existingUser.id,
                  country: "United States",
                  language: "en-US",
                  theme: "dark",
                  notificationSettings: JSON.stringify({ email: true, push: true, hasCompletedWelcome: false, hasCompletedDragonId: false }),
                },
              }).catch(() => {});
            }

            await prisma.auditLog.create({
              data: {
                userId: existingUser.id,
                userEmail: normalizedEmail,
                action: "GOOGLE_OAUTH_LOGIN",
                resource: "AUTHENTICATION",
                details: `Google Sign-In: ${normalizedEmail}`,
              },
            }).catch(() => {});

            await prisma.notification.create({
              data: {
                title: "Security Alert: Google Sign-In Active",
                message: `You signed into Dragon Gaming Studios with Google (${normalizedEmail}).`,
                type: "AUTH_LOGIN",
                recipient: normalizedEmail,
                channel: "IN_APP",
              },
            }).catch(() => {});
          } else {
            await prisma.auditLog.create({
              data: {
                userEmail: normalizedEmail,
                action: "GOOGLE_OAUTH_REGISTER",
                resource: "AUTHENTICATION",
                details: `New Google OAuth registration: ${normalizedEmail}`,
              },
            }).catch(() => {});
          }
        } catch (error) {
          console.error("Google Auth SignIn Sync Error:", error);
          // CRITICAL: Always return true so the user is not blocked
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("/login") || url.includes("/register") || url.includes("callback/google")) {
        return `${baseUrl}/welcome`;
      }
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return `${baseUrl}/welcome`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
        token.picture = user.image;
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

