import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";
import { prisma } from "@/lib/database/prisma";
import { analyzeBannerImageWithGemini, computeAssetHash } from "@/lib/ai/banner-vision";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (!can(auth.user, "games.manage") && !can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires games.manage permission." }, { status: 403 });
    }

    const body = await req.json();
    const { imageUrl, gameId } = body;

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ success: false, error: "Valid imageUrl is required for vision analysis." }, { status: 400 });
    }

    const assetHash = computeAssetHash(imageUrl);

    // 1. Check if we already analyzed this exact asset hash for this or any game
    const existingAnalysis = await prisma.gameContent.findFirst({
      where: { assetHash },
      select: {
        aiAnalysisStatus: true,
        aiFocalPoint: true,
        aiDesktopPosition: true,
        aiMobilePosition: true,
        aiCardPosition: true,
        aiTextSafeArea: true,
        aiConfidence: true,
      },
    });

    let analysisData;
    let source: "CACHE_HIT" | "AI_GENERATED" | "FALLBACK" = "AI_GENERATED";

    if (existingAnalysis && existingAnalysis.aiFocalPoint) {
      try {
        const parsedFocal = JSON.parse(existingAnalysis.aiFocalPoint);
        analysisData = {
          focalPoint: parsedFocal,
          desktop: {
            objectPosition: existingAnalysis.aiDesktopPosition || "50% 50%",
            textSafeArea: (existingAnalysis.aiTextSafeArea as any) || "left",
          },
          tablet: {
            objectPosition: existingAnalysis.aiDesktopPosition || "50% 50%",
            textSafeArea: (existingAnalysis.aiTextSafeArea as any) || "left",
          },
          mobile: {
            objectPosition: existingAnalysis.aiMobilePosition || "50% 50%",
            textSafeArea: (existingAnalysis.aiTextSafeArea as any) || "top",
          },
          card: {
            objectPosition: existingAnalysis.aiCardPosition || "50% 50%",
          },
          primarySubject: "Cached AI Composition",
          contrastScore: 0.85,
          recommendedOverlay: 0.45,
          isHeroSuitable: true,
          confidence: existingAnalysis.aiConfidence || 0.95,
          assetHash,
        };
        source = "CACHE_HIT";
      } catch {
        // Fallback to fresh analysis
      }
    }

    if (!analysisData) {
      const visionResult = await analyzeBannerImageWithGemini(imageUrl, assetHash);
      analysisData = visionResult.data;
      source = visionResult.source;
    }

    // 2. If gameId provided, persist to database
    if (gameId) {
      await prisma.gameContent.update({
        where: { id: gameId },
        data: {
          assetHash,
          aiAnalysisStatus: source === "FALLBACK" ? "FALLBACK" : "COMPLETED",
          aiAnalyzedAt: new Date(),
          aiFocalPoint: JSON.stringify(analysisData.focalPoint),
          aiDesktopPosition: analysisData.desktop.objectPosition,
          aiMobilePosition: analysisData.mobile.objectPosition,
          aiCardPosition: analysisData.card.objectPosition,
          aiTextSafeArea: analysisData.desktop.textSafeArea,
          aiConfidence: analysisData.confidence,
        },
      });
    }

    const durationMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      analysis: analysisData,
      source,
      durationMs,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error during banner vision analysis";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
