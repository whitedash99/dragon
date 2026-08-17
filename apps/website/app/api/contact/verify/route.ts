import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeContactSubmission } from "@/lib/ai/contact-processor";
import { sendEnterpriseEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ success: false, error: "Verification token is required" }, { status: 400 });
    }

    // 1. Fetch Verification Token Record
    const record = await prisma.contactVerificationToken.findUnique({
      where: { token },
    });

    if (!record) {
      return NextResponse.json({ success: false, error: "Invalid verification token." }, { status: 404 });
    }

    if (record.used) {
      return NextResponse.json({ success: false, error: "This verification token has already been used." }, { status: 410 });
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ success: false, error: "Verification token has expired (24-hour limit)." }, { status: 410 });
    }

    // 2. Mark Token as Used (One-time usage)
    await prisma.contactVerificationToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    // 3. PERMANENTLY SET emailVerified = new Date() IN DATABASE USER MODEL
    // This ensures this user/email is NEVER asked to verify again!
    await prisma.user.upsert({
      where: { email: record.email },
      update: {
        emailVerified: new Date(),
        name: record.name,
      },
      create: {
        email: record.email,
        name: record.name,
        emailVerified: new Date(),
        role: "USER",
      },
    });

    // 4. Run AI Processing Engine on Inbound Submission
    const aiResult = analyzeContactSubmission({
      name: record.name,
      email: record.email,
      company: record.company,
      category: record.category,
      subject: record.subject,
      message: record.message,
    });

    // 5. Generate Sequential Ticket ID (DRG-2026-000001, DRG-2026-000002, ...)
    const lastTicket = await prisma.contactTicket.findFirst({
      orderBy: { createdAt: "desc" },
      select: { ticketId: true },
    });

    let nextSeq = 1;
    if (lastTicket?.ticketId) {
      const match = lastTicket.ticketId.match(/DRG-\d{4}-(\d+)/);
      if (match && match[1]) {
        nextSeq = parseInt(match[1], 10) + 1;
      }
    }
    const currentYear = new Date().getFullYear();
    const ticketId = `DRG-${currentYear}-${nextSeq.toString().padStart(6, "0")}`;
    const trackingToken = crypto.randomBytes(16).toString("hex");

    // 6. Create Verified ContactTicket in PostgreSQL Database
    const ticket = await prisma.contactTicket.create({
      data: {
        ticketId,
        trackingToken,
        name: record.name,
        email: record.email,
        company: record.company,
        phone: record.phone,
        category: aiResult.category,
        subject: record.subject,
        message: record.message,
        priority: aiResult.urgency,
        status: "NEW",
        ipAddress: record.ipAddress,
        country: record.country,
        browser: record.browser,
        os: record.os,
        language: record.language,
        timezone: record.timezone,
        verifiedAt: new Date(),
        aiSummary: aiResult.summary,
        aiCategory: aiResult.category,
        aiUrgency: aiResult.urgency,
        aiSpamScore: aiResult.spamScore,
        aiSuggestedReply: aiResult.suggestedReply,
        aiKeywords: aiResult.keywords.join(", "),
        aiTags: aiResult.tags.join(", "),
        estimatedResponse: aiResult.estimatedResponseTime,
      },
    });

    // 7. Dispatch Enterprise Email Confirmations
    await sendEnterpriseEmail({
      ticketId: ticket.ticketId,
      name: ticket.name,
      email: ticket.email,
      company: ticket.company,
      phone: ticket.phone,
      category: ticket.category,
      subject: ticket.subject,
      message: ticket.message,
      priority: ticket.priority,
      status: "REGISTERED",
      slaTarget: aiResult.estimatedResponseTime,
      clientIp: ticket.ipAddress || "127.0.0.1",
      clientCountry: ticket.country || "Global",
      browser: ticket.browser || "Web",
      createdAt: ticket.createdAt,
    });

    const baseUrl = process.env.NEXTAUTH_URL || siteConfig.url || "http://localhost:3000";
    const trackingUrl = `${baseUrl}/support/${ticketId}?token=${trackingToken}`;

    return NextResponse.json({
      success: true,
      ticketId: ticket.ticketId,
      trackingToken,
      trackingUrl,
      message: "Email ownership verified successfully. Permanent verified status granted.",
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Verification API Error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
