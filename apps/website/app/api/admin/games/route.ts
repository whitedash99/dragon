import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ games });
  } catch (error) {
    return NextResponse.json({ games: [] });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const game = await prisma.game.create({
      data: {
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        subtitle: body.subtitle || "",
        genre: body.genre || "Action RPG",
        status: body.status || "In Development",
        year: body.year || "2027",
        description: body.description || "",
        featured: body.featured || false,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_GAME",
        userEmail: "Admin",
        details: `Created game: ${game.title}`,
      },
    });

    return NextResponse.json({ success: true, game });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, subtitle, genre, status, year, description, featured } = body;

    if (!id) return NextResponse.json({ success: false, error: "Game ID required" }, { status: 400 });

    const game = await prisma.game.update({
      where: { id },
      data: {
        title,
        subtitle,
        genre,
        status,
        year,
        description,
        featured,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_GAME",
        userEmail: "Admin",
        details: `Updated game: ${game.title}`,
      },
    });

    return NextResponse.json({ success: true, game });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    await prisma.game.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_GAME",
        userEmail: "Admin",
        details: `Deleted game ID: ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 400 });
  }
}
