import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";
import { triggerWebsiteRevalidation } from "@/lib/sync/revalidate-website";
import { analyzeBannerImageWithGemini, computeAssetHash } from "@/lib/ai/banner-vision";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q");

    const games = await prisma.gameContent.findMany({
      orderBy: [{ isFeatured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }],
      include: {
        mediaList: true,
        gameFeatures: true,
        platformList: true,
        patchNotes: true,
        dlcList: true,
        releases: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            releases: true,
            downloadLogs: true,
          },
        },
      },
    });

    const parsedGames = games.map((g) => {
      let customData: any = {};
      try {
        if (g.features && g.features.startsWith("{")) {
          customData = JSON.parse(g.features);
        }
      } catch {}

      let parsedScreenshots: string[] = [];
      try {
        if (g.screenshots && g.screenshots.startsWith("[")) {
          parsedScreenshots = JSON.parse(g.screenshots);
        }
      } catch {}

      let parsedFocal: { x: number; y: number } = { x: 0.5, y: 0.5 };
      try {
        if (g.manualFocalPoint && g.presentationMode === "MANUAL") {
          parsedFocal = JSON.parse(g.manualFocalPoint);
        } else if (g.aiFocalPoint) {
          parsedFocal = JSON.parse(g.aiFocalPoint);
        }
      } catch {}

      const latestRelease = g.releases[0] || null;
      const totalDownloads = g.releases.reduce((sum, r) => sum + (r.downloadCount || 0), 0) + (g._count?.downloadLogs || 0);
      const hasPublishedRelease = g.releases.some((r) => r.isPublished);

      return {
        ...g,
        dimension: customData.dimension || "3D",
        engineVersion: customData.engineVersion || (customData.dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine"),
        pcExeUrl: customData.pcExeUrl || "",
        pcFileSize: customData.pcFileSize || "500 MB",
        mobileApkUrl: customData.mobileApkUrl || "",
        mobileFileSize: customData.mobileFileSize || "120 MB",
        screenshots: parsedScreenshots,
        focalPoint: parsedFocal,
        effectiveDesktopPosition: g.presentationMode === "MANUAL" && g.manualDesktopPosition ? g.manualDesktopPosition : (g.aiDesktopPosition || "50% 50%"),
        effectiveMobilePosition: g.presentationMode === "MANUAL" && g.manualMobilePosition ? g.manualMobilePosition : (g.aiMobilePosition || "50% 50%"),
        effectiveCardPosition: g.presentationMode === "MANUAL" && g.manualCardPosition ? g.manualCardPosition : (g.aiCardPosition || "50% 50%"),
        latestVersion: latestRelease ? latestRelease.version : null,
        latestReleaseStatus: latestRelease ? latestRelease.status : null,
        latestReleasePlatform: latestRelease ? latestRelease.platform : null,
        latestReleaseDate: latestRelease ? latestRelease.createdAt : null,
        releasesCount: g.releases.length,
        totalDownloads,
        hasPublishedRelease,
      };
    });

    const filtered = parsedGames.filter((g) => {
      const matchesSearch = !q || (
        g.name.toLowerCase().includes(q.toLowerCase()) ||
        g.slug.toLowerCase().includes(q.toLowerCase()) ||
        g.genre.toLowerCase().includes(q.toLowerCase()) ||
        g.platforms.toLowerCase().includes(q.toLowerCase())
      );
      const matchesStatus = !status || status === "All" || (
        status === "Published" ? g.isPublished :
        status === "Draft" ? !g.isPublished :
        status === "Featured" ? g.isFeatured :
        status === "Archived" ? g.status === "Archived" :
        g.status === status
      );
      return matchesSearch && matchesStatus;
    });

    const totalGames = parsedGames.length;
    const publishedGames = parsedGames.filter((g) => g.isPublished).length;
    const draftGames = parsedGames.filter((g) => !g.isPublished).length;
    const totalDownloads = parsedGames.reduce((acc, g) => acc + (g.totalDownloads || 0), 0);
    const games3dCount = parsedGames.filter((g) => g.dimension === "3D").length;
    const games2dCount = parsedGames.filter((g) => g.dimension === "2D").length;

    return NextResponse.json({
      success: true,
      games: filtered,
      telemetry: {
        totalGames,
        publishedGames,
        draftGames,
        totalDownloads,
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
  const overallStart = Date.now();
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
      subtitle,
      genre, 
      status, 
      releaseDate, 
      developer,
      publisher,
      platforms, 
      description,
      fullDescription, 
      dimension,
      engineVersion,
      pcExeUrl,
      pcFileSize,
      mobileApkUrl,
      mobileFileSize,
      bannerUrl,
      cardBannerUrl,
      logoUrl,
      heroVideoUrl,
      screenshots,
      requirements,
      isPublished,
      isFeatured,
      featuredOrder,
      // Visual Intelligence & Presentation Controls
      aiAnalysisStatus,
      aiFocalPoint,
      aiDesktopPosition,
      aiMobilePosition,
      aiCardPosition,
      aiTextSafeArea,
      aiConfidence,
      manualFocalPoint,
      manualDesktopPosition,
      manualMobilePosition,
      manualCardPosition,
      presentationMode,
      zoomLevel,
      overlayIntensity,
      textPlacement,
    } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Game name is required." }, { status: 400 });
    }

    const safeSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    // 1. Fetch previous state to save snapshot for rollback
    const existingGame = id 
      ? await prisma.gameContent.findUnique({ where: { id } })
      : await prisma.gameContent.findUnique({ where: { slug: safeSlug } });

    let previousSnapshot = null;
    if (existingGame) {
      previousSnapshot = {
        id: existingGame.id,
        slug: existingGame.slug,
        name: existingGame.name,
        subtitle: existingGame.subtitle,
        genre: existingGame.genre,
        status: existingGame.status,
        releaseDate: existingGame.releaseDate,
        developer: existingGame.developer,
        publisher: existingGame.publisher,
        engine: existingGame.engine,
        platforms: existingGame.platforms,
        description: existingGame.description,
        fullDescription: existingGame.fullDescription,
        bannerUrl: existingGame.bannerUrl,
        cardBannerUrl: existingGame.cardBannerUrl,
        logoUrl: existingGame.logoUrl,
        features: existingGame.features,
        requirements: existingGame.requirements,
        isPublished: existingGame.isPublished,
        isFeatured: existingGame.isFeatured,
        presentationMode: existingGame.presentationMode,
        manualFocalPoint: existingGame.manualFocalPoint,
        manualDesktopPosition: existingGame.manualDesktopPosition,
        manualMobilePosition: existingGame.manualMobilePosition,
        zoomLevel: existingGame.zoomLevel,
        overlayIntensity: existingGame.overlayIntensity,
        textPlacement: existingGame.textPlacement,
        snapshotSavedAt: new Date().toISOString(),
        snapshotSavedBy: auth.user.email,
      };
    }

    const customFeaturesJson = JSON.stringify({
      dimension: dimension || "3D",
      engineVersion: engineVersion || (dimension === "2D" ? "Dragon 2D Engine" : "Dragon 3D Engine"),
      pcExeUrl: pcExeUrl || "",
      pcFileSize: pcFileSize || "500 MB",
      mobileApkUrl: mobileApkUrl || "",
      mobileFileSize: mobileFileSize || "120 MB",
    });

    const engineName = dimension === "2D" ? (engineVersion || "Dragon 2D Engine") : (engineVersion || "Dragon 3D Engine");

    const assetHash = bannerUrl ? computeAssetHash(bannerUrl) : undefined;

    const dbStart = Date.now();

    // 2. Perform DB Upsert
    const game = await prisma.gameContent.upsert({
      where: { slug: safeSlug },
      update: {
        name,
        subtitle: subtitle || null,
        genre: genre || "3D Action RPG",
        status: status || "Live Released",
        releaseDate: releaseDate || "2026",
        developer: developer || "Dragon Studios",
        publisher: publisher || "Dragon Interactive",
        engine: engineName,
        platforms: platforms || "PC (.exe), Android (.apk)",
        description: description || "Original game created by Dragon Studios.",
        fullDescription: fullDescription || null,
        bannerUrl: bannerUrl || null,
        cardBannerUrl: cardBannerUrl || null,
        logoUrl: logoUrl || null,
        heroVideoUrl: heroVideoUrl || null,
        screenshots: Array.isArray(screenshots) ? JSON.stringify(screenshots) : (typeof screenshots === "string" ? screenshots : "[]"),
        features: customFeaturesJson,
        requirements: requirements || "PC: Windows 10/11 64-bit, 8GB RAM, GTX 1060+ | Mobile: Android 10+, 4GB RAM",
        isPublished: isPublished !== undefined ? isPublished : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        featuredOrder: featuredOrder !== undefined ? featuredOrder : 0,
        assetHash: assetHash || undefined,
        aiAnalysisStatus: aiAnalysisStatus || undefined,
        aiFocalPoint: typeof aiFocalPoint === "object" ? JSON.stringify(aiFocalPoint) : aiFocalPoint,
        aiDesktopPosition: aiDesktopPosition || undefined,
        aiMobilePosition: aiMobilePosition || undefined,
        aiCardPosition: aiCardPosition || undefined,
        aiTextSafeArea: aiTextSafeArea || undefined,
        aiConfidence: aiConfidence !== undefined ? aiConfidence : undefined,
        manualFocalPoint: typeof manualFocalPoint === "object" ? JSON.stringify(manualFocalPoint) : manualFocalPoint,
        manualDesktopPosition: manualDesktopPosition || undefined,
        manualMobilePosition: manualMobilePosition || undefined,
        manualCardPosition: manualCardPosition || undefined,
        presentationMode: presentationMode || "AUTO",
        zoomLevel: zoomLevel !== undefined ? zoomLevel : 1.0,
        overlayIntensity: overlayIntensity !== undefined ? overlayIntensity : 0.4,
        textPlacement: textPlacement || "bottom-left",
        publishedSnapshot: previousSnapshot || undefined,
      },
      create: {
        name,
        slug: safeSlug,
        subtitle: subtitle || null,
        genre: genre || "3D Action RPG",
        status: status || "Live Released",
        releaseDate: releaseDate || "2026",
        developer: developer || "Dragon Studios",
        publisher: publisher || "Dragon Interactive",
        engine: engineName,
        platforms: platforms || "PC (.exe), Android (.apk)",
        description: description || "Original game created by Dragon Studios.",
        fullDescription: fullDescription || null,
        bannerUrl: bannerUrl || null,
        cardBannerUrl: cardBannerUrl || null,
        logoUrl: logoUrl || null,
        heroVideoUrl: heroVideoUrl || null,
        screenshots: Array.isArray(screenshots) ? JSON.stringify(screenshots) : (typeof screenshots === "string" ? screenshots : "[]"),
        features: customFeaturesJson,
        requirements: requirements || "PC: Windows 10/11 64-bit, 8GB RAM, GTX 1060+ | Mobile: Android 10+, 4GB RAM",
        isPublished: isPublished !== undefined ? isPublished : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        featuredOrder: featuredOrder !== undefined ? featuredOrder : 0,
        assetHash: assetHash || undefined,
        aiAnalysisStatus: aiAnalysisStatus || "PENDING",
        aiFocalPoint: typeof aiFocalPoint === "object" ? JSON.stringify(aiFocalPoint) : aiFocalPoint,
        aiDesktopPosition: aiDesktopPosition || "50% 50%",
        aiMobilePosition: aiMobilePosition || "50% 50%",
        aiCardPosition: aiCardPosition || "50% 50%",
        aiTextSafeArea: aiTextSafeArea || "left",
        aiConfidence: aiConfidence !== undefined ? aiConfidence : 1.0,
        manualFocalPoint: typeof manualFocalPoint === "object" ? JSON.stringify(manualFocalPoint) : manualFocalPoint,
        manualDesktopPosition: manualDesktopPosition || undefined,
        manualMobilePosition: manualMobilePosition || undefined,
        manualCardPosition: manualCardPosition || undefined,
        presentationMode: presentationMode || "AUTO",
        zoomLevel: zoomLevel !== undefined ? zoomLevel : 1.0,
        overlayIntensity: overlayIntensity !== undefined ? overlayIntensity : 0.4,
        textPlacement: textPlacement || "bottom-left",
      },
    });

    const dbDurationMs = Date.now() - dbStart;

    // 3. Trigger targeted cache invalidation on the public website
    const revalResult = await triggerWebsiteRevalidation({
      tags: [`game-${safeSlug}`, "games-list", "featured-games"],
      paths: ["/games", `/games/${safeSlug}`, "/"],
    });

    const totalDurationMs = Date.now() - overallStart;

    // 4. Structured Audit Log
    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: id ? "UPDATE_GAME" : "CREATE_GAME",
        resource: "GAMES_CONTROL_PLANE",
        details: JSON.stringify({
          gameId: game.id,
          name: game.name,
          slug: game.slug,
          isPublished: game.isPublished,
          isFeatured: game.isFeatured,
          presentationMode: game.presentationMode,
          dbMs: dbDurationMs,
          cacheMs: revalResult.durationMs,
          totalMs: totalDurationMs,
          revalidated: revalResult.success,
        }),
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({
      success: true,
      game,
      telemetry: {
        dbMs: dbDurationMs,
        cacheMs: revalResult.durationMs,
        totalMs: totalDurationMs,
        revalidated: revalResult.success,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const overallStart = Date.now();
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

      // Invalidate website cache for deleted game
      await triggerWebsiteRevalidation({
        tags: [`game-${game.slug}`, "games-list", "featured-games"],
        paths: ["/games", `/games/${game.slug}`, "/"],
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "DELETE_GAME",
          resource: "GAMES_CONTROL_PLANE",
          details: `Deleted Game: ${game.name} (${game.slug}) by ${auth.user.email}`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));
    }

    return NextResponse.json({
      success: true,
      message: "Game title deleted and website cache purged successfully.",
      durationMs: Date.now() - overallStart,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
