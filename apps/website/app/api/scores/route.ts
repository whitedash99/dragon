import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getAuthenticatedUser(req: NextRequest) {
  const sessionToken = req.cookies.get("dragon_session")?.value;
  if (sessionToken) {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (session?.user) return session.user;
    } catch (e) {
      console.warn("[Scores Auth] Cookie lookup warning:", e);
    }
  }

  const authSession = await getServerSession(authOptions).catch(() => null);
  if (authSession?.user?.email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: authSession.user.email.toLowerCase().trim() },
      });
      if (user) return user;
    } catch (e) {
      console.warn("[Scores Auth] NextAuth lookup warning:", e);
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameSlug = searchParams.get("gameSlug") || undefined;
    const dragonId = searchParams.get("dragonId") || undefined;
    const rawLimit = parseInt(searchParams.get("limit") || "20", 10);
    const limit = isNaN(rawLimit) ? 20 : Math.min(Math.max(rawLimit, 1), 100);

    const where: any = {};
    if (gameSlug) where.gameSlug = gameSlug;
    if (dragonId) where.dragonId = dragonId;

    const scores = await prisma.score.findMany({
      where,
      orderBy: { score: "desc" },
      take: limit,
      select: {
        id: true,
        dragonId: true,
        playerName: true,
        gameSlug: true,
        score: true,
        level: true,
        rank: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: scores.length,
      scores,
    });
  } catch (error: any) {
    console.error("[Scores API Error]:", error?.message || error);
    return NextResponse.json(
      {
        success: false,
        error: "DATABASE TEMPORARILY UNAVAILABLE",
        message: "Dragon Core telemetry database is currently unreachable. Please try again shortly.",
      },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to submit score." },
        { status: 401 }
      );
    }

    if (!user.dragonId) {
      return NextResponse.json(
        { success: false, error: "Active Dragon ID required to submit score." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { gameSlug, score, level, metadata } = body;

    if (!gameSlug || typeof score !== "number" || score < 0) {
      return NextResponse.json(
        { success: false, error: "Valid gameSlug and non-negative score are required." },
        { status: 400 }
      );
    }

    let rank = "Dragon Operative";
    if (score >= 100000) rank = "Dragon Apex Grandmaster";
    else if (score >= 50000) rank = "Mythic Dragon Slayer";
    else if (score >= 20000) rank = "Veteran Raider";
    else if (score >= 5000) rank = "Elite Specialist";

    const savedScore = await prisma.score.create({
      data: {
        userId: user.id,
        dragonId: user.dragonId,
        playerName: user.name || "Dragon Operative",
        gameSlug,
        score: Math.floor(score),
        level: typeof level === "number" ? Math.max(1, Math.floor(level)) : 1,
        rank,
        metadata: metadata ? metadata : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      score: savedScore,
    });
  } catch (error: any) {
    console.error("[Score Submit Error]:", error?.message || error);
    return NextResponse.json(
      {
        success: false,
        error: "DATABASE TEMPORARILY UNAVAILABLE",
        message: "Failed to persist score to Dragon Core database.",
      },
      { status: 503 }
    );
  }
}
