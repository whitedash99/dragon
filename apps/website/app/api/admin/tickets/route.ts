import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAdminReplyEmail } from "@/lib/email";

// GET: Fetch all support tickets with messages
export async function GET() {
  try {
    const tickets = await prisma.contactTicket.findMany({
      where: { deleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // Compute analytics summary
    const totalCount = tickets.length;
    const openCount = tickets.filter((t) => t.status === "OPEN" || t.status === "NEW").length;
    const inProgressCount = tickets.filter((t) => t.status === "IN_PROGRESS" || t.status === "ASSIGNED").length;
    const resolvedCount = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;
    const criticalCount = tickets.filter((t) => t.priority === "CRITICAL" || t.priority === "HIGH").length;

    return NextResponse.json({
      success: true,
      tickets,
      analytics: {
        totalCount,
        openCount,
        inProgressCount,
        resolvedCount,
        criticalCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Admin Operations (Reply, Assign, Change Priority/Status, Save Internal Notes, Delete)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ticketId, message, priority, status, assignedStaff, internalNotes, adminName } = body;

    if (!ticketId) {
      return NextResponse.json({ success: false, error: "ticketId is required" }, { status: 400 });
    }

    const ticket = await prisma.contactTicket.findUnique({
      where: { ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });
    }

    // 1. Change Priority
    if (action === "update_priority") {
      const updated = await prisma.contactTicket.update({
        where: { ticketId },
        data: { priority },
      });
      return NextResponse.json({ success: true, ticket: updated });
    }

    // 2. Change Status (OPEN, WAITING, IN_PROGRESS, ASSIGNED, ESCALATED, RESOLVED, CLOSED, SPAM)
    if (action === "update_status") {
      const updated = await prisma.contactTicket.update({
        where: { ticketId },
        data: {
          status,
          closedAt: status === "CLOSED" || status === "RESOLVED" ? new Date() : null,
        },
      });
      return NextResponse.json({ success: true, ticket: updated });
    }

    // 3. Assign Staff
    if (action === "assign_staff") {
      const updated = await prisma.contactTicket.update({
        where: { ticketId },
        data: {
          assignedStaff,
          status: status || "ASSIGNED",
        },
      });
      return NextResponse.json({ success: true, ticket: updated });
    }

    // 4. Update Internal Notes
    if (action === "update_notes") {
      const updated = await prisma.contactTicket.update({
        where: { ticketId },
        data: { internalNotes },
      });
      return NextResponse.json({ success: true, ticket: updated });
    }

    // 5. Delete Ticket
    if (action === "delete_ticket") {
      await prisma.contactTicket.update({
        where: { ticketId },
        data: { deleted: true },
      });
      return NextResponse.json({ success: true, message: "Ticket marked deleted." });
    }

    // 6. Admin Reply & Email Dispatch
    const replyContent = message || ticket.aiSuggestedReply || "Thank you for reaching out to Dragon Studios.";
    const senderStaffName = adminName || "Dragon Studios Support Agent";

    // Record message in PostgreSQL
    const adminMsg = await prisma.ticketMessage.create({
      data: {
        ticketId: ticket.ticketId,
        sender: "ADMIN",
        senderName: senderStaffName,
        message: replyContent,
      },
    });

    // Update Ticket status
    const updatedTicket = await prisma.contactTicket.update({
      where: { ticketId },
      data: {
        replied: true,
        status: status || "IN_PROGRESS",
      },
    });

    // Dispatch Email Notification to Customer
    await sendAdminReplyEmail({
      ticketId: ticket.ticketId,
      customerName: ticket.name,
      customerEmail: ticket.email,
      subject: ticket.subject,
      adminName: senderStaffName,
      replyMessage: replyContent,
      status: updatedTicket.status,
    }).catch((e) => console.error("Non-fatal email reply dispatch error:", e));

    return NextResponse.json({
      success: true,
      message: "Admin reply saved and email dispatched.",
      ticket: updatedTicket,
      replyMessage: adminMsg,
    });
  } catch (error: any) {
    console.error("Admin Ticket Action API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
