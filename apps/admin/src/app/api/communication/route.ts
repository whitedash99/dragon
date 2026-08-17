import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { sendEmail, buildCustomerContactConfirmationHtml } from "@dragon/email";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filterStatus = searchParams.get("status");
    const searchQuery = searchParams.get("query");

    const where: Record<string, unknown> = {};
    if (filterStatus && filterStatus !== "ALL") {
      where.status = filterStatus;
    }
    if (searchQuery) {
      where.OR = [
        { recipient: { contains: searchQuery, mode: "insensitive" } },
        { subject: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    const [emailLogs, totalCount, dispatchedCount, failedCount] = await Promise.all([
      prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { ticket: true },
      }),
      prisma.emailLog.count(),
      prisma.emailLog.count({ where: { status: "DISPATCHED" } }),
      prisma.emailLog.count({ where: { status: "FAILED" } }),
    ]);

    return NextResponse.json({
      success: true,
      telemetry: {
        totalCount,
        dispatchedCount,
        failedCount,
        deliveryRate: totalCount > 0 ? ((dispatchedCount / totalCount) * 100).toFixed(1) + "%" : "100%",
        resendStatus: process.env.RESEND_API_KEY ? "LIVE_CONNECTED" : "SANDBOX_MODE",
      },
      emailLogs,
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
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, recipient, subject, template } = body;

    if (action === "send_test_email") {
      const html = buildCustomerContactConfirmationHtml(recipient.split("@")[0] || "Team Member", "DRG-2026-TEST");
      const result = await sendEmail({
        to: recipient,
        subject: subject || "Dragon Mail System Verification Dispatch",
        html,
        type: "TEST_DISPATCH",
      });

      const log = await prisma.emailLog.create({
        data: {
          recipient,
          subject: subject || "Dragon Mail System Verification Dispatch",
          status: result.success ? "DISPATCHED" : "FAILED",
          template: template || "TEST_DISPATCH",
          providerResponse: result.messageId || "Dispatched via Resend/Sandbox",
        },
      });

      return NextResponse.json({ success: true, messageId: result.messageId, log });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
