import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    const ticket = await prisma.contactTicket.findUnique({
      where: { ticketId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket not found." }, { status: 404 });
    }

    // Optional token validation for added security if provided
    if (token && ticket.trackingToken && ticket.trackingToken !== token) {
      return NextResponse.json({ success: false, error: "Unauthorized tracking token." }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      ticket: {
        ticketId: ticket.ticketId,
        name: ticket.name,
        email: ticket.email,
        category: ticket.category,
        subject: ticket.subject,
        message: ticket.message,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt,
        verifiedAt: ticket.verifiedAt,
        estimatedResponse: ticket.estimatedResponse || "Within 24 Hours",
        messages: ticket.messages,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const body = await req.json();
    const { action, message, senderName } = body;

    const ticket = await prisma.contactTicket.findUnique({
      where: { ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket not found." }, { status: 404 });
    }

    if (action === "close") {
      const updated = await prisma.contactTicket.update({
        where: { ticketId },
        data: {
          status: "CLOSED",
          closedAt: new Date(),
        },
      });
      return NextResponse.json({ success: true, message: "Ticket closed successfully.", ticket: updated });
    }

    if (!message || typeof message !== "string" || message.trim().length < 2) {
      return NextResponse.json({ success: false, error: "Reply message body is required." }, { status: 400 });
    }

    // Add Customer or Admin Reply Message
    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.ticketId,
        sender: body.sender || "CUSTOMER",
        senderName: senderName || ticket.name,
        message: message.trim(),
      },
    });

    // Update ticket status to IN_PROGRESS if customer replied
    await prisma.contactTicket.update({
      where: { ticketId },
      data: {
        status: "IN_PROGRESS",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
