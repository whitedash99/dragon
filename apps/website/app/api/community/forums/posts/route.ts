import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreatePostSchema } from "@dragon/validation";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const threadId = searchParams.get("threadId");

    if (!threadId) {
      return NextResponse.json(
        { success: false, error: "Thread ID is required." },
        { status: 400 }
      );
    }

    const posts = await prisma.forumPost.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            image: true,
            role: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error: any) {
    console.error("[Forum Posts GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch forum posts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to reply to forum threads." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const parsed = CreatePostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid post reply data." },
        { status: 400 }
      );
    }

    const { threadId, content } = parsed.data;

    // Verify thread is not locked
    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return NextResponse.json(
        { success: false, error: "Forum thread not found." },
        { status: 404 }
      );
    }

    if (thread.isLocked) {
      return NextResponse.json(
        { success: false, error: "This thread has been locked by a moderator." },
        { status: 403 }
      );
    }

    const post = await prisma.forumPost.create({
      data: {
        threadId,
        authorId: userId,
        content: content.trim(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            image: true,
            role: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error("[Forum Post POST Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to post forum reply." },
      { status: 500 }
    );
  }
}
