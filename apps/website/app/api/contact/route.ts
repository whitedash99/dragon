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

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid Email Address is required." }, { status: 400 });
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return NextResponse.json({ error: "Subject is required and must be at least 3 characters." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json({ error: "Message body is required and must be at least 5 characters." }, { status: 400 });
    }

    // 3. Email Security Validation (MX & Disposable Domain Detection)
    const emailSec = validateEmailSecurity(email);
    if (!emailSec.isValid) {
      return NextResponse.json({ error: emailSec.reason || "Invalid or disposable email address." }, { status: 400 });
    }

    const targetEmail = email.trim().toLowerCase();

    // Extract User Metadata
    const ipHeader = req.headers.get("x-client-ip") || req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const clientIp = ipHeader.split(",")[0].trim();
    const userAgent = req.headers.get("user-agent") || null;
    const parsedUa = parseUserAgent(userAgent);
    const clientCountry = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "Global";
    const clientLanguage = language || req.headers.get("accept-language")?.split(",")[0] || "en-US";
    const clientTimezone = timezone || "UTC";

    // 4. Run AI Contact Processor Engine for Urgency & Categorization
    const aiResult = analyzeContactSubmission({
      name: name.trim(),
      email: targetEmail,
      company: company ? String(company).trim() : null,
      category: category ? String(category).trim() : "Technical Support",
      subject: subject.trim(),
      message: message.trim(),
    });

    // 5. Generate authentic ticket ID & tracking token
    const currentYear = new Date().getFullYear();
    const timeSeq = Date.now().toString().slice(-6) + Math.floor(10 + Math.random() * 90);
    const ticketId = `DRG-${currentYear}-${timeSeq}`;
    const trackingToken = crypto.randomBytes(16).toString("hex");
    const baseUrl = process.env.NEXTAUTH_URL || siteConfig.url || "https://dragongamingstudios.vercel.app";
    const generatedTrackingUrl = `${baseUrl}/support/${ticketId}?token=${trackingToken}`;

    // 6. Resilient Primary Ticket Creation (ContactTicket)
    const createdTicket = await prisma.contactTicket.create({
      data: {
        ticketId,
        trackingToken,
        name: name.trim(),
        email: targetEmail,
        company: company ? String(company).trim() : null,
        phone: phone ? String(phone).trim() : null,
        category: category || aiResult.category || "Technical Support",
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
        aiKeywords: aiResult.keywords ? aiResult.keywords.join(", ") : null,
        aiTags: aiResult.tags ? aiResult.tags.join(", ") : "Inbound",
        estimatedResponse: "Within 24 Hours",
      },
    });

    // 7. Non-blocking mirror Ticket creation
    let mirrorTicket: any = null;
    try {
      mirrorTicket = await prisma.ticket.create({
        data: {
          ticketId,
          customerName: name.trim(),
          customerEmail: targetEmail,
          category: category || aiResult.category || "Technical Support",
          subject: subject.trim(),
          description: message.trim(),
          priority: aiResult.urgency || "NORMAL",
          status: "OPEN",
          source: "PUBLIC_CONTACT_FORM",
          createdByType: "CUSTOMER",
          legacyContactTicketId: createdTicket.id,
          tags: aiResult.tags ? aiResult.tags.join(", ") : "Inbound",
        },
      });

      if (mirrorTicket?.id) {
        await prisma.ticketActivity.create({
          data: {
            ticketId: mirrorTicket.id,
            action: "TICKET_CREATED",
            details: `Ticket ${ticketId} created via Enterprise Support Desk from IP ${clientIp} (${clientCountry})`,
            performer: name.trim(),
          },
        }).catch((e) => console.warn("TicketActivity logging warning:", e));
      }
    } catch (mirrorErr) {
      console.warn("Mirror Ticket write warning (non-fatal):", mirrorErr);
    }

    // 8. Notifications Logging
    await prisma.adminNotification.create({
      data: {
        title: `New Support Ticket ${ticketId}`,
        message: `${name.trim()} submitted inquiry: "${subject.trim()}"`,
        type: "TICKET_CREATED",
        ticketId,
      },
    }).catch((e) => console.warn("AdminNotification creation warning:", e));

    await prisma.notification.create({
      data: {
        title: `Support Ticket Received: ${ticketId}`,
        message: `Your inquiry "${subject.trim()}" has been received. Your response will be delivered shortly via email and dashboard.`,
        type: "TICKET_CREATED",
        recipient: targetEmail,
        channel: "IN_APP",
      },
    }).catch((e) => console.warn("Notification creation warning:", e));

    // 9. Dispatch Email Notifications asynchronously (Never blocks user response)
    sendEnterpriseEmail({
      ticketId: createdTicket.ticketId,
      name: createdTicket.name,
      email: createdTicket.email,
      company: createdTicket.company,
      phone: createdTicket.phone,
      category: createdTicket.category,
      subject: createdTicket.subject,
      message: createdTicket.message,
      priority: createdTicket.priority,
      status: "OPEN",
      slaTarget: "Within 24 Hours",
      trackingUrl: generatedTrackingUrl,
      clientIp: createdTicket.ipAddress || "127.0.0.1",
      clientCountry: createdTicket.country || "Global",
      browser: createdTicket.browser || "Web",
      os: createdTicket.os || "OS",
      createdAt: createdTicket.createdAt,
    }).catch((err) => {
      console.error("Email dispatch warning:", err);
    });

    return NextResponse.json({
      success: true,
      ticketId: createdTicket.ticketId,
      trackingToken: createdTicket.trackingToken,
      trackingUrl: generatedTrackingUrl,
      estimatedResponse: "Within 24 Hours",
      message: "Support ticket created successfully! An email confirmation with your ticket ID and live tracking link has been dispatched.",
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Support Ticket Submission API Error:", error);
    return NextResponse.json({ error: "Internal server error while creating ticket: " + message }, { status: 500 });
  }
}