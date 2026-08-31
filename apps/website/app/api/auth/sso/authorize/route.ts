import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { generateSsoAuthorizationCode } from "@/lib/sso";
import { parseProfileMetadata, generateCanonicalDragonId } from "@/lib/user-profile";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("client_id") || "dragon_web_games";
  const redirectUri = searchParams.get("redirect_uri") || "http://localhost:3001/api/auth/callback";
  const state = searchParams.get("state") || "";
  const codeChallenge = searchParams.get("code_challenge") || "";
  const nonce = searchParams.get("nonce") || "";

  // Authenticate user via dragon_session or NextAuth
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

  // If not logged in, redirect to login page with return parameter
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

  const code = generateSsoAuthorizationCode({
    userId: targetUser.id,
    dragonId,
    gamerTag: meta.gamerTag || "Player",
    displayName: targetUser.name || meta.gamerTag || "Dragon Player",
    avatarUrl: targetUser.image || targetUser.avatar || meta.avatarId,
    bannerUrl: meta.bannerUrl,
    email: targetUser.email,
    role: targetUser.role || "PLAYER",
    redirectUri,
    codeChallenge,
    nonce,
  });

  const callbackUrl = new URL(redirectUri);
  callbackUrl.searchParams.set("code", code);
  if (state) callbackUrl.searchParams.set("state", state);

  return NextResponse.redirect(callbackUrl);
}
