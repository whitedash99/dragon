import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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

    // Parse custom metadata from profile
    let customTheme = "valyria-fire";
    let customBannerUrl = "";
    let gamerTag = targetUser.name || targetUser.email.split("@")[0];
    let primaryTitle = "Dragon Warrior";

    if (targetUser.profile?.notificationSettings) {
      try {
        const meta = JSON.parse(targetUser.profile.notificationSettings);
        if (meta.bannerTheme) customTheme = meta.bannerTheme;
        if (meta.bannerUrl) customBannerUrl = meta.bannerUrl;
        if (meta.gamerTag) gamerTag = meta.gamerTag;
        if (meta.primaryTitle) primaryTitle = meta.primaryTitle;
      } catch {}
    }

    // Fetch user support tickets
    const tickets = await prisma.contactTicket.findMany({
      where: { email: targetUser.email, deleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    }).catch(() => []);

    return NextResponse.json({
      success: true,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        image: targetUser.image,
        createdAt: targetUser.createdAt,
        gamerTag,
        primaryTitle,
        bannerTheme: customTheme,
        bannerUrl: customBannerUrl,
        bio: targetUser.profile?.bio || "Dragon Studios Player & VIP Member",
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

    const body = await req.json();
    const { name, gamerTag, primaryTitle, bannerTheme, bannerUrl, bio } = body;

    // Update User Name
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        name: name ? String(name).trim() : undefined,
      },
    });

    // Upsert UserProfile with gamer customization metadata
    const settingsPayload = JSON.stringify({
      bannerTheme: bannerTheme || "valyria-fire",
      bannerUrl: bannerUrl || "",
      gamerTag: gamerTag || name || "Player",
      primaryTitle: primaryTitle || "Dragon Warrior",
    });

    await prisma.userProfile.upsert({
      where: { userId: targetUserId },
      update: {
        bio: bio || undefined,
        notificationSettings: settingsPayload,
      },
      create: {
        userId: targetUserId,
        bio: bio || "Dragon Studios Player & VIP Member",
        notificationSettings: settingsPayload,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        gamerTag,
        primaryTitle,
        bannerTheme,
        bannerUrl,
        bio,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
