import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SendMessageSchema } from "@dragon/validation";
import { checkMessageRateLimit, publishCommunityEvent } from "@/lib/realtime";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const roomSlug = searchParams.get("roomSlug");
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    let targetRoomId = roomId;
    if (!targetRoomId && roomSlug) {
      const room = await prisma.communityRoom.findUnique({
        where: { slug: roomSlug },
        select: { id: true },
      });
      if (room) targetRoomId = room.id;
    }

    if (!targetRoomId) {
      return NextResponse.json(
        { success: false, error: "Room ID or valid Room Slug is required." },
        { status: 400 }
      );
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        roomId: targetRoomId,
        deletedAt: null,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            image: true,
            role: true,
            department: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Return in chronological order for the client chat stream
    return NextResponse.json({
      success: true,
      messages: messages.reverse(),
      nextCursor: messages.length === limit ? messages[0]?.id : null,
    });
  } catch (error: any) {
    console.error("[Chat Messages GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch messages." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to send chat messages." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const parsed = SendMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid message data." },
        { status: 400 }
      );
    }

    const { roomId, content, replyToId, attachments } = parsed.data;

    // 1. Check if user is banned or muted
    const [banRecord, muteRecord] = await Promise.all([
      prisma.communityBan.findUnique({ where: { userId } }),
      prisma.communityMute.findUnique({ where: { userId } }),
    ]);

    if (banRecord) {
      return NextResponse.json(
        { success: false, error: `Your account is suspended from Community: ${banRecord.reason}` },
        { status: 403 }
      );
    }

    if (muteRecord) {
      if (!muteRecord.expiresAt || muteRecord.expiresAt > new Date()) {
        return NextResponse.json(
          { success: false, error: `You are currently muted in community chat: ${muteRecord.reason}` },
          { status: 403 }
        );
      }
    }

    // 2. Anti-spam & rate-limit check
    const rateCheck = checkMessageRateLimit(userId, content);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: rateCheck.reason, retryAfterMs: rateCheck.retryAfterMs },
        { status: 429 }
      );
    }

    // 3. Find Room
    const room = await prisma.communityRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Target community room not found." },
        { status: 404 }
      );
    }

    // 4. Save to PostgreSQL
    const createdMessage = await prisma.chatMessage.create({
      data: {
        roomId,
        userId,
        content: content.trim(),
        replyToId: replyToId || null,
        attachments: attachments ? JSON.stringify(attachments) : "[]",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            image: true,
            role: true,
            department: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        reactions: true,
      },
    });

    // 5. Broadcast to Ably Realtime Channel
    await publishCommunityEvent(`community:room:${room.slug}`, "new-message", createdMessage);

    return NextResponse.json({
      success: true,
      message: createdMessage,
    });
  } catch (error: any) {
    console.error("[Chat Message POST Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to post message." },
      { status: 500 }
    );
  }
}
