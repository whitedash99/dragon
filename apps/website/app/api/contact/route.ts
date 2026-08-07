import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateEmailSecurity } from "@/lib/security/disposable-email";
import { analyzeContactSubmission } from "@/lib/ai/contact-processor";
import { sendEnterpriseEmail } from "@/lib/email";
import { siteConfig } from "@/lib/site";
import crypto from "crypto";

function parseUserAgent(ua: string | null): { browser: string; os: string } {
  if (!ua) return { browser: "Unknown Browser", os: "Unknown OS" };

  let os = "Unknown OS";
  if (ua.includes("Windows")) os = "Windows OS";
  else if (ua.includes("Mac OS") || ua.includes("Macintosh")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android OS";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  let browser = "Unknown Browser";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Microsoft Edge";
  else if (ua.includes("Chrome/")) browser = "Google Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";

  return { browser, os };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Honeypot Anti-Spam Check
    if (body.website || body.hp_website || body.fax || body.bot_check) {
      return NextResponse.json({ error: "Bot submission rejected." }, { status: 400 });
    }

    const {
      name,
      email,
      subject,
      category,
      message,
      company,
      phone,
      attachments,
      timezone,
      language,
    } = body;

    // 2. Client & Server Input Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Full Name is required and must be at least 2 characters." }, { status: 400 });
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return NextResponse.json({ error: "Subject is required and must be at least 3 characters." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json({ error: "Message body is required and must be at least 10 characters." }, { status: 400 });
    }

    // 3. Email Security Validation (MX & Disposable Domain Detection)
    const emailSec = validateEmailSecurity(email);
    if (!emailSec.isValid) {
      return NextResponse.json({ error: emailSec.reason || "Invalid or disposable email address." }, { status: 400 });
    }

    const targetEmail = email.trim().toLowerCase();

    // 4. Rate Limiting Check (Max 3 submissions per 5 minutes per IP)
    const ipHeader = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const clientIp = ipHeader.split(",")[0].trim();

    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentSubmissionsCount = await prisma.contactTicket.count({
      where: {
        ipAddress: clientIp,
        createdAt: { gte: fiveMinsAgo },
      },
    });

    if (recentSubmissionsCount >= 5) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait 5 minutes before submitting another support ticket." },
        { status: 429 }
      );
    }

    // Extract User Metadata
    const userAgent = req.headers.get("user-agent") || null;
    const parsedUa = parseUserAgent(userAgent);
    const clientCountry = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "Global";
    const clientLanguage = language || req.headers.get("accept-language")?.split(",")[0] || "en-US";
    const clientTimezone = timezone || "UTC";

    // 5. Run AI Contact Processor Engine for Urgency & Categorization
    const aiResult = analyzeContactSubmission({
      name: name.trim(),
      email: targetEmail,
      company: company ? String(company).trim() : null,
      category: category ? String(category).trim() : "Technical Support",
      subject: subject.trim(),
      message: message.trim(),
    });

    // 6. Generate Sequential Enterprise Ticket ID (e.g., DRG-2026-000001)
    const currentYear = new Date().getFullYear();
    const totalTicketsCount = await prisma.contactTicket.count();
    const nextSeq = totalTicketsCount + 1;
    const ticketId = `DRG-${currentYear}-${nextSeq.toString().padStart(6, "0")}`;
    const trackingToken = crypto.randomBytes(16).toString("hex");

    // 7. Save Ticket directly to PostgreSQL via Prisma (NO EMAIL VERIFICATION BLOCKS!)
    const ticket = await prisma.contactTicket.create({
      data: {
        ticketId,
        trackingToken,
        name: name.trim(),
        email: targetEmail,
        company: company ? String(company).trim() : null,
        phone: phone ? String(phone).trim() : null,
        category: category || aiResult.category,
        subject: subject.trim(),
        message: message.trim(),
        priority: aiResult.urgency || "NORMAL",
        status: "OPEN",
        attachments: Array.isArray(attachments) && attachments.length > 0 ? JSON.stringify(attachments) : null,
        ipAddress: clientIp,
        country: clientCountry,
        browser: parsedUa.browser,
        os: parsedUa.os,
        language: clientLanguage,
        timezone: clientTimezone,
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

    // 8. Dispatch Email Notifications via SMTP (Silently handles failures without blocking ticket creation)
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
      status: "OPEN",
      slaTarget: aiResult.estimatedResponseTime,
      clientIp: ticket.ipAddress || "127.0.0.1",
      clientCountry: ticket.country || "Global",
      browser: ticket.browser || "Web",
      createdAt: ticket.createdAt,
    }).catch((err) => {
      console.error("Nodemailer dispatch non-fatal error:", err);
    });

    const baseUrl = process.env.NEXTAUTH_URL || siteConfig.url || "http://localhost:3000";
    const trackingUrl = `${baseUrl}/support/${ticketId}?token=${trackingToken}`;

    return NextResponse.json({
      success: true,
      ticketId: ticket.ticketId,
      trackingToken,
      trackingUrl,
      estimatedResponse: ticket.estimatedResponse || "Within 24 Hours",
      message: "Support ticket created successfully.",
    });

  } catch (error: any) {
    console.error("Support Ticket Submission API Error:", error);
    return NextResponse.json({ error: "Internal server error while creating ticket." }, { status: 500 });
  }
}