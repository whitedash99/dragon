import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const passkeys = await prisma.passkeyCredential.findMany({
      where: { userId: auth.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      passkeys: passkeys.map((p) => ({
        id: p.id,
        credentialId: p.credentialId,
        deviceType: p.deviceType || "Hardware Authenticator",
        transports: p.transports || "internal",
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, id, deviceType } = body;

    // 1. RENAME PASSKEY
    if (action === "rename_passkey" && id && deviceType) {
      const existing = await prisma.passkeyCredential.findUnique({ where: { id } });
      if (!existing || existing.userId !== auth.user.id) {
        return NextResponse.json({ success: false, error: "Access Denied: Passkey credential belongs to another account." }, { status: 403 });
      }

      const passkey = await prisma.passkeyCredential.update({
        where: { id },
        data: { deviceType: deviceType.trim() },
      });

      return NextResponse.json({ success: true, passkey });
    }

    // 2. REVOKE PASSKEY
    if (action === "revoke_passkey" && id) {
      const existing = await prisma.passkeyCredential.findUnique({ where: { id } });
      if (!existing || existing.userId !== auth.user.id) {
        return NextResponse.json({ success: false, error: "Access Denied: Passkey credential belongs to another account." }, { status: 403 });
      }

      const deleted = await prisma.passkeyCredential.delete({
        where: { id },
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "PASSKEY_REVOKED",
          resource: "WEBAUTHN",
          details: `Revoked passkey credential ${deleted.credentialId} (${deleted.deviceType})`,
        },
      });

      return NextResponse.json({ success: true, message: "Passkey revoked." });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
