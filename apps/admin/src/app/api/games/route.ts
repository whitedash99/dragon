import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    const games = await prisma.gameContent.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        mediaList: true,
        gameFeatures: true,
        platformList: true,
        patchNotes: true,
        dlcList: true,
      },
    });

    const filtered = games.filter((g) => {
      const matchesSearch = !q || (
        g.name.toLowerCase().includes(q.toLowerCase()) ||
        g.genre.toLowerCase().includes(q.toLowerCase()) ||
        g.platforms.toLowerCase().includes(q.toLowerCase())
      );
      const matchesStatus = !status || status === "All" || g.status === status;
      return matchesSearch && matchesStatus;
    });

    const totalGames = games.length;
    const publishedGames = games.filter((g) => g.isPublished).length;
    const inDevelopment = games.filter((g) => g.status === "In Development" || g.status === "Development").length;
    const upcoming = games.filter((g) => g.status === "Coming Soon" || g.status === "Pre Production").length;

    return NextResponse.json({
      success: true,
      games: filtered,
      telemetry: {
        totalGames,
        publishedGames,
        inDevelopment,
        upcoming,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, slug, genre, status, releaseDate, platforms, description, isPublished } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Game name is required" }, { status: 400 });
    }

    const safeSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const game = await prisma.gameContent.upsert({
      where: { slug: safeSlug },
      update: {
        name,
        genre: genre || "Action RPG",
        status: status || "In Development",
        releaseDate: releaseDate || "TBA 2027",
        platforms: platforms || "PC, PS5, Xbox Series X",
        description: description || "An epic AAA experience forged by Dragon Studios.",
        isPublished: isPublished ?? true,
      },
      create: {
        name,
        slug: safeSlug,
        genre: genre || "Action RPG",
        status: status || "In Development",
        releaseDate: releaseDate || "TBA 2027",
        platforms: platforms || "PC, PS5, Xbox Series X",
        description: description || "An epic AAA experience forged by Dragon Studios.",
        isPublished: isPublished ?? true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: id ? "UPDATE_GAME" : "CREATE_GAME",
        userEmail: "Admin",
        details: `Saved Game Title: ${game.name} (${game.slug})`,
      },
    });

    return NextResponse.json({ success: true, game });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Game ID is required" }, { status: 400 });
    }

    const game = await prisma.gameContent.findUnique({ where: { id } });
    if (game) {
      await prisma.gameContent.delete({ where: { id } });

      await prisma.auditLog.create({
        data: {
          action: "DELETE_GAME",
          userEmail: "Admin",
          details: `Deleted Game: ${game.name} (${game.slug})`,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Game title deleted successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
