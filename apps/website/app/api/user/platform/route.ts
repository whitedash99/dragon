import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("dragon_session")?.value;

    let user = null;
    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (session) user = session.user;
    }

    const games = await prisma.game.findMany({
      orderBy: { createdAt: "desc" },
    });

    const platformData = {
      player: {
        id: user?.id || "guest-player",
        name: user?.name || "Dragon Operative",
        email: user?.email || "",
        role: user?.role || "PLAYER",
        level: 1,
        rank: "Operative",
        hoursPlayed: 0,
        achievementsUnlocked: 0,
        totalAchievements: 10,
        globalRank: "Unranked",
      },
      library: games.map((g: any) => ({
        id: g.id,
        title: g.title,
        slug: g.slug,
        hoursPlayed: 0,
        lastPlayed: "Never",
        status: "READY_TO_DOWNLOAD",
        version: "v1.0.0",
        updateAvailable: false,
        palette: g.palette,
        heroImage: g.heroImage,
      })),
      cloudSaves: [],
      notifications: [],
    };

    return NextResponse.json({ success: true, platform: platformData });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
