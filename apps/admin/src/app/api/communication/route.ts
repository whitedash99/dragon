import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { sendEmail, buildCustomerContactConfirmationHtml } from "@dragon/email";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

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

    const [
      emailLogs,
      totalCount,
      dispatchedCount,
      failedCount,
      totalUsers,
      totalStaff,
      totalPlayers,
    ] = await Promise.all([
      prisma.emailLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { ticket: true },
      }),
      prisma.emailLog.count(),
      prisma.emailLog.count({ where: { status: "DISPATCHED" } }),
      prisma.emailLog.count({ where: { status: "FAILED" } }),
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.user.count({ where: { isDeleted: false, role: { notIn: ["USER", "PLAYER"] } } }),
      prisma.user.count({ where: { isDeleted: false, role: { in: ["USER", "PLAYER"] } } }),
    ]);

    return NextResponse.json({
      success: true,
      telemetry: {
        totalRegisteredUsers: totalUsers,
        totalStaff,
        totalPlayers,
        totalCount,
        dispatchedCount,
        failedCount,
        deliveryRate: totalCount > 0 ? ((dispatchedCount / totalCount) * 100).toFixed(1) + "%" : "100%",
        resendStatus: process.env.RESEND_API_KEY ? "LIVE_CONNECTED" : "SANDBOX_READY",
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
    const { action, recipient, subject, body: contentText, template, targetGroup } = body;

    // 1. Send Single Test Email
    if (action === "send_test_email") {
      const targetEmail = recipient || auth.user.email;
      const html = `<div style="font-family: sans-serif; padding: 20px; background: #02040A; color: #fff;">
        <h2 style="color: #00E5FF;">Dragon Studios System Verification</h2>
        <p>This is a verified test dispatch from the Dragon Control Executive Command Center.</p>
        <p><strong>Subject:</strong> ${subject || "Dragon Mail Gateway Verification"}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      </div>`;

      const result = await sendEmail({
        to: targetEmail,
        subject: subject || "Dragon Mail System Verification Dispatch",
        html,
        type: "TEST_DISPATCH",
      });

      const log = await prisma.emailLog.create({
        data: {
          recipient: targetEmail,
          subject: subject || "Dragon Mail System Verification Dispatch",
          status: result.success ? "DISPATCHED" : "FAILED",
          template: template || "TEST_DISPATCH",
          providerResponse: result.messageId || "Dispatched via Resend/SMTP",
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "DISPATCH_TEST_EMAIL",
          resource: "COMMUNICATION",
          details: `Dispatched test email to ${targetEmail}`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));

      return NextResponse.json({ success: true, messageId: result.messageId, log });
    }

    // 2. Send Broadcast to All Real Database Users
    if (action === "broadcast_dispatch") {
      if (!subject || !contentText) {
        return NextResponse.json({ success: false, error: "Subject and dispatch content are required." }, { status: 400 });
      }

      // Query real users from database
      const realUsers = await prisma.user.findMany({
        where: {
          isDeleted: false,
          ...(targetGroup === "STAFF"
            ? { role: { notIn: ["USER", "PLAYER"] } }
            : targetGroup === "PLAYERS"
            ? { role: { in: ["USER", "PLAYER"] } }
            : {}),
        },
        select: { id: true, email: true, name: true },
      });

      const recipients = realUsers.map((u) => u.email).filter(Boolean);
      let successCount = 0;
      let failCount = 0;

      // Dispatch or log each recipient
      for (const targetEmail of recipients) {
        try {
          const html = `<div style="font-family: sans-serif; padding: 24px; background: #02040A; color: #F8FAFC; border-radius: 12px;">
            <h1 style="color: #00E5FF; margin-bottom: 8px;">🐉 DRAGON GAMING STUDIOS</h1>
            <h2 style="color: #FFFFFF; font-size: 18px; margin-top: 0;">${subject}</h2>
            <div style="background: #03091D; border: 1px solid rgba(0,229,255,0.2); padding: 16px; border-radius: 8px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
              ${contentText}
            </div>
            <p style="font-size: 11px; color: #64748B; margin-top: 16px;">
              Dragon Gaming Studios Executive Broadcast • Author: ${auth.user.email}
            </p>
          </div>`;

          const sendRes = await sendEmail({
            to: targetEmail,
            subject,
            html,
            type: "ANNOUNCEMENT",
          });

          await prisma.emailLog.create({
            data: {
              recipient: targetEmail,
              subject,
              status: sendRes.success ? "DISPATCHED" : "FAILED",
              template: "BROADCAST_ANNOUNCEMENT",
              providerResponse: sendRes.messageId || "Dispatched via Dragon Gateway",
            },
          });

          if (sendRes.success) successCount++;
          else failCount++;
        } catch {
          failCount++;
        }
      }

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "STUDIO_BROADCAST_DISPATCH",
          resource: "COMMUNICATION",
          details: `Dispatched studio broadcast '${subject}' to ${recipients.length} real database accounts (Target: ${targetGroup || "ALL_USERS"})`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));

      return NextResponse.json({
        success: true,
        dispatched: successCount,
        failed: failCount,
        totalRecipients: recipients.length,
        message: `Broadcast processed for ${recipients.length} real accounts.`,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
