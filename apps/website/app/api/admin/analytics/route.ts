import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalTickets = await prisma.contactTicket.count();
    const resolvedTickets = await prisma.contactTicket.count({ where: { status: "RESOLVED" } });
    const totalSubscribers = await prisma.newsletterSubscriber.count();
    const totalArticles = await prisma.newsArticle.count();
    const totalGames = await prisma.gameContent.count();
    const totalMedia = await prisma.mediaAsset.count();

    return NextResponse.json({
      success: true,
      analytics: {
        totalUsers,
        totalTickets,
        resolvedTickets,
        totalSubscribers,
        totalArticles,
        totalGames,
        totalMedia,
        avgResponseTimeSla: "< 4 Hours",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
