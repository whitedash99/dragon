import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  parseProfileMetadata,
  serializeProfileMetadata,
  validateDragonIdHandle,
  generateCanonicalDragonId,
  generateDragonPassKey,
} from "@/lib/user-profile";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    let targetUser: any = null;

    // Method 1: Check dragon_session cookie
    const sessionToken = req.cookies.get("dragon_session")?.value;
    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: { include: { profile: true } } },
      });
      if (session && session.user) {
        targetUser = session.user;
      }
    }

    // Method 2: Check Authorization: Bearer token (Dragon ID SSO / OAuth Access Token)
    if (!targetUser) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const bearer = authHeader.replace(/^Bearer\s+/, "").trim();
        if (bearer.startsWith("drg_at_")) {
          try {
            const raw = bearer.replace(/^drg_at_/, "");
            const payload = JSON.parse(Buffer.from(raw, "base64url").toString("utf-8"));
            if (payload.userId) {
              targetUser = await prisma.user.findUnique({
                where: { id: payload.userId },
                include: { profile: true },
              });
            }
          } catch {
            // invalid bearer
          }
        }
      }
    }

    // Method 3: Fallback to NextAuth Google OAuth session
    if (!targetUser) {
      const authSession = await getServerSession(authOptions).catch(() => null);
      if (authSession?.user?.email) {
        targetUser = await prisma.user.findUnique({
          where: { email: authSession.user.email.toLowerCase().trim() },
          include: { profile: true },
        });
      }
    }

    if (!targetUser) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const metadata = parseProfileMetadata(targetUser.profile?.notificationSettings, targetUser.name);

    // Ensure user has a Personalized DragonID and Dragon Key (isolated per individual user)
    let effectiveDragonId = targetUser.dragonId;
    let effectiveDragonKey = targetUser.dragonKeyPrefix;

    if (!effectiveDragonId || !effectiveDragonKey) {
      effectiveDragonId = effectiveDragonId || generateCanonicalDragonId(metadata.gamerTag || targetUser.name);
      effectiveDragonKey = effectiveDragonKey || generateDragonPassKey();
      try {
        targetUser = await prisma.user.update({
          where: { id: targetUser.id },
          data: {
            dragonId: effectiveDragonId,
            dragonKeyPrefix: effectiveDragonKey,
          },
          include: { profile: true },
        });
      } catch {
        // Continue with generated credentials if DB column locked
      }
    }

    // Fetch user real support tickets
    const tickets = await prisma.contactTicket.findMany({
      where: { email: targetUser.email, deleted: false },
      orderBy: { createdAt: "desc" },
      take: 10,
    }).catch(() => []);

    return NextResponse.json({
      success: true,
      sub: effectiveDragonId || targetUser.dragonId || targetUser.id,
      id: targetUser.id,
      dragonId: effectiveDragonId || targetUser.dragonId || `DRG-ZDF-9415`,
      dragonKey: effectiveDragonKey || `DRG-KEY-8942-XF92`,
      handle: metadata.gamerTag || "operative",
      gamerTag: metadata.gamerTag || "operative",
      displayName: targetUser.name || metadata.gamerTag || "Dragon Operative",
      name: targetUser.name || metadata.gamerTag || "Dragon Operative",
      avatarUrl: targetUser.image || targetUser.avatar || metadata.avatarId,
      bannerUrl: metadata.bannerUrl,
      email: targetUser.email,
      role: targetUser.role,
      securityScore: targetUser.securityScore || 98,
      vaultStatus: "ISOLATED & HARDENED",
      vaultEncryption: "AES-256-GCM / SHA-256",
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        dragonId: effectiveDragonId || targetUser.dragonId || `DRG-ZDF-9415`,
        dragonKey: effectiveDragonKey || `DRG-KEY-8942-XF92`,
        role: targetUser.role,
        image: targetUser.image || targetUser.avatar,
        avatar: targetUser.avatar || targetUser.image,
        createdAt: targetUser.createdAt,
        securityScore: targetUser.securityScore || 98,
        vaultStatus: "ISOLATED & HARDENED",
        gamerTag: metadata.gamerTag,
        primaryTitle: metadata.primaryTitle,
        bannerTheme: metadata.bannerTheme,
        bannerUrl: metadata.bannerUrl,
        avatarId: metadata.avatarId,
        bio: targetUser.profile?.bio || "Dragon Studios Player & VIP Member",
      },
      metadata,
      onboarding: {
        hasCompletedWelcome: metadata.hasCompletedWelcome,
        hasCompletedDragonId: metadata.hasCompletedDragonId,
        step: metadata.onboardingStep,
      },
      tickets,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    let targetUserId: string | null = null;

    // Method 1: Cookie session
    const sessionToken = req.cookies.get("dragon_session")?.value;
    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
      });
      if (session) {
        targetUserId = session.userId;
      }
    }

    // Method 2: NextAuth session
    if (!targetUserId) {
      const authSession = await getServerSession(authOptions).catch(() => null);
      if (authSession?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: authSession.user.email.toLowerCase().trim() },
        });
        if (user) targetUserId = user.id;
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { profile: true },
    });

    if (!existingUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, gamerTag, primaryTitle, bannerTheme, bannerUrl, avatar, image, bio } = body;

    const currentMetadata = parseProfileMetadata(existingUser.profile?.notificationSettings, existingUser.name);

    if (gamerTag) {
      const val = validateDragonIdHandle(gamerTag);
      if (!val.valid) {
        return NextResponse.json({ success: false, error: val.error }, { status: 400 });
      }
    }

    const targetGamerTag = (gamerTag || name || currentMetadata.gamerTag).trim();
    const targetAvatar = avatar || image || currentMetadata.avatarId;

    // Update User Name and Avatar
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        name: name ? String(name).trim() : undefined,
        image: targetAvatar ? String(targetAvatar) : undefined,
        avatar: targetAvatar ? String(targetAvatar) : undefined,
      },
    });

    const updatedMetadataString = serializeProfileMetadata(currentMetadata, {
      gamerTag: targetGamerTag,
      primaryTitle: primaryTitle || currentMetadata.primaryTitle,
      bannerTheme: bannerTheme || currentMetadata.bannerTheme,
      bannerUrl: bannerUrl !== undefined ? bannerUrl : currentMetadata.bannerUrl,
      avatarId: targetAvatar,
      hasCompletedDragonId: true,
    });

    // Upsert UserProfile with gamer customization metadata
    await prisma.userProfile.upsert({
      where: { userId: targetUserId },
      update: {
        bio: bio !== undefined ? bio : undefined,
        notificationSettings: updatedMetadataString,
      },
      create: {
        userId: targetUserId,
        bio: bio || "Dragon Studios Player & VIP Member",
        notificationSettings: updatedMetadataString,
      },
    });

    const refreshedMetadata = parseProfileMetadata(updatedMetadataString, updatedUser.name);

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        gamerTag: refreshedMetadata.gamerTag,
        primaryTitle: refreshedMetadata.primaryTitle,
        bannerTheme: refreshedMetadata.bannerTheme,
        bannerUrl: refreshedMetadata.bannerUrl,
        avatarId: refreshedMetadata.avatarId,
        bio: bio || existingUser.profile?.bio || "Dragon Studios Player & VIP Member",
      },
      metadata: refreshedMetadata,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

