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
        name: user?.name || "Kaelen Voss",
        email: user?.email || "kaelen@dragonstudios.com",
        role: user?.role || "PLAYER",
        level: 42,
        rank: "Dragon Commander",
        hoursPlayed: 328,
        achievementsUnlocked: 84,
        totalAchievements: 100,
        globalRank: "#142",
      },
      library: games.map((g, idx) => ({
        id: g.id,
        title: g.title,
        slug: g.slug,
        hoursPlayed: 120 - idx * 25,
        lastPlayed: idx === 0 ? "2 hours ago" : `${idx + 1} days ago`,
        status: idx === 0 ? "INSTALLED" : "READY_TO_DOWNLOAD",
        version: "v1.4.2",
        updateAvailable: idx === 1,
        palette: g.palette,
        heroImage: g.heroImage,
      })),
      cloudSaves: [
        { id: "cs-101", game: "Embers of Valyria", slot: "Slot 1 (Chapter 8 - Dragon's Nest)", date: "2026-08-01 16:45", size: "14.2 MB", device: "PC Windows 11" },
        { id: "cs-102", game: "Neon Drift: Overdrive", slot: "Slot 2 (Career Master Cup)", date: "2026-07-31 22:10", size: "8.4 MB", device: "Steam Deck" },
        { id: "cs-103", game: "Blacksite Zero", slot: "Slot 1 (Co-op Campaign Final)", date: "2026-07-28 19:30", size: "22.1 MB", device: "PS5 Console" },
      ],
      notifications: [
        { id: "n-1", type: "UPDATE", title: "Embers of Valyria Patch 1.4.2 Released", text: "DLSS 3.5 Frame Generation and Ray-Traced Shadow fixes now live.", time: "1 hour ago" },
        { id: "n-2", type: "SUPPORT", title: "Support Ticket DRG-2026-000001 Updated", text: "Support Agent Alex replied to your graphics memory ticket.", time: "3 hours ago" },
        { id: "n-3", type: "EVENT", title: "Dragon Studios Summer Playtest Tournament", text: "Registration now open for the $50,000 Arena Championship.", time: "1 day ago" },
      ],
    };

    return NextResponse.json({ success: true, platform: platformData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
