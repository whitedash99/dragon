import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateReportSchema } from "@dragon/validation";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to submit reports." },
        { status: 401 }
      );
    }

    const reporterId = session.user.id;
    const body = await req.json();
    const parsed = CreateReportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid report data." },
        { status: 400 }
      );
    }

    const { targetType, messageId, threadId, postId, reportedUserId, reason, details } = parsed.data;

    const report = await prisma.communityReport.create({
      data: {
        reporterId,
        targetType,
        messageId: messageId || null,
        threadId: threadId || null,
        postId: postId || null,
        reportedUserId: reportedUserId || null,
        reason,
        details: details?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Report submitted successfully. Our safety & moderation team will review this shortly.",
      reportId: report.id,
    });
  } catch (error: any) {
    console.error("[Community Report Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit report." },
      { status: 500 }
    );
  }
}
