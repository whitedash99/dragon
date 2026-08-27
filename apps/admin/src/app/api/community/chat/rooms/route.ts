import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rooms = await prisma.communityRoom.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json({ success: true, rooms });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch rooms";
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
    const { name, slug, description, category, type } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, error: "Name and slug are required" }, { status: 400 });
    }

    const room = await prisma.communityRoom.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description?.trim(),
        category: category || "COMMUNITY",
        type: type || "TEXT",
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "CREATE_COMMUNITY_ROOM",
        resource: "COMMUNITY",
        details: `Created Community Chat Room: #${room.name} (${room.slug})`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({ success: true, room });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create room";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
