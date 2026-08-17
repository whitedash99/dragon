import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ToggleReactionSchema } from "@dragon/validation";
import { publishCommunityEvent } from "@/lib/realtime";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to react to messages." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const parsed = ToggleReactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid reaction data." },
        { status: 400 }
      );
    }

    const { messageId, emoji } = parsed.data;

    // Check message existence & room slug
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: { room: true },
    });

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Message not found." },
        { status: 404 }
      );
    }

    // Toggle reaction
    const existing = await prisma.chatReaction.findUnique({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji,
        },
      },
    });

    if (existing) {
      await prisma.chatReaction.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.chatReaction.create({
        data: {
          messageId,
          userId,
          emoji,
        },
      });
    }

    // Fetch refreshed reactions for this message
    const allReactions = await prisma.chatReaction.findMany({
      where: { messageId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    // Broadcast reaction event over Ably
    await publishCommunityEvent(`community:room:${message.room.slug}`, "reaction-update", {
      messageId,
      reactions: allReactions,
    });

    return NextResponse.json({
      success: true,
      toggled: !existing,
      reactions: allReactions,
    });
  } catch (error: any) {
    console.error("[Chat Reactions Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to toggle reaction." },
      { status: 500 }
    );
  }
}
