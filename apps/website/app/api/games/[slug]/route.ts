import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const game = await prisma.gameContent.findFirst({
      where: {
        OR: [
          { slug },
          { id: slug },
        ],
        isPublished: true,
      },
      include: {
        releases: {
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
        },
        mediaList: true,
        gameFeatures: true,
        platformList: true,
      },
    });

    if (!game) {
      return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 });
    }

    let customData: any = {};
    try {
      if (game.features && game.features.startsWith("{")) {
        customData = JSON.parse(game.features);
      }
    } catch {}

    let parsedScreenshots: string[] = [];
    try {
      if (game.screenshots && game.screenshots.startsWith("[")) {
        parsedScreenshots = JSON.parse(game.screenshots);
      }
    } catch {}

    let parsedFocal: { x: number; y: number } = { x: 0.5, y: 0.5 };
    try {
      if (game.presentationMode === "MANUAL" && game.manualFocalPoint) {
        parsedFocal = JSON.parse(game.manualFocalPoint);
      } else if (game.aiFocalPoint) {
        parsedFocal = JSON.parse(game.aiFocalPoint);
      }
    } catch {}

    const effectiveDesktopPos = game.presentationMode === "MANUAL" && game.manualDesktopPosition
      ? game.manualDesktopPosition
      : (game.aiDesktopPosition || "50% 50%");

    const effectiveMobilePos = game.presentationMode === "MANUAL" && game.manualMobilePosition
      ? game.manualMobilePosition
      : (game.aiMobilePosition || "50% 50%");

    const effectiveCardPos = game.presentationMode === "MANUAL" && game.manualCardPosition
      ? game.manualCardPosition
      : (game.aiCardPosition || "50% 50%");

    const windowsRelease = game.releases.find((r) => r.platform === "WINDOWS");
    const androidRelease = game.releases.find((r) => r.platform === "ANDROID");

    return NextResponse.json({
      success: true,
      game: {
        id: game.id,
        slug: game.slug,
        title: game.name,
        name: game.name,
        subtitle: game.subtitle || (customData.dimension === "2D" ? "2D Dragon Game" : "3D Action RPG"),
        genre: game.genre,
        status: game.status,
        year: game.releaseDate || "2026",
        developer: game.developer,
        publisher: game.publisher,
        engine: game.engine,
        dimension: customData.dimension || "3D",
        engineVersion: customData.engineVersion || game.engine,
        description: game.description,
        fullDescription: game.fullDescription,
        bannerUrl: game.bannerUrl,
        cardBannerUrl: game.cardBannerUrl,
        logoUrl: game.logoUrl,
        heroVideoUrl: game.heroVideoUrl,
        screenshots: parsedScreenshots,
        requirements: game.requirements,
        platforms: game.platforms,
        isFeatured: game.isFeatured,
        presentationMode: game.presentationMode,
        focalPoint: parsedFocal,
        effectiveDesktopPosition: effectiveDesktopPos,
        effectiveMobilePosition: effectiveMobilePos,
        effectiveCardPosition: effectiveCardPos,
        zoomLevel: game.zoomLevel,
        overlayIntensity: game.overlayIntensity,
        textPlacement: game.textPlacement,
        hasWindowsRelease: !!windowsRelease,
        hasAndroidRelease: !!androidRelease,
        windowsVersion: windowsRelease ? `v${windowsRelease.version}` : null,
        androidVersion: androidRelease ? `v${androidRelease.version}` : null,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error fetching game details";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
