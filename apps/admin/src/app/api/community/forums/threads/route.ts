import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const threads = await prisma.forumThread.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        author: {
          select: { name: true, email: true },
        },
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json({ success: true, threads });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch forum threads";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Thread ID is required" }, { status: 400 });
    }

    await prisma.forumThread.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "DELETE_FORUM_THREAD",
        resource: "COMMUNITY",
        details: `Deleted forum thread ID: ${id}`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete thread";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
