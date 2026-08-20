import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";

export const dynamic = "force-dynamic";

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

    const parsedGames = games.map((g) => {
      let customData: any = {};
      try {
        if (g.features && g.features.startsWith("{")) {
          customData = JSON.parse(g.features);
        }
      } catch {}

      return {
        ...g,
        dimension: customData.dimension || "3D",
        engineVersion: customData.engineVersion || (customData.dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine"),
        pcExeUrl: customData.pcExeUrl || "",
        pcFileSize: customData.pcFileSize || "500 MB",
        mobileApkUrl: customData.mobileApkUrl || "",
        mobileFileSize: customData.mobileFileSize || "120 MB",
      };
    });

    const filtered = parsedGames.filter((g) => {
      const matchesSearch = !q || (
        g.name.toLowerCase().includes(q.toLowerCase()) ||
        g.genre.toLowerCase().includes(q.toLowerCase()) ||
        g.platforms.toLowerCase().includes(q.toLowerCase())
      );
      const matchesStatus = !status || status === "All" || g.status === status;
      return matchesSearch && matchesStatus;
    });

    const totalGames = parsedGames.length;
    const publishedGames = parsedGames.filter((g) => g.isPublished).length;
    const games3dCount = parsedGames.filter((g) => g.dimension === "3D").length;
    const games2dCount = parsedGames.filter((g) => g.dimension === "2D").length;

    return NextResponse.json({
      success: true,
      games: filtered,
      telemetry: {
        totalGames,
        publishedGames,
        games3dCount,
        games2dCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (!can(auth.user, "games.manage") && !can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires games.manage permission." }, { status: 403 });
    }

    const body = await req.json();
    const { 
      id, 
      name, 
      slug, 
      genre, 
      status, 
      releaseDate, 
      platforms, 
      description, 
      dimension,
      engineVersion,
      pcExeUrl,
      pcFileSize,
      mobileApkUrl,
      mobileFileSize,
      bannerUrl,
      logoUrl,
      requirements,
      isPublished 
    } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: "Game name is required" }, { status: 400 });
    }

    const safeSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const customFeaturesJson = JSON.stringify({
      dimension: dimension || "3D",
      engineVersion: engineVersion || (dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine"),
      pcExeUrl: pcExeUrl || "",
      pcFileSize: pcFileSize || "500 MB",
      mobileApkUrl: mobileApkUrl || "",
      mobileFileSize: mobileFileSize || "120 MB",
    });

    const engineName = dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine";

    const game = await prisma.gameContent.upsert({
      where: { slug: safeSlug },
      update: {
        name,
        genre: genre || "3D Action RPG",
        status: status || "Live Released",
        releaseDate: releaseDate || "2026",
        developer: "Dragon Studios",
        publisher: "Dragon Interactive",
        engine: engineName,
        platforms: platforms || "PC (.exe), Android (.apk)",
        description: description || "Original game created by Dragon Studios.",
        bannerUrl: bannerUrl || null,
        logoUrl: logoUrl || null,
        features: customFeaturesJson,
        requirements: requirements || "PC: Windows 10/11 64-bit, 8GB RAM, GTX 1060+ | Mobile: Android 10+, 4GB RAM",
        isPublished: isPublished ?? true,
      },
      create: {
        name,
        slug: safeSlug,
        genre: genre || "3D Action RPG",
        status: status || "Live Released",
        releaseDate: releaseDate || "2026",
        developer: "Dragon Studios",
        publisher: "Dragon Interactive",
        engine: engineName,
        platforms: platforms || "PC (.exe), Android (.apk)",
        description: description || "Original game created by Dragon Studios.",
        bannerUrl: bannerUrl || null,
        logoUrl: logoUrl || null,
        features: customFeaturesJson,
        requirements: requirements || "PC: Windows 10/11 64-bit, 8GB RAM, GTX 1060+ | Mobile: Android 10+, 4GB RAM",
        isPublished: isPublished ?? true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: id ? "UPDATE_GAME" : "INSERT_GAME",
        resource: "GAMES_CATALOG",
        details: `Inserted Game into Website: ${game.name} (${dimension || "3D"}) with PC .exe & Mobile .apk by ${auth.user.email}`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({ success: true, game });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (!can(auth.user, "games.manage") && !can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires games.manage permission." }, { status: 403 });
    }

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
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "DELETE_GAME",
          resource: "GAMES_CATALOG",
          details: `Deleted Game: ${game.name} (${game.slug}) by ${auth.user.email}`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));
    }

    return NextResponse.json({ success: true, message: "Game title deleted successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
