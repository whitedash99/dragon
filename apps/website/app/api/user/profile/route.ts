import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("dragon_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Session invalid or expired" }, { status: 401 });
    }

    const user = session.user;

    // Fetch user tickets
    const tickets = await prisma.contactTicket.findMany({
      where: { email: user.email, deleted: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      tickets,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get("dragon_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (!session) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: { name },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
