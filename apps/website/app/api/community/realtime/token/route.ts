import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTokenRequest, getAblyApiKey } from "@/lib/realtime";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || `guest_${Math.random().toString(36).substring(2, 9)}`;
    const apiKey = getAblyApiKey();

    if (!apiKey) {
      return NextResponse.json({
        enabled: false,
        mode: "local-poll",
        clientId: userId,
        message: "Realtime API key not configured. Using high-performance optimistic local transport.",
      });
    }

    const tokenRequest = await createTokenRequest(userId, {
      "community:*": ["*"],
    });

    return NextResponse.json({
      enabled: true,
      mode: "ably",
      tokenRequest,
    });
  } catch (error: any) {
    console.error("[Realtime Token Error]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate realtime token." },
      { status: 500 }
    );
  }
}
