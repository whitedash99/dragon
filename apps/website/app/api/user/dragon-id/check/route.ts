import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { validateDragonIdHandle, parseProfileMetadata } from "@/lib/user-profile";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const handle = searchParams.get("handle") || "";
    const cleanHandle = handle.replace(/^@/, "").trim();

    // 1. Format validation
    const validation = validateDragonIdHandle(cleanHandle);
    if (!validation.valid) {
      return NextResponse.json({
        available: false,
        reason: validation.error || "Invalid Dragon ID format",
      });
    }

    // 2. Identify current authenticated user (if any) to allow keeping their own handle
    let currentUserId: string | null = null;
    const sessionToken = req.cookies.get("dragon_session")?.value;
    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
      });
      if (session) currentUserId = session.userId;
    }

    if (!currentUserId) {
      const authSession = await getServerSession(authOptions).catch(() => null);
      if (authSession?.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: authSession.user.email.toLowerCase().trim() },
        });
        if (dbUser) currentUserId = dbUser.id;
      }
    }

    // 3. Query PostgreSQL for duplicate handles
    const profiles = await prisma.userProfile.findMany({
      where: {
        notificationSettings: {
          contains: `"gamerTag":"${cleanHandle}"`,
        },
      },
      select: {
        userId: true,
        notificationSettings: true,
      },
    });

    const isTakenByOther = profiles.some((p) => {
      if (currentUserId && p.userId === currentUserId) return false;
      const meta = parseProfileMetadata(p.notificationSettings);
      return meta.gamerTag.toLowerCase() === cleanHandle.toLowerCase();
    });

    if (isTakenByOther) {
      return NextResponse.json({
        available: false,
        reason: "Dragon ID is already registered by another player.",
      });
    }

    return NextResponse.json({
      available: true,
      handle: cleanHandle,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ available: false, reason: msg }, { status: 500 });
  }
}
