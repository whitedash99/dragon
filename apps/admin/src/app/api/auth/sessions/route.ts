import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const action = searchParams.get("action");

    if (action === "revoke_all") {
      const currentToken = req.cookies.get("dragon_admin_session")?.value;
      await prisma.session.deleteMany({
        where: {
          userId: auth.user.id,
          sessionToken: currentToken ? { not: currentToken } : undefined,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "REVOKE_ALL_SESSIONS",
          resource: "AUTH_SESSION",
          details: `User logged out all other active device sessions`,
        },
      });

      return NextResponse.json({ success: true, message: "Logged out from all other devices." });
    }

    if (sessionId) {
      await prisma.session.delete({
        where: { id: sessionId },
      }).catch(() => null);

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "REVOKE_SESSION",
          resource: "AUTH_SESSION",
          details: `Revoked session ${sessionId}`,
        },
      });

      return NextResponse.json({ success: true, message: "Session revoked." });
    }

    return NextResponse.json({ success: false, error: "Session ID or action required." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
