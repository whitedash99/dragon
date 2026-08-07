import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.communityEvent.findMany({
      orderBy: { date: "asc" },
    });
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ events: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = await prisma.communityEvent.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        date: new Date(body.date || Date.now()),
        location: body.location || "Online Arena",
        prizePool: body.prizePool || "$50,000",
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}
