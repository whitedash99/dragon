import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";
import { triggerWebsiteRevalidation } from "@/lib/sync/revalidate-website";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const overallStart = Date.now();
  try {
    const { id } = await params;
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (!can(auth.user, "games.manage") && !can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires games.manage permission." }, { status: 403 });
    }

    const game = await prisma.gameContent.findUnique({ where: { id } });
    if (!game) {
      return NextResponse.json({ success: false, error: "Game not found." }, { status: 404 });
    }

    if (!game.publishedSnapshot) {
      return NextResponse.json({ success: false, error: "No previous version snapshot available for rollback." }, { status: 400 });
    }

    const snapshot = game.publishedSnapshot as any;

    const dbStart = Date.now();

    const restoredGame = await prisma.gameContent.update({
      where: { id },
      data: {
        name: snapshot.name || game.name,
        subtitle: snapshot.subtitle || null,
        genre: snapshot.genre || game.genre,
        status: snapshot.status || game.status,
        releaseDate: snapshot.releaseDate || game.releaseDate,
        developer: snapshot.developer || game.developer,
        publisher: snapshot.publisher || game.publisher,
        engine: snapshot.engine || game.engine,
        platforms: snapshot.platforms || game.platforms,
        description: snapshot.description || game.description,
        fullDescription: snapshot.fullDescription || null,
        bannerUrl: snapshot.bannerUrl || null,
        cardBannerUrl: snapshot.cardBannerUrl || null,
        logoUrl: snapshot.logoUrl || null,
        features: snapshot.features || game.features,
        requirements: snapshot.requirements || game.requirements,
        isPublished: snapshot.isPublished !== undefined ? snapshot.isPublished : game.isPublished,
        isFeatured: snapshot.isFeatured !== undefined ? snapshot.isFeatured : game.isFeatured,
        presentationMode: snapshot.presentationMode || "AUTO",
        manualFocalPoint: snapshot.manualFocalPoint || null,
        manualDesktopPosition: snapshot.manualDesktopPosition || null,
        manualMobilePosition: snapshot.manualMobilePosition || null,
        zoomLevel: snapshot.zoomLevel !== undefined ? snapshot.zoomLevel : 1.0,
        overlayIntensity: snapshot.overlayIntensity !== undefined ? snapshot.overlayIntensity : 0.4,
        textPlacement: snapshot.textPlacement || "bottom-left",
      },
    });

    const dbDurationMs = Date.now() - dbStart;

    // Trigger website revalidation
    const revalResult = await triggerWebsiteRevalidation({
      tags: [`game-${restoredGame.slug}`, "games-list", "featured-games"],
      paths: ["/games", `/games/${restoredGame.slug}`, "/"],
    });

    const totalDurationMs = Date.now() - overallStart;

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "ROLLBACK_GAME",
        resource: "GAMES_CONTROL_PLANE",
        details: JSON.stringify({
          gameId: restoredGame.id,
          name: restoredGame.name,
          slug: restoredGame.slug,
          rolledBackTo: snapshot.snapshotSavedAt,
          dbMs: dbDurationMs,
          cacheMs: revalResult.durationMs,
          totalMs: totalDurationMs,
        }),
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({
      success: true,
      game: restoredGame,
      telemetry: {
        dbMs: dbDurationMs,
        cacheMs: revalResult.durationMs,
        totalMs: totalDurationMs,
        revalidated: revalResult.success,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Rollback error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
