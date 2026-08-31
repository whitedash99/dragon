import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { generateSsoAuthorizationCode, getDragonWebGamesBaseUrl } from "@/lib/sso";
import { parseProfileMetadata, generateCanonicalDragonId } from "@/lib/user-profile";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetGame = searchParams.get("game") || "";
  const webGamesBase = getDragonWebGamesBaseUrl();
  const returnTo = targetGame ? `/play/${targetGame}` : "/dashboard";

  // Authenticate user
  let targetUser: any = null;
  const sessionToken = req.cookies.get("dragon_session")?.value;
  if (sessionToken) {
    const s = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: { include: { profile: true } } },
    });
    if (s && s.user) targetUser = s.user;
  }

  if (!targetUser) {
    const authSession = await getServerSession(authOptions).catch(() => null);
    if (authSession?.user?.email) {
      targetUser = await prisma.user.findUnique({
        where: { email: authSession.user.email.toLowerCase().trim() },
        include: { profile: true },
      });
    }
  }

  if (!targetUser) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("returnTo", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const meta = parseProfileMetadata(targetUser.profile?.notificationSettings, targetUser.name);
  let dragonId = targetUser.dragonId;
  if (!dragonId) {
    dragonId = generateCanonicalDragonId();
    await prisma.user.update({
      where: { id: targetUser.id },
      data: { dragonId },
    }).catch(() => {});
  }

  // Redirect directly through Dragon Web Games auth login to trigger PKCE exchange,
  // or construct direct sandbox code for instant dev access
  const redirectTarget = `${webGamesBase}/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
  return NextResponse.redirect(redirectTarget);
}
