import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { hashPassword, invalidateAllUserSessions } from "@/lib/auth/auth";
import { requireAuthenticatedUser, recordSecurityAudit } from "@/lib/auth/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuthenticatedUser();
    if (!authResult.authorized) {
      return authResult.response;
    }

    const { user: actor } = authResult.context;
    const body = await req.json();
    const { newPassword } = body;

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: actor.id },
      data: { password: hashedPassword },
    });

    await recordSecurityAudit({
      userId: actor.id,
      userEmail: actor.email,
      action: "PERSONAL_PASSWORD_UPDATED",
      resource: "USER_SECURITY",
      details: `Owner/Staff user ${actor.email} successfully set their custom personal password.`,
      severity: "MEDIUM",
    });

    return NextResponse.json({
      success: true,
      message: "Personal password has been updated securely in the database.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
