import { NextRequest, NextResponse } from "next/server";
import { verifySsoAuthorizationCode } from "@/lib/sso";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    let grantType = "";
    let code = "";
    let codeVerifier = "";
    let clientId = "";
    let redirectUri = "";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      grantType = params.get("grant_type") || "";
      code = params.get("code") || "";
      codeVerifier = params.get("code_verifier") || "";
      clientId = params.get("client_id") || "";
      redirectUri = params.get("redirect_uri") || "";
    } else {
      const json = await req.json().catch(() => ({}));
      grantType = json.grant_type || "";
      code = json.code || "";
      codeVerifier = json.code_verifier || "";
      clientId = json.client_id || "";
      redirectUri = json.redirect_uri || "";
    }

    if (grantType !== "authorization_code") {
      return NextResponse.json(
        { error: "unsupported_grant_type", error_description: "Only authorization_code grant is supported" },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { error: "invalid_request", error_description: "Missing authorization code" },
        { status: 400 }
      );
    }

    const verification = verifySsoAuthorizationCode(code, codeVerifier);
    if (!verification.valid || !verification.payload) {
      return NextResponse.json(
        { error: "invalid_grant", error_description: verification.error || "Invalid or expired authorization code" },
        { status: 400 }
      );
    }

    const { userId, dragonId, gamerTag, displayName, email, role, avatarUrl, bannerUrl } = verification.payload;

    // Issue JWT / Access Token
    const accessToken = `drg_at_${Buffer.from(
      JSON.stringify({
        sub: dragonId || userId,
        userId,
        dragonId,
        gamerTag,
        displayName,
        email,
        role,
        avatarUrl,
        bannerUrl,
        exp: Date.now() + 24 * 60 * 60 * 1000,
      })
    ).toString("base64url")}`;

    const idToken = `drg_id_${Buffer.from(
      JSON.stringify({
        sub: dragonId || userId,
        handle: gamerTag,
        displayName,
        avatarUrl,
        bannerUrl,
        email,
        iss: "https://dragongamingstudios.vercel.app",
        aud: clientId || "dragon_web_games",
        exp: Math.floor(Date.now() / 1000) + 86400,
        iat: Math.floor(Date.now() / 1000),
      })
    ).toString("base64url")}`;

    return NextResponse.json({
      access_token: accessToken,
      id_token: idToken,
      token_type: "Bearer",
      expires_in: 86400,
      scope: "openid profile dragon_id",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: "server_error", error_description: msg }, { status: 500 });
  }
}
