import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const reports = await prisma.communityReport.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reporter: {
          select: { name: true, email: true },
        },
        reportedUser: {
          select: { id: true, name: true, email: true, status: true },
        },
        message: true,
        thread: true,
      },
    });

    return NextResponse.json({ success: true, reports });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch reports";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reportId, action, resolutionNote } = body;

    if (!reportId || !action) {
      return NextResponse.json({ success: false, error: "Report ID and action required" }, { status: 400 });
    }

    const report = await prisma.communityReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ success: false, error: "Report not found" }, { status: 404 });
    }

    const updated = await prisma.communityReport.update({
      where: { id: reportId },
      data: {
        status: action === "DISMISS" ? "DISMISSED" : "ACTIONED",
        resolvedById: auth.user.id,
        resolutionNote: resolutionNote || `Actioned by ${auth.user.email}: ${action}`,
      },
    });

    // If action is BAN_USER and reportedUserId exists
    if (action === "BAN_USER" && report.reportedUserId) {
      await prisma.user.update({
        where: { id: report.reportedUserId },
        data: { status: "SUSPENDED", isActive: false },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: `COMMUNITY_REPORT_${action}`,
        resource: "COMMUNITY",
        details: `Report ${reportId} ${action} by ${auth.user.email}. Note: ${resolutionNote || "None"}`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({ success: true, report: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to resolve report";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
