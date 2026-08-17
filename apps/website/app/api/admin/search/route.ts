import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q.trim() || q.trim().length < 2) {
      return NextResponse.json({ success: true, results: { users: [], tickets: [], games: [], articles: [], content: [] } });
    }

    const query = q.trim();

    const [users, tickets, games, articles, content] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),
      prisma.contactTicket.findMany({
        where: {
          OR: [
            { ticketId: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { subject: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),
      prisma.game.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),
      prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),
      prisma.contentBlock.findMany({
        where: {
          OR: [
            { key: { contains: query, mode: "insensitive" } },
            { label: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      success: true,
      results: {
        users,
        tickets,
        games,
        articles,
        content,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
