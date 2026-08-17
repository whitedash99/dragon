import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireProtectedOwner } from "@/lib/auth/owner-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireProtectedOwner();
  if (!guard.authorized) return guard.response;

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    if (!q.trim() || q.trim().length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const queryStr = q.trim();

    const [users, apps, tickets, contactTickets, auditLogs] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: queryStr, mode: "insensitive" } },
            { name: { contains: queryStr, mode: "insensitive" } },
            { id: queryStr },
          ],
        },
        take: 10,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isProtected: true,
          isActive: true,
          createdAt: true,
        },
      }),

      prisma.teamApplication.findMany({
        where: {
          OR: [
            { applicantEmail: { contains: queryStr, mode: "insensitive" } },
            { applicantName: { contains: queryStr, mode: "insensitive" } },
            { applicationNumber: { contains: queryStr, mode: "insensitive" } },
            { jobTitle: { contains: queryStr, mode: "insensitive" } },
          ],
        },
        take: 10,
        select: {
          id: true,
          applicationNumber: true,
          applicantName: true,
          applicantEmail: true,
          jobTitle: true,
          status: true,
          createdAt: true,
        },
      }),

      prisma.ticket.findMany({
        where: {
          OR: [
            { ticketId: { contains: queryStr, mode: "insensitive" } },
            { customerEmail: { contains: queryStr, mode: "insensitive" } },
            { customerName: { contains: queryStr, mode: "insensitive" } },
            { subject: { contains: queryStr, mode: "insensitive" } },
          ],
        },
        take: 10,
        select: {
          id: true,
          ticketId: true,
          customerName: true,
          customerEmail: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),

      prisma.contactTicket.findMany({
        where: {
          OR: [
            { ticketId: { contains: queryStr, mode: "insensitive" } },
            { email: { contains: queryStr, mode: "insensitive" } },
            { name: { contains: queryStr, mode: "insensitive" } },
            { subject: { contains: queryStr, mode: "insensitive" } },
          ],
        },
        take: 10,
        select: {
          id: true,
          ticketId: true,
          name: true,
          email: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),

      prisma.auditLog.findMany({
        where: {
          OR: [
            { userEmail: { contains: queryStr, mode: "insensitive" } },
            { action: { contains: queryStr, mode: "insensitive" } },
            { details: { contains: queryStr, mode: "insensitive" } },
          ],
        },
        take: 10,
        select: {
          id: true,
          userEmail: true,
          action: true,
          details: true,
          createdAt: true,
        },
      }),
    ]);

    const formattedResults = [
      ...users.map((u) => ({
        id: `user-${u.id}`,
        type: "User Identity",
        title: u.name || u.email,
        subtitle: `${u.role} • ${u.email}`,
        entityId: u.id,
        createdAt: u.createdAt.toISOString(),
      })),
      ...apps.map((a) => ({
        id: `app-${a.id}`,
        type: "Recruitment Application",
        title: `[${a.applicationNumber}] ${a.applicantName}`,
        subtitle: `${a.jobTitle} • ${a.applicantEmail}`,
        entityId: a.id,
        createdAt: a.createdAt.toISOString(),
      })),
      ...tickets.map((t) => ({
        id: `ticket-${t.id}`,
        type: "Admin Ticket",
        title: `[${t.ticketId}] ${t.subject}`,
        subtitle: `${t.status} • ${t.customerEmail}`,
        entityId: t.ticketId,
        createdAt: t.createdAt.toISOString(),
      })),
      ...contactTickets.map((c) => ({
        id: `contact-${c.id}`,
        type: "Contact Ticket",
        title: `[${c.ticketId}] ${c.subject}`,
        subtitle: `${c.status} • ${c.email}`,
        entityId: c.ticketId,
        createdAt: c.createdAt.toISOString(),
      })),
      ...auditLogs.map((log) => ({
        id: `audit-${log.id}`,
        type: "Audit Event",
        title: log.action,
        subtitle: `${log.userEmail || "System"} • ${log.details || ""}`,
        entityId: log.id,
        createdAt: log.createdAt.toISOString(),
      })),
    ];

    return NextResponse.json({
      success: true,
      query: queryStr,
      results: formattedResults,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
