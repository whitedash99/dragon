import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("dragon_session")?.value;
    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      }).catch(() => null);

      if (session) {
        await prisma.auditLog.create({
          data: {
            userId: session.userId,
            userEmail: session.user?.email,
            action: "AUTH_LOGOUT",
            resource: "AUTHENTICATION",
            details: `User ${session.user?.email} logged out. Session revoked. Account & Dragon ID preserved.`,
          },
        }).catch(() => {});

        await prisma.session.deleteMany({
          where: { sessionToken },
        }).catch(() => {});
      }
    }

    const res = NextResponse.json({
      success: true,
      message: "Dragon session terminated. Account safely stored.",
    });
    
    const cookieNames = [
      "dragon_session",
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "__Host-next-auth.csrf-token",
      "next-auth.callback-url",
      "__Secure-next-auth.callback-url",
      "dragon_pending_email",
    ];

    for (const name of cookieNames) {
      res.cookies.set(name, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0),
        path: "/",
      });
    }

    return res;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Logout error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
