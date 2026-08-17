import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireProtectedOwner } from "@/lib/auth/owner-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireProtectedOwner();
  if (!guard.authorized) return guard.response;

  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { resource: "DATA_CONTROL" },
          { action: { contains: "PURGE" } },
          { action: { contains: "EXPORT" } },
          { action: { contains: "DELETION" } },
          { action: { contains: "RETENTION" } },
        ],
      },
      take: 50,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      activity: logs.map((log) => ({
        id: log.id,
        action: log.action,
        actorEmail: log.userEmail || "Owner",
        resource: log.resource || "DATA_CONTROL",
        details: log.details || "Administrative event logged",
        ipAddress: log.ipAddress || "127.0.0.1",
        createdAt: log.createdAt.toISOString(),
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
