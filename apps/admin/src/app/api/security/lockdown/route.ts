import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export async function GET() {
  try {
    const state = await prisma.systemSecurityState.findUnique({
      where: { id: "SYSTEM_SECURITY_SINGLETON" },
    });

    return NextResponse.json({
      success: true,
      lockdownMode: state?.lockdownMode || false,
      readOnlyMode: state?.readOnlyMode || false,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !["FOUNDER", "BREAK_GLASS", "OWNER"].includes(auth.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Lockdown mode requires Founder or Break Glass privileges." }, { status: 403 });
    }

    const body = await req.json();
    const { enableLockdown } = body;

    const targetState = !!enableLockdown;

    // 1. Update System Security State
    const state = await prisma.systemSecurityState.upsert({
      where: { id: "SYSTEM_SECURITY_SINGLETON" },
      update: {
        lockdownMode: targetState,
        readOnlyMode: targetState,
        updatedById: auth.user.id,
        updatedAt: new Date(),
      },
      create: {
        id: "SYSTEM_SECURITY_SINGLETON",
        lockdownMode: targetState,
        readOnlyMode: targetState,
        updatedById: auth.user.id,
      },
    });

    // 2. If enabling Lockdown: Revoke all active sessions except Founder's current session
    if (targetState) {
      const currentToken = req.cookies.get("dragon_admin_session")?.value;
      await prisma.session.deleteMany({
        where: currentToken ? { sessionToken: { not: currentToken } } : undefined,
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: targetState ? "ENABLE_LOCKDOWN_MODE" : "DISABLE_LOCKDOWN_MODE",
        resource: "SYSTEM_SECURITY",
        details: `Lockdown Mode set to ${targetState} by ${auth.user.role}`,
      },
    }).catch((e: unknown) => console.warn("Audit log warning:", e));

    return NextResponse.json({
      success: true,
      message: targetState ? "EMERGENCY LOCKDOWN ACTIVATED. All sessions revoked." : "Lockdown Mode deactivated.",
      state,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
