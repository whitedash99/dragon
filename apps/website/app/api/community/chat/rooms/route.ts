import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_ROOMS = [
  // INFORMATION
  {
    name: "welcome",
    slug: "welcome",
    description: "Welcome to Dragon Studios Insiders Community. Start here!",
    category: "INFORMATION",
    type: "ANNOUNCEMENT",
    order: 1,
    icon: "Sparkles",
  },
  {
    name: "rules",
    slug: "rules",
    description: "Official Dragon Studios Community Code of Conduct and Safety Guidelines.",
    category: "INFORMATION",
    type: "ANNOUNCEMENT",
    order: 2,
    icon: "ShieldAlert",
  },
  {
    name: "announcements",
    slug: "announcements",
    description: "Official studio updates, patch releases, and dev dispatches.",
    category: "INFORMATION",
    type: "ANNOUNCEMENT",
    order: 3,
    icon: "Megaphone",
  },

  // COMMUNITY
  {
    name: "general",
    slug: "general",
    description: "Main lobby for Dragon Studios gamers and creators.",
    category: "COMMUNITY",
    type: "TEXT",
    order: 10,
    icon: "Hash",
  },
  {
    name: "gaming",
    slug: "gaming",
    description: "Discuss gameplay mechanics, tactics, builds, and matchmaking.",
    category: "COMMUNITY",
    type: "TEXT",
    order: 11,
    icon: "Gamepad2",
  },
  {
    name: "screenshots",
    slug: "screenshots",
    description: "Share in-game captures, ray-traced visuals, and fan art.",
    category: "COMMUNITY",
    type: "TEXT",
    order: 12,
    icon: "Image",
  },
  {
    name: "suggestions",
    slug: "suggestions",
    description: "Player feature proposals and quality-of-life suggestions.",
    category: "COMMUNITY",
    type: "TEXT",
    order: 13,
    icon: "Lightbulb",
  },
  {
    name: "off-topic",
    slug: "off-topic",
    description: "Chill talk, music, hardware discussions, and tech banter.",
    category: "COMMUNITY",
    type: "TEXT",
    order: 14,
    icon: "Coffee",
  },

  // GAMES
  {
    name: "embers-of-valyria",
    slug: "embers-of-valyria",
    description: "Official discussion hub for Embers of Valyria (Action RPG).",
    category: "GAMES",
    type: "TEXT",
    order: 20,
    icon: "Flame",
  },
  {
    name: "neon-drift",
    slug: "neon-drift",
    description: "Speedway strategies, vehicle modding, and track leaderboards.",
    category: "GAMES",
    type: "TEXT",
    order: 21,
    icon: "Zap",
  },
  {
    name: "blacksite-zero",
    slug: "blacksite-zero",
    description: "Tactical extraction shooter coordination, squads, and weapon metas.",
    category: "GAMES",
    type: "TEXT",
    order: 22,
    icon: "Crosshair",
  },
];

export async function GET(req: NextRequest) {
  try {
    let rooms = await prisma.communityRoom.findMany({
      where: { isArchived: false },
      orderBy: [{ category: "asc" }, { order: "asc" }],
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    // Auto-seed default rooms if database has none
    if (rooms.length === 0) {
      for (const roomData of DEFAULT_ROOMS) {
        await prisma.communityRoom.upsert({
          where: { slug: roomData.slug },
          update: {},
          create: roomData,
        });
      }

      rooms = await prisma.communityRoom.findMany({
        where: { isArchived: false },
        orderBy: [{ category: "asc" }, { order: "asc" }],
        include: {
          _count: {
            select: { messages: true },
          },
        },
      });
    }

    return NextResponse.json({ success: true, rooms });
  } catch (error: any) {
    console.error("[Community Rooms API Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch community rooms." },
      { status: 500 }
    );
  }
}
