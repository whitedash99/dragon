import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireProtectedOwner } from "@/lib/auth/owner-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const guard = await requireProtectedOwner();
  if (!guard.authorized) return guard.response;

  try {
    const body = await req.json();
    const { dataset, format } = body;

    if (!dataset) {
      return NextResponse.json({ success: false, error: "Dataset name is required" }, { status: 400 });
    }

    let records: Record<string, unknown>[] = [];
    const exportFormat = format === "csv" ? "csv" : "json";

    if (dataset === "Users" || dataset === "users") {
      const list = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isProtected: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      records = list;
    } else if (dataset === "TeamApplications" || dataset === "teamapplications") {
      const list = await prisma.teamApplication.findMany({
        select: {
          id: true,
          applicationNumber: true,
          jobTitle: true,
          applicantName: true,
          applicantEmail: true,
          phone: true,
          country: true,
          primarySkill: true,
          experience: true,
          status: true,
          createdAt: true,
        },
      });
      records = list;
    } else if (dataset === "ContactTickets" || dataset === "contacttickets") {
      const list = await prisma.contactTicket.findMany({
        select: {
          id: true,
          ticketId: true,
          name: true,
          email: true,
          category: true,
          subject: true,
          priority: true,
          status: true,
          createdAt: true,
        },
      });
      records = list;
    } else if (dataset === "Tickets" || dataset === "tickets") {
      const list = await prisma.ticket.findMany({
        select: {
          id: true,
          ticketId: true,
          customerName: true,
          customerEmail: true,
          category: true,
          subject: true,
          priority: true,
          status: true,
          assignedAgent: true,
          createdAt: true,
        },
      });
      records = list;
    } else if (dataset === "AuditLogs" || dataset === "auditlogs") {
      const list = await prisma.auditLog.findMany({
        take: 1000,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          userId: true,
          userEmail: true,
          action: "action" as never,
          resource: true,
          details: true,
          ipAddress: true,
          createdAt: true,
        },
      });
      records = list;
    } else if (dataset === "AnalyticsEvents" || dataset === "analyticsevents") {
      const list = await prisma.analyticsEvent.findMany({
        take: 2000,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          event: true,
          category: true,
          userEmail: true,
          ipAddress: true,
          createdAt: true,
        },
      });
      records = list;
    } else {
      return NextResponse.json({ success: false, error: `Dataset [${dataset}] is not eligible for export.` }, { status: 400 });
    }

    await prisma.auditLog.create({
      data: {
        userId: guard.user.id,
        userEmail: guard.user.email,
        action: "EXPORT_DATASET",
        resource: "DATA_CONTROL",
        details: `Owner ${guard.user.email} exported dataset [${dataset}] (${records.length} records, format: ${exportFormat.toUpperCase()}).`,
      },
    }).catch((e) => console.warn("AuditLog error:", e));

    if (exportFormat === "csv") {
      if (records.length === 0) {
        return new Response("No records found", {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="dragon_${dataset}_export.csv"`,
          },
        });
      }
      const headers = Object.keys(records[0]).join(",");
      const rows = records.map((r) => Object.values(r).map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","));
      const csvContent = [headers, ...rows].join("\n");

      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="dragon_${dataset}_export_${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      exportMeta: {
        dataset,
        format: exportFormat,
        recordCount: records.length,
        exportedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      records,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
