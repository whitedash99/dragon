import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") || "player@dragonstudios.com";

    // 1. Fetch Customer Profile or Fallback
    const profile = await prisma.customerProfile.findUnique({
      where: { email },
    });

    // 2. Fetch Customer Support Tickets from CRM Database
    const tickets = await prisma.contactTicket.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    // 3. Fetch Knowledge Base Articles
    const articles = await prisma.knowledgeArticle.findMany({
      orderBy: { views: "desc" },
      take: 6,
    });

    return NextResponse.json({
      success: true,
      profile: profile || {
        email,
        name: "Enterprise Player",
        language: "English",
        timezone: "UTC-5 (Eastern Time)",
      },
      tickets,
      knowledgeBase: articles.length > 0 ? articles : [
        { id: "1", slug: "account-security-mfa", title: "Configuring Multi-Factor Authentication (MFA)", category: "Account & Security", helpful: 142, views: 1250 },
        { id: "2", slug: "game-installation-troubleshooting", title: "Dragon Engine Launcher Installation Troubleshooting", category: "Technical Support", helpful: 98, views: 890 },
        { id: "3", slug: "billing-refund-policy", title: "Dragon Pass Billing & Store Refund Guidelines", category: "Billing & Purchases", helpful: 210, views: 2400 },
      ],
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, name, email, category, subject, message, priority, ticketId, replyMessage } = body;

    // 1. Create New Support Ticket (Pushes directly to CRM ContactTicket)
    if (action === "create_ticket" && subject && message) {
      const generatedTicketId = `DRG-${Math.floor(100000 + Math.random() * 900000)}`;

      const newTicket = await prisma.contactTicket.create({
        data: {
          ticketId: generatedTicketId,
          name: name || "Customer Player",
          email: email || "player@dragonstudios.com",
          category: category || "Technical Support",
          subject,
          message,
          priority: priority || "NORMAL",
          status: "OPEN",
          estimatedResponse: "Within 12 Hours",
        },
      });

      await prisma.ticketMessage.create({
        data: {
          ticketId: generatedTicketId,
          sender: "CUSTOMER",
          senderName: name || "Customer Player",
          message,
        },
      });

      return NextResponse.json({ success: true, ticket: newTicket });
    }

    // 2. Reply to Existing Support Ticket
    if (action === "reply_ticket" && ticketId && replyMessage) {
      const msg = await prisma.ticketMessage.create({
        data: {
          ticketId,
          sender: "CUSTOMER",
          senderName: name || "Customer Player",
          message: replyMessage,
        },
      });

      await prisma.contactTicket.update({
        where: { ticketId },
        data: {
          status: "OPEN",
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, message: msg });
    }

    return NextResponse.json({ success: false, error: "Invalid request payload" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
