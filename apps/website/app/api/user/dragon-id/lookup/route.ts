import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseProfileMetadata } from "@/lib/user-profile";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("query") || searchParams.get("id") || "").trim();

    if (!query) {
      return NextResponse.json({ success: false, error: "DragonID query parameter is required." }, { status: 400 });
    }

    const clean = query.replace(/^@/, "").trim();
    const upperQuery = clean.toUpperCase();

    // 1. Search DB by dragonId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { dragonId: query },
          { dragonId: clean },
          { dragonId: upperQuery },
          { email: clean.toLowerCase() },
        ],
      },
      include: { profile: true },
    });

    // 2. Fallback search by gamerTag in profile notificationSettings
    if (!user) {
      const profiles = await prisma.userProfile.findMany({
        where: {
          notificationSettings: {
            contains: clean,
          },
        },
        include: { user: true },
        take: 5,
      });

      for (const p of profiles) {
        const meta = parseProfileMetadata(p.notificationSettings, p.user?.name);
        if (meta.gamerTag.toLowerCase() === clean.toLowerCase()) {
          user = { ...p.user, profile: p } as any;
          break;
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: `No registered operative found with DragonID '${query}'. Please verify the ID and try again.`,
        },
        { status: 404 }
      );
    }

    const metadata = parseProfileMetadata(user.profile?.notificationSettings, user.name);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name || metadata.gamerTag || "Dragon Operative",
        dragonId: user.dragonId || `DRG-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        gamerTag: metadata.gamerTag,
        primaryTitle: metadata.primaryTitle,
        bannerTheme: metadata.bannerTheme,
        avatarId: metadata.avatarId,
        avatar: user.avatar || user.image,
        role: user.role,
        bio: user.profile?.bio || "Dragon Studios Verified Player",
        createdAt: user.createdAt,
        securityScore: user.securityScore || 95,
        isVerified: true,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
