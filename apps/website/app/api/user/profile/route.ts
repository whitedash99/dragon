import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  parseProfileMetadata,
  serializeProfileMetadata,
  validateDragonIdHandle,
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

    // Method 2: Fallback to NextAuth Google OAuth session
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

    // Ensure user has a real canonical DragonID in database
    if (!targetUser.dragonId) {
      const generatedId = `DRG-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      targetUser = await prisma.user.update({
        where: { id: targetUser.id },
        data: { dragonId: generatedId },
        include: { profile: true },
      });
    }

    // Fetch user real support tickets
    const tickets = await prisma.contactTicket.findMany({
      where: { email: targetUser.email, deleted: false },
      orderBy: { createdAt: "desc" },
      take: 10,
    }).catch(() => []);

    return NextResponse.json({
      success: true,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        dragonId: targetUser.dragonId,
        role: targetUser.role,
        image: targetUser.image || targetUser.avatar,
        avatar: targetUser.avatar || targetUser.image,
        createdAt: targetUser.createdAt,
        securityScore: targetUser.securityScore || 95,
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

