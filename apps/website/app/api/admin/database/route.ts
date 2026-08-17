import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      gamesCount,
      articlesCount,
      usersCount,
      ticketsCount,
      ticketMessagesCount,
      verificationTokensCount,
      teamMembersCount,
      jobPostingsCount,
      mediaItemsCount,
      systemSettingsCount,
      pressReleasesCount,
      auditLogsCount,
      contentBlocksCount,
    ] = await Promise.all([
      prisma.game.count(),
      prisma.article.count(),
      prisma.user.count(),
      prisma.contactTicket.count(),
      prisma.ticketMessage.count(),
      prisma.contactVerificationToken.count(),
      prisma.teamMember.count(),
      prisma.career.count(),
      prisma.mediaAsset.count(),
      prisma.systemSetting.count(),
      prisma.pressRelease.count(),
      prisma.auditLog.count(),
      prisma.contentBlock.count(),
    ]);

    const tables = [
      { name: "Game", count: gamesCount, description: "AAA Game portfolio titles" },
      { name: "Article", count: articlesCount, description: "Developer logs & studio news" },
      { name: "User", count: usersCount, description: "User accounts & auth data" },
      { name: "ContactTicket", count: ticketsCount, description: "AI support tickets" },
      { name: "TicketMessage", count: ticketMessagesCount, description: "Support thread messages" },
      { name: "ContactVerificationToken", count: verificationTokensCount, description: "Email verification tokens" },
      { name: "TeamMember", count: teamMembersCount, description: "Studio roster & engineers" },
      { name: "Career", count: jobPostingsCount, description: "Career opportunities" },
      { name: "MediaAsset", count: mediaItemsCount, description: "CDN assets & media records" },
      { name: "SystemSetting", count: systemSettingsCount, description: "Configuration & secrets" },
      { name: "PressRelease", count: pressReleasesCount, description: "Official press announcements" },
      { name: "AuditLog", count: auditLogsCount, description: "Security & admin audit logs" },
      { name: "ContentBlock", count: contentBlocksCount, description: "Website CMS text blocks" },
    ];

    return NextResponse.json({ success: true, tables });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
