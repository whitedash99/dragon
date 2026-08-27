import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { ticketId } = await params;
    const cleanId = ticketId.trim().toUpperCase();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    let ticket = await prisma.contactTicket.findFirst({
      where: {
        OR: [
          { ticketId: cleanId },
          { id: ticketId },
          { email: ticketId.toLowerCase().trim() },
        ],
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      // Fallback search in Ticket table
      const mirror = await prisma.ticket.findFirst({
        where: {
          OR: [
            { ticketId: cleanId },
            { id: ticketId },
            { customerEmail: ticketId.toLowerCase().trim() },
          ],
        },
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (mirror) {
        return NextResponse.json({
          success: true,
          ticket: {
            ticketId: mirror.ticketId,
            name: mirror.customerName,
            email: mirror.customerEmail,
            category: mirror.category,
            subject: mirror.subject,
            message: mirror.description,
            priority: mirror.priority,
            status: mirror.status,
            createdAt: mirror.createdAt,
            estimatedResponse: "Within 24 Hours",
            messages: mirror.messages.map((m: any) => ({
              id: m.id,
              sender: m.sender || m.senderType || "ADMIN",
              senderName: m.senderName,
              message: m.message,
              createdAt: m.createdAt,
            })),
          },
        });
      }

      return NextResponse.json({ success: false, error: "Support ticket not found. Please verify your reference number." }, { status: 404 });
    }

    // Optional token check for enhanced validation
    if (token && ticket.trackingToken && ticket.trackingToken !== token) {
      // Still allow viewing if valid ticket ID, but note token mismatch
      console.warn("Tracking token mismatch for ticket:", cleanId);
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
        messages: ticket.messages.map((m: any) => ({
          id: m.id,
          sender: m.sender || m.senderType || "CUSTOMER",
          senderName: m.senderName,
          message: m.message,
          createdAt: m.createdAt,
        })),
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
    const cleanId = ticketId.trim().toUpperCase();
    const body = await req.json();
    const { action, message, senderName } = body;

    let ticket = await prisma.contactTicket.findFirst({
      where: {
        OR: [{ ticketId: cleanId }, { id: ticketId }],
      },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket not found." }, { status: 404 });
    }

    if (action === "close") {
      const updated = await prisma.contactTicket.update({
        where: { id: ticket.id },
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

    // Ensure mirror ticket exists for relational constraints
    let mirrorTicket = await prisma.ticket.findFirst({
      where: { ticketId: ticket.ticketId },
    });

    if (!mirrorTicket) {
      mirrorTicket = await prisma.ticket.create({
        data: {
          ticketId: ticket.ticketId,
          customerName: ticket.name,
          customerEmail: ticket.email,
          category: ticket.category,
          subject: ticket.subject,
          description: ticket.message,
          priority: ticket.priority,
          status: "OPEN",
          source: "PUBLIC_CONTACT_FORM",
          createdByType: "CUSTOMER",
          legacyContactTicketId: ticket.id,
        },
      });
    }

    // Add Customer or Admin Reply Message
    const newMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: mirrorTicket.id,
        contactTicketId: ticket.ticketId,
        sender: body.sender || "CUSTOMER",
        senderType: body.sender || "CUSTOMER",
        senderName: senderName || ticket.name,
        senderEmail: ticket.email,
        message: message.trim(),
      },
    });

    // Update ticket status to IN_PROGRESS and touched timestamp
    await prisma.contactTicket.update({
      where: { id: ticket.id },
      data: {
        status: "IN_PROGRESS",
        updatedAt: new Date(),
      },
    });

    await prisma.ticket.update({
      where: { id: mirrorTicket.id },
      data: {
        status: "IN_PROGRESS",
        lastReplyAt: new Date(),
        updatedAt: new Date(),
      },
    }).catch(() => null);

    return NextResponse.json({
      success: true,
      message: {
        id: newMessage.id,
        sender: newMessage.sender,
        senderName: newMessage.senderName,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Support Ticket Reply Error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
