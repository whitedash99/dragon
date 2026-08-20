import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireAuthenticatedUser, recordSecurityAudit } from "@/lib/auth/security";

export async function GET() {
  try {
    const authResult = await requireAuthenticatedUser();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { user } = authResult.context;

    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    return NextResponse.json({ success: true, sessions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireAuthenticatedUser();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { user, session: currentSession } = authResult.context;
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const action = searchParams.get("action");

    if (action === "revoke_all") {
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
          sessionToken: { not: currentSession.sessionToken },
        },
      });

      await recordSecurityAudit({
        userId: user.id,
        userEmail: user.email,
        action: "ALL_SESSIONS_REVOKED",
        resource: "AUTH_SESSION",
        details: `User revoked all other active sessions except current`,
        severity: "LOW",
      });

      return NextResponse.json({ success: true, message: "Logged out from all other devices successfully." });
    }

    if (sessionId) {
      const targetSession = await prisma.session.findUnique({
        where: { id: sessionId },
      });

      if (!targetSession || targetSession.userId !== user.id) {
        return NextResponse.json({ success: false, error: "Session not found or permission denied." }, { status: 404 });
      }

      await prisma.session.delete({ where: { id: sessionId } });

      await recordSecurityAudit({
        userId: user.id,
        userEmail: user.email,
        action: "SESSION_REVOKED",
        resource: "AUTH_SESSION",
        details: `User revoked active session ${sessionId}`,
        severity: "LOW",
      });

      return NextResponse.json({ success: true, message: "Session revoked successfully." });
    }

    return NextResponse.json({ success: false, error: "Session ID or action required." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
