import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function getAuthUser(req: NextRequest) {
  const sessionToken = req.cookies.get("dragon_session")?.value;
  if (sessionToken) {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (session?.user) return session.user;
  }

  const authSession = await getServerSession(authOptions).catch(() => null);
  if (authSession?.user?.email) {
    return prisma.user.findUnique({
      where: { email: authSession.user.email.toLowerCase().trim() },
    });
  }

  return null;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const userEmail = user.email.toLowerCase().trim();

    // 1. Fetch DB In-App Notifications
    const dbNotifications = await prisma.notification.findMany({
      where: {
        OR: [
          { recipient: userEmail },
          { recipient: "ALL_USERS" },
          { recipient: "All Staff" }
        ]
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }).catch(() => []);

    // 2. Fetch Contact Tickets for User
    const tickets = await prisma.contactTicket.findMany({
      where: { email: userEmail, deleted: false },
      orderBy: { createdAt: "desc" },
      take: 10,
    }).catch(() => []);

    const ticketIds = tickets.map((t) => t.id);

    // Fetch replies for these tickets
    const replies = ticketIds.length > 0
      ? await prisma.ticketReply.findMany({
          where: { contactTicketId: { in: ticketIds } },
          orderBy: { createdAt: "desc" },
        }).catch(() => [])
      : [];

    // 3. Transform Tickets and Replies into Notification items
    const ticketNotifications: any[] = [];

    tickets.forEach((t) => {
      // Notification for ticket creation
      ticketNotifications.push({
        id: `ticket-create-${t.id}`,
        title: `Support Ticket Created: ${t.ticketId}`,
        message: `Your inquiry "${t.subject}" has been received. Our team will respond shortly.`,
        type: "TICKET_CREATED",
        recipient: userEmail,
        isRead: true,
        ticketId: t.ticketId,
        createdAt: t.createdAt.toISOString(),
      });

      // Notification for agent replies
      const tReplies = replies.filter((r) => r.contactTicketId === t.id);
      tReplies.forEach((r) => {
        ticketNotifications.push({
          id: `ticket-reply-${r.id}`,
          title: `Support Response: ${t.ticketId}`,
          message: `${r.senderName || "Support Team"}: ${r.message}`,
          type: "SUPPORT_REPLY",
          recipient: userEmail,
          isRead: t.status === "RESOLVED" || t.status === "CLOSED",
          ticketId: t.ticketId,
          createdAt: r.createdAt.toISOString(),
        });
      });
    });

    // Merge and deduplicate
    const normalizedDb = dbNotifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type || "INFO",
      recipient: n.recipient,
      isRead: n.isRead,
      ticketId: null,
      createdAt: n.createdAt.toISOString(),
    }));

    const combined = [...ticketNotifications, ...normalizedDb].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const unreadCount = combined.filter((n) => !n.isRead).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications: combined,
      tickets: tickets.map((t) => {
        const tReplies = replies.filter((r) => r.contactTicketId === t.id);
        return {
          id: t.id,
          ticketId: t.ticketId,
          subject: t.subject,
          category: t.category,
          status: t.status,
          priority: t.priority,
          message: t.message,
          createdAt: t.createdAt.toISOString(),
          updatedAt: t.updatedAt.toISOString(),
          replies: tReplies.map((r) => ({
            id: r.id,
            senderName: r.senderName,
            senderType: r.senderType,
            message: r.message,
            createdAt: r.createdAt.toISOString(),
          })),
        };
      }),
    });
  } catch (error: any) {
    console.error("Fetch notifications error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { notificationId, markAllRead } = body;
    const userEmail = user.email.toLowerCase().trim();

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: {
          OR: [{ recipient: userEmail }, { recipient: "ALL_USERS" }],
          isRead: false,
        },
        data: { isRead: true },
      }).catch(() => {});

      return NextResponse.json({ success: true, message: "All notifications marked as read." });
    }

    if (notificationId) {
      await prisma.notification.updateMany({
        where: { id: notificationId },
        data: { isRead: true },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Server error" }, { status: 500 });
  }
}
