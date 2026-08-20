import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { sendContactReplyEmail } from "@dragon/email";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";

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

    // Fetch messages from TicketMessage table
    const publicMessages = await prisma.ticketMessage.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        ticketId: true,
        sender: true,
        senderName: true,
        message: true,
        createdAt: true,
      },
    }).catch(() => []);

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
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    if (!can(auth.user, "crm.manage") && !can(auth.user, "support.manage")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires crm.manage permission." }, { status: 403 });
    }

    const body = await req.json();
    const { action, ticketId, customerName, customerEmail, category, subject, description, priority, status, message, assignedAgent, internalNote } = body;
    const agentName = auth.user.name || auth.user.email;

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
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "CREATE_SUPPORT_TICKET",
          resource: "CRM",
          details: `Ticket Created: ${ticket.ticketId} (${ticket.subject})`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));

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
      const sender = agentName;

      if (publicTicket) {
        // Look up the mirror Ticket record (TicketActivity FK references Ticket.id)
        const mirrorTicket = await prisma.ticket.findUnique({ where: { ticketId } });

        // Insert into TicketReply table
        await prisma.ticketReply.create({
          data: {
            contactTicketId: publicTicket.id,
            senderType: "AGENT",
            senderName: sender,
            senderEmail: "support@dragonstudios.com",
            message: replyContent,
          },
        });

        // Insert reply into TicketMessage table for backward compatibility
        const msgId = `msg_${Date.now()}`;
        if (mirrorTicket) {
          await prisma.ticketMessage.create({
            data: {
              id: msgId,
              ticketId: mirrorTicket.id,
              senderType: "AGENT",
              senderName: sender,
              senderEmail: "support@dragonstudios.com",
              message: replyContent,
            },
          }).catch((e) => console.error("Message insert error:", e));
        }

        const updatedTicket = await prisma.contactTicket.update({
          where: { ticketId },
          data: {
            status: status || "WAITING_FOR_CUSTOMER",
            replied: true,
            updatedAt: new Date(),
          },
        });

        // Also sync status to the mirror Ticket
        if (mirrorTicket) {
          await prisma.ticket.update({
            where: { ticketId },
            data: {
              status: status || "WAITING_FOR_CUSTOMER",
              lastReplyAt: new Date(),
            },
          }).catch(() => {});
        }

        // Create Activity Log using mirror Ticket.id (satisfies FK constraint)
        if (mirrorTicket) {
          await prisma.ticketActivity.create({
            data: {
              ticketId: mirrorTicket.id,
              action: "AGENT_REPLIED",
              details: `Agent ${sender} replied to Ticket ${ticketId}`,
              performer: sender,
            },
          });
        }

        // Dispatch Email via Resend
        const dispatchRes = await sendContactReplyEmail({
          contactId: publicTicket.id,
          toEmail: publicTicket.email,
          subject: `RE: [${publicTicket.ticketId}] ${publicTicket.subject}`,
          message: replyContent,
        }).catch(() => ({ success: false, messageId: undefined }));

        // Create In-App Notification for User Dashboard
        await prisma.notification.create({
          data: {
            title: `Support Reply Received: ${publicTicket.ticketId}`,
            message: `${sender}: ${replyContent}`,
            type: "SUPPORT_REPLY",
            recipient: publicTicket.email.toLowerCase().trim(),
            channel: "IN_APP",
          },
        }).catch((e) => console.warn("User Notification creation warning:", e));

        await prisma.emailLog.create({
          data: {
            recipient: publicTicket.email,
            subject: `RE: [${publicTicket.ticketId}] ${publicTicket.subject}`,
            status: dispatchRes.success ? "DISPATCHED" : "FAILED",
            providerResponse: dispatchRes.messageId || "Resend Dispatch",
            template: "SUPPORT_REPLY",
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: auth.user.id,
            userEmail: auth.user.email,
            action: "DISPATCH_SUPPORT_REPLY",
            resource: "CRM",
            details: `Agent ${sender} replied to Ticket ${ticketId}`,
          },
        }).catch((e) => console.warn("AuditLog warning:", e));

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

        await prisma.ticketReply.create({
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
            status: status || "WAITING_FOR_CUSTOMER",
            lastReplyAt: new Date(),
          },
        });

        await prisma.ticketActivity.create({
          data: {
            ticketId: adminTicket.id,
            action: "AGENT_REPLIED",
            details: `Agent ${sender} replied to Ticket ${ticketId}`,
            performer: sender,
          },
        });

        // Dispatch Email via Resend
        const dispatchRes = await sendContactReplyEmail({
          contactId: adminTicket.id,
          toEmail: adminTicket.customerEmail,
          subject: `RE: [${adminTicket.ticketId}] ${adminTicket.subject}`,
          message: replyContent,
        }).catch(() => ({ success: false, messageId: undefined }));

        await prisma.emailLog.create({
          data: {
            ticketId: adminTicket.id,
            recipient: adminTicket.customerEmail,
            subject: `RE: [${adminTicket.ticketId}] ${adminTicket.subject}`,
            status: dispatchRes.success ? "DISPATCHED" : "FAILED",
            providerResponse: dispatchRes.messageId || "Resend Dispatch",
            template: "SUPPORT_REPLY",
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: auth.user.id,
            userEmail: auth.user.email,
            action: "DISPATCH_SUPPORT_REPLY",
            resource: "CRM",
            details: `Agent ${sender} replied to Ticket ${ticketId}`,
          },
        }).catch((e) => console.warn("AuditLog warning:", e));

        return NextResponse.json({ success: true, ticket: updatedTicket, message: msg });
      }
    }

    // 3. Update Status / Priority / Agent Assignment
    if (action === "update_ticket") {
      if (publicTicket) {
        // Look up the mirror Ticket record (TicketActivity FK references Ticket.id)
        const mirrorTicket = await prisma.ticket.findUnique({ where: { ticketId } });

        const updated = await prisma.contactTicket.update({
          where: { ticketId },
          data: {
            status: status || undefined,
            priority: priority || undefined,
            assignedStaff: assignedAgent || undefined,
            internalNotes: internalNote ? `${publicTicket.internalNotes ? publicTicket.internalNotes + "\n" : ""}[${agentName}]: ${internalNote}` : undefined,
          },
        });

        // Sync updates to the mirror Ticket
        if (mirrorTicket) {
          await prisma.ticket.update({
            where: { ticketId },
            data: {
              status: status || undefined,
              priority: priority || undefined,
              assignedAgent: assignedAgent || undefined,
            },
          }).catch(() => {});
        }

        if (assignedAgent && assignedAgent !== publicTicket.assignedStaff) {
          await prisma.ticketAssignment.create({
            data: {
              ticketId: mirrorTicket?.id || publicTicket.id,
              assignedTo: assignedAgent,
              assignedBy: agentName,
              note: internalNote || "Assigned via CRM Desk",
            },
          });
        }

        // Create Activity Log using mirror Ticket.id (satisfies FK constraint)
        if (mirrorTicket) {
          await prisma.ticketActivity.create({
            data: {
              ticketId: mirrorTicket.id,
              action: "TICKET_UPDATED",
              details: `Status=${status || publicTicket.status}, Priority=${priority || publicTicket.priority}, Agent=${assignedAgent || publicTicket.assignedStaff}`,
              performer: agentName,
            },
          });
        }

        await prisma.auditLog.create({
          data: {
            userId: auth.user.id,
            userEmail: auth.user.email,
            action: "UPDATE_SUPPORT_TICKET",
            resource: "CRM",
            details: `Ticket ${ticketId} updated: Status=${status || publicTicket.status}, Priority=${priority || publicTicket.priority}`,
          },
        }).catch((e) => console.warn("AuditLog warning:", e));

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

        if (assignedAgent && assignedAgent !== adminTicket.assignedAgent) {
          await prisma.ticketAssignment.create({
            data: {
              ticketId: adminTicket.id,
              assignedTo: assignedAgent,
              assignedBy: agentName,
              note: internalNote || "Assigned via CRM Desk",
            },
          });
        }

        if (internalNote) {
          await prisma.internalNote.create({
            data: {
              ticketId: adminTicket.id,
              author: agentName,
              note: internalNote,
            },
          });
        }

        await prisma.ticketActivity.create({
          data: {
            ticketId: adminTicket.id,
            action: "TICKET_UPDATED",
            details: `Status=${status || adminTicket.status}, Priority=${priority || adminTicket.priority}, Agent=${assignedAgent || adminTicket.assignedAgent}`,
            performer: agentName,
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: auth.user.id,
            userEmail: auth.user.email,
            action: "UPDATE_SUPPORT_TICKET",
            resource: "CRM",
            details: `Ticket ${ticketId} updated: Status=${status || adminTicket.status}, Priority=${priority || adminTicket.priority}`,
          },
        }).catch((e) => console.warn("AuditLog warning:", e));

        return NextResponse.json({ success: true, ticket: updated });
      }
    }

    // 4. Bulk Operations
    if (action === "bulk_update" && Array.isArray(body.ticketIds)) {
      const { ticketIds, bulkStatus, bulkPriority, bulkAgent, bulkDelete } = body;

      if (bulkDelete) {
        await prisma.contactTicket.deleteMany({ where: { ticketId: { in: ticketIds } } });
        await prisma.ticket.deleteMany({ where: { ticketId: { in: ticketIds } } });
        return NextResponse.json({ success: true, message: `Bulk deleted ${ticketIds.length} tickets` });
      }

      const updateData: Record<string, unknown> = {};
      if (bulkStatus) updateData.status = bulkStatus;
      if (bulkPriority) updateData.priority = bulkPriority;
      if (bulkAgent) {
        updateData.assignedStaff = bulkAgent;
        updateData.assignedAgent = bulkAgent;
      }

      await prisma.contactTicket.updateMany({
        where: { ticketId: { in: ticketIds } },
        data: {
          status: bulkStatus || undefined,
          priority: bulkPriority || undefined,
          assignedStaff: bulkAgent || undefined,
        },
      });

      await prisma.ticket.updateMany({
        where: { ticketId: { in: ticketIds } },
        data: {
          status: bulkStatus || undefined,
          priority: bulkPriority || undefined,
          assignedAgent: bulkAgent || undefined,
        },
      });

      return NextResponse.json({ success: true, message: `Bulk updated ${ticketIds.length} tickets` });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
