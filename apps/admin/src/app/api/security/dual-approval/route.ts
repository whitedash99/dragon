import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !["FOUNDER", "CO_FOUNDER", "SUPER_ADMIN", "BREAK_GLASS"].includes(auth.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 403 });
    }

    const requests = await prisma.dualApproval.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        requestedBy: { select: { id: true, name: true, email: true, role: true } },
        confirmations: {
          include: {
            confirmedBy: { select: { id: true, name: true, email: true, role: true } },
          },
        },
      },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !["FOUNDER", "CO_FOUNDER", "SUPER_ADMIN", "BREAK_GLASS"].includes(auth.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Requires Executive privileges." }, { status: 403 });
    }

    const body = await req.json();
    const { action, resource, payload } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: "Action is required" }, { status: 400 });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const request = await prisma.dualApproval.create({
      data: {
        action,
        resource: resource || "DATABASE",
        payload: typeof payload === "string" ? payload : JSON.stringify(payload || {}),
        requestedById: auth.user.id,
        expiresAt,
        confirmations: {
          create: {
            confirmedById: auth.user.id,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "REQUEST_DUAL_APPROVAL",
        resource: action,
        details: `Dual Approval requested for ${action} by ${auth.user.role}`,
      },
    });

    return NextResponse.json({ success: true, message: `Dual Approval request created for ${action}. Pending second executive confirmation.`, request });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth || !["FOUNDER", "CO_FOUNDER", "BREAK_GLASS"].includes(auth.user.role)) {
      return NextResponse.json({ success: false, error: "Unauthorized. Only Founder, Co-Founder, or Break Glass can confirm Dual Approval requests." }, { status: 403 });
    }

    const body = await req.json();
    const { requestId, approve } = body;

    if (!requestId) {
      return NextResponse.json({ success: false, error: "RequestId is required" }, { status: 400 });
    }

    const request = await prisma.dualApproval.findUnique({
      where: { id: requestId },
      include: { confirmations: true },
    });

    if (!request || request.status !== "PENDING" || request.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: "Request invalid, expired, or already processed." }, { status: 400 });
    }

    if (approve === false) {
      await prisma.dualApproval.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ success: true, message: "Dual Approval request rejected." });
    }

    // Add confirmation
    await prisma.dualApprovalConfirmed.upsert({
      where: {
        dualApprovalId_confirmedById: {
          dualApprovalId: requestId,
          confirmedById: auth.user.id,
        },
      },
      update: { confirmedAt: new Date() },
      create: {
        dualApprovalId: requestId,
        confirmedById: auth.user.id,
      },
    });

    const updated = await prisma.dualApproval.findUnique({
      where: { id: requestId },
      include: { confirmations: true },
    });

    const count = updated?.confirmations.length || 0;
    const isReady = count >= 2;

    if (isReady) {
      await prisma.dualApproval.update({
        where: { id: requestId },
        data: { status: "APPROVED" },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "CONFIRM_DUAL_APPROVAL",
        resource: request.action,
        details: `Executive ${auth.user.email} confirmed dual approval request. Status: ${isReady ? "APPROVED" : "PENDING_2ND"}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: isReady ? "Dual Approval confirmed! Action approved for execution." : "Confirmation recorded. Awaiting 2nd executive approval.",
      isFullyApproved: isReady,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
