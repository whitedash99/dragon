import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

// In-memory rate limiting map
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, limit = 15, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count++;
  return true;
}

async function getAuthenticatedUser(req: NextRequest) {
  const sessionToken = req.cookies.get("dragon_session")?.value;
  if (sessionToken) {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: { include: { profile: true } } },
      });
      if (session?.user) return session.user;
    } catch (e) {
      console.warn("[GameSession Auth] Cookie lookup warning:", e);
    }
  }

  const authSession = await getServerSession(authOptions).catch(() => null);
  if (authSession?.user?.email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: authSession.user.email.toLowerCase().trim() },
        include: { profile: true },
      });
      if (user) return user;
    } catch (e) {
      console.warn("[GameSession Auth] NextAuth lookup warning:", e);
    }
  }

  return null;
}

// POST /api/game-session/start — Start a Secure Authenticated Game Session
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

  // Rate limit check
  if (!checkRateLimit(`gs_${ip}`, 30, 60000)) {
    return NextResponse.json(
      { success: false, error: "RATE_LIMIT_EXCEEDED", message: "Too many game session requests. Please slow down." },
      { status: 429 }
    );
  }

  try {
    // 1. Verify authenticated user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHENTICATED",
          message: "Authentication required to start game session. Please sign in with your Dragon Account.",
        },
        { status: 401 }
      );
    }

    // 2. Verify valid Dragon ID
    if (!user.dragonId) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED_NO_DRAGON_ID",
          message: "A valid forged Dragon ID is required to launch game sessions. Please complete Dragon ID setup.",
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json().catch(() => ({}));
    const gameSlug = String(body.gameSlug || body.slug || "").trim();

    if (!gameSlug) {
      return NextResponse.json(
        { success: false, error: "INVALID_REQUEST", message: "gameSlug parameter is required." },
        { status: 400 }
      );
    }

    // 3. Verify valid game in database
    let game = null;
    try {
      game = await prisma.gameContent.findFirst({
        where: {
          OR: [{ slug: gameSlug }, { id: gameSlug }],
          isPublished: true,
        },
      });

      if (!game) {
        // Also check secondary Game model
        const fallbackGame = await prisma.game.findFirst({
          where: {
            OR: [{ slug: gameSlug }, { id: gameSlug }],
          },
        });
        if (fallbackGame) {
          game = {
            id: fallbackGame.id,
            name: fallbackGame.title,
            slug: fallbackGame.slug,
            genre: fallbackGame.genre,
            engine: "Dragon 3D Engine",
          } as any;
        }
      }
    } catch (dbErr: any) {
      console.error("[Game Lookup DB Error]:", dbErr?.message || dbErr);
      return NextResponse.json(
        { success: false, error: "DATABASE_UNAVAILABLE", message: "Dragon Core database is currently unreachable." },
        { status: 503 }
      );
    }

    if (!game) {
      return NextResponse.json(
        {
          success: false,
          error: "GAME_NOT_FOUND",
          message: `Game '${gameSlug}' is not registered or is currently unpublished.`,
        },
        { status: 404 }
      );
    }

    // 4. Create verified GameSession record
    const sessionToken = `dsess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const userAgent = req.headers.get("user-agent") || undefined;

    let gameSession = null;
    try {
      gameSession = await prisma.gameSession.create({
        data: {
          userId: user.id,
          dragonId: user.dragonId,
          gameSlug: game.slug,
          sessionToken,
          status: "ACTIVE",
          userAgent,
          ipAddress: ip,
          metadata: {
            gameTitle: game.name,
            genre: game.genre,
            startedAt: new Date().toISOString(),
          },
        },
      });
    } catch (sessionDbErr: any) {
      console.error("[GameSession Create DB Error]:", sessionDbErr?.message || sessionDbErr);
      return NextResponse.json(
        { success: false, error: "DATABASE_UNAVAILABLE", message: "Failed to persist active game session." },
        { status: 503 }
      );
    }

    // 5. Audit Log (non-fatal)
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userEmail: user.email,
        action: "GAME_SESSION_STARTED",
        resource: "GAME_CORE",
        details: `Player '${user.dragonId}' (${user.email}) initialized game session for '${game.name}' (${game.slug})`,
        ipAddress: ip,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      sessionToken: gameSession.sessionToken,
      session: {
        id: gameSession.id,
        gameSlug: gameSession.gameSlug,
        gameTitle: game.name,
        dragonId: user.dragonId,
        playerName: user.name || "Dragon Operative",
        status: "ACTIVE",
        startedAt: gameSession.startedAt,
        token: gameSession.sessionToken,
      },
    });

  } catch (error: any) {
    console.error("[Game Session Start Fatal Error]:", error);
    return NextResponse.json(
      { success: false, error: "INTERNAL_ERROR", message: "Failed to initialize game session." },
      { status: 500 }
    );
  }
}
