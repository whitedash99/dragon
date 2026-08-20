import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("dragon_session")?.value;
    if (sessionToken) {
      await prisma.session.deleteMany({
        where: { sessionToken },
      }).catch(() => {});
    }

    const res = NextResponse.json({ success: true, message: "Logged out successfully" });
    res.cookies.set("dragon_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Logout error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
