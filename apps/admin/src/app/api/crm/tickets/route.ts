import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const q = searchParams.get("q");

    // 1. Fetch Admin Tickets
    const adminTickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        attachments: true,
        internalNotes: true,
        activities: true,
      },
    });

    // 2. Fetch Public Contact Tickets
    const publicTickets = await prisma.contactTicket.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Also fetch public messages from TicketMessage table (where ticketId = publicTicket.ticketId)
    const publicMessages = await prisma.$queryRaw<Array<{ id: string; ticketId: string; sender: string; senderName: string; message: string; createdAt: Date }>>`
      SELECT id, "ticketId", sender, "senderName", message, "createdAt"
      SELECT_MESSAGES FROM "TicketMessage" ORDER BY "createdAt" ASC
    `.catch(async () => {
      try {
        return await prisma.$queryRaw<Array<{ id: string; ticketId: string; sender: string; senderName: string; message: string; createdAt: Date }>>`
          SELECT id, "ticketId", sender, "senderName", message, "createdAt" FROM "TicketMessage" ORDER BY "createdAt" ASC
        `;
      } catch {
        return [];
      }
    });

    // Map public tickets into normalized Ticket format
    const normalizedPublic = publicTickets.map((pt) => {
      const msgs = publicMessages.filter((m) => m.ticketId === pt.ticketId);

      const initialMessage = {
        id: `initial-${pt.id}`,
        senderType: "CUSTOMER",
        senderName: pt.name,
        senderEmail: pt.email,
        message: pt.message,
        createdAt: pt.createdAt.toISOString(),
      };

      const threadMessages = msgs.map((m) => ({
        id: m.id,
        senderType: m.sender === "AGENT" || m.sender === "ADMIN" ? "AGENT" : "CUSTOMER",
        senderName: m.senderName || (m.sender === "AGENT" ? "Support Agent" : pt.name),
        senderEmail: m.sender === "AGENT" ? "support@dragonstudios.com" : pt.email,
        message: m.message,
        createdAt: new Date(m.createdAt).toISOString(),
      }));

      const internalNotesList = pt.internalNotes
        ? [{ id: `note-${pt.id}`, author: "Admin", note: pt.internalNotes }]
        : [];

      return {
        id: pt.id,
        ticketId: pt.ticketId,
        customerName: pt.name,
        customerEmail: pt.email,
        category: pt.category,
        subject: pt.subject,
        description: pt.message,
        priority: pt.priority || "NORMAL",
        status: pt.status || "OPEN",
        assignedAgent: pt.assignedStaff || "Unassigned",
        department: "Support",
        tags: pt.tags || "Public Inbound",
        lastReplyAt: pt.updatedAt ? pt.updatedAt.toISOString() : pt.createdAt.toISOString(),
        createdAt: pt.createdAt.toISOString(),
        updatedAt: pt.updatedAt ? pt.updatedAt.toISOString() : pt.createdAt.toISOString(),
        messages: [initialMessage, ...threadMessages],
        internalNotes: internalNotesList,
        attachments: pt.attachments ? JSON.parse(pt.attachments) : [],
        activities: [],
        source: "PUBLIC_CONTACT_FORM",
        trackingToken: pt.trackingToken,
      };
    });

    // Standardize admin tickets
    const normalizedAdmin = adminTickets.map((t) => ({
      id: t.id,
      ticketId: t.ticketId,
      customerName: t.customerName,
      customerEmail: t.customerEmail,
      category: t.category,
      subject: t.subject,
      description: t.description,
      priority: t.priority,
      status: t.status,
      assignedAgent: t.assignedAgent || "Unassigned",
      department: t.department || "Support",
      tags: t.tags || "Admin",
      lastReplyAt: t.lastReplyAt ? t.lastReplyAt.toISOString() : t.createdAt.toISOString(),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt ? t.updatedAt.toISOString() : t.createdAt.toISOString(),
      messages: t.messages.map((m) => ({
        id: m.id,
        senderType: m.senderType,
        senderName: m.senderName,
        senderEmail: m.senderEmail,
        message: m.message,
        createdAt: m.createdAt.toISOString(),
      })),
      internalNotes: t.internalNotes,
      attachments: t.attachments,
      activities: t.activities,
      source: "ADMIN_PORTAL",
      trackingToken: null,
    }));

    // Merge and deduplicate by ticketId
    const allMap = new Map();
    [...normalizedPublic, ...normalizedAdmin].forEach((item) => {
      allMap.set(item.ticketId, item);
    });

    const combined = Array.from(allMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply filtering
    const filtered = combined.filter((t) => {
      const matchesSearch =
        !q ||
        t.ticketId.toLowerCase().includes(q.toLowerCase()) ||
        t.customerName.toLowerCase().includes(q.toLowerCase()) ||
        t.customerEmail.toLowerCase().includes(q.toLowerCase()) ||
        t.subject.toLowerCase().includes(q.toLowerCase()) ||
        t.category.toLowerCase().includes(q.toLowerCase());

      const matchesStatus = !status || status === "All" || t.status === status;
      const matchesPriority = !priority || priority === "All" || t.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    const totalTickets = combined.length;
    const openTickets = combined.filter((t) => t.status === "OPEN" || t.status === "NEW" || t.status === "INVESTIGATING").length;
    const urgentTickets = combined.filter((t) => t.priority === "CRITICAL" || t.priority === "HIGH").length;
    const resolvedTickets = combined.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;

    return NextResponse.json({
      success: true,
      tickets: filtered,
      telemetry: {
        totalTickets,
        openTickets,
        urgentTickets,
        resolvedTickets,
        avgResponseSla: "< 4 Hours",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, ticketId, customerName, customerEmail, category, subject, description, priority, status, message, adminName, assignedAgent, internalNote } = body;

    // 1. Create Inbound Ticket
    if (action === "create_ticket" || (!action && customerEmail && subject)) {
      const count = await prisma.ticket.count();
      const countPublic = await prisma.contactTicket.count();
      const seq = String(count + countPublic + 1).padStart(6, "0");
      const generatedTicketId = `DRG-2026-${seq}`;

      const ticket = await prisma.ticket.create({
        data: {
          ticketId: generatedTicketId,
          customerName: customerName || "Customer",
          customerEmail: customerEmail.trim().toLowerCase(),
          category: category || "Technical Support",
          subject: subject.trim(),
          description: description || subject,
          priority: priority || "NORMAL",
          status: "OPEN",
          messages: {
            create: {
              senderType: "CUSTOMER",
              senderName: customerName || "Customer",
              senderEmail: customerEmail.trim().toLowerCase(),
              message: description || subject,
            },
          },
        },
      });

      await prisma.auditLog.create({
        data: {
          action: "CREATE_SUPPORT_TICKET",
          userEmail: customerEmail,
          details: `Ticket Created: ${ticket.ticketId} (${ticket.subject})`,
        },
      });

      return NextResponse.json({ success: true, ticket });
    }

    if (!ticketId) {
      return NextResponse.json({ success: false, error: "ticketId is required for admin updates" }, { status: 400 });
    }

    // Check in ContactTicket table first
    const publicTicket = await prisma.contactTicket.findUnique({ where: { ticketId } });
    const adminTicket = await prisma.ticket.findUnique({ where: { ticketId } });

    if (!publicTicket && !adminTicket) {
      return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 });
    }

    // 2. Admin Reply Dispatch
    if (action === "send_reply" || message) {
      const replyContent = message || "Thank you for contacting Dragon Studios Support.";
      const sender = adminName || "Dragon Support Agent";

      if (publicTicket) {
        // Insert reply into TicketMessage table for public ticket
        const msgId = `msg_${Date.now()}`;
        await prisma.$executeRaw`
          INSERT INTO "TicketMessage" (id, "ticketId", sender, "senderName", message, "createdAt")
          VALUES (${msgId}, ${publicTicket.ticketId}, 'AGENT', ${sender}, ${replyContent}, NOW())
        `.catch(async () => {
          // Fallback if schema matches senderType
          try {
            await prisma.$executeRaw`
              INSERT INTO "TicketMessage" (id, "ticketId", "senderType", "senderName", message, "createdAt")
              VALUES (${msgId}, ${publicTicket.id}, 'AGENT', ${sender}, ${replyContent}, NOW())
            `;
          } catch (e) {
            console.error("Message insert error:", e);
          }
        });

        const updatedTicket = await prisma.contactTicket.update({
          where: { ticketId },
          data: {
            status: status || "INVESTIGATING",
            replied: true,
            updatedAt: new Date(),
          },
        });

        await prisma.emailLog.create({
          data: {
            recipient: publicTicket.email,
            subject: `RE: [${publicTicket.ticketId}] ${publicTicket.subject}`,
            status: "DISPATCHED",
          },
        });

        await prisma.auditLog.create({
          data: {
            action: "DISPATCH_SUPPORT_REPLY",
            userEmail: publicTicket.email,
            details: `Agent ${sender} replied to Ticket ${ticketId}`,
          },
        });

        return NextResponse.json({ success: true, ticket: updatedTicket });
      }

      if (adminTicket) {
        const msg = await prisma.ticketMessage.create({
          data: {
            ticketId: adminTicket.id,
            senderType: "AGENT",
            senderName: sender,
            senderEmail: "support@dragonstudios.com",
            message: replyContent,
          },
        });

        const updatedTicket = await prisma.ticket.update({
          where: { ticketId },
          data: {
            status: status || "INVESTIGATING",
            lastReplyAt: new Date(),
          },
        });

        await prisma.emailLog.create({
          data: {
            ticketId: adminTicket.id,
            recipient: adminTicket.customerEmail,
            subject: `RE: [${adminTicket.ticketId}] ${adminTicket.subject}`,
            status: "DISPATCHED",
          },
        });

        await prisma.auditLog.create({
          data: {
            action: "DISPATCH_SUPPORT_REPLY",
            userEmail: adminTicket.customerEmail,
            details: `Agent ${sender} replied to Ticket ${ticketId}`,
          },
        });

        return NextResponse.json({ success: true, ticket: updatedTicket, message: msg });
      }
    }

    // 3. Update Status / Priority / Agent Assignment
    if (action === "update_ticket") {
      if (publicTicket) {
        const updated = await prisma.contactTicket.update({
          where: { ticketId },
          data: {
            status: status || undefined,
            priority: priority || undefined,
            assignedStaff: assignedAgent || undefined,
            internalNotes: internalNote ? `${publicTicket.internalNotes ? publicTicket.internalNotes + "\n" : ""}[${adminName || "Admin"}]: ${internalNote}` : undefined,
          },
        });

        await prisma.auditLog.create({
          data: {
            action: "UPDATE_SUPPORT_TICKET",
            userEmail: publicTicket.email,
            details: `Ticket ${ticketId} updated: Status=${status || publicTicket.status}, Priority=${priority || publicTicket.priority}`,
          },
        });

        return NextResponse.json({ success: true, ticket: updated });
      }

      if (adminTicket) {
        const updated = await prisma.ticket.update({
          where: { ticketId },
          data: {
            status: status || undefined,
            priority: priority || undefined,
            assignedAgent: assignedAgent || undefined,
          },
        });

        if (internalNote) {
          await prisma.internalNote.create({
            data: {
              ticketId: adminTicket.id,
              author: adminName || "Admin",
              note: internalNote,
            },
          });
        }

        await prisma.auditLog.create({
          data: {
            action: "UPDATE_SUPPORT_TICKET",
            userEmail: adminTicket.customerEmail,
            details: `Ticket ${ticketId} updated: Status=${status || adminTicket.status}, Priority=${priority || adminTicket.priority}`,
          },
        });

        return NextResponse.json({ success: true, ticket: updated });
      }
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
