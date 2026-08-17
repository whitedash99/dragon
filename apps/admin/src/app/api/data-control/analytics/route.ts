import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { requireProtectedOwner } from "@/lib/auth/owner-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = await requireProtectedOwner();
  if (!guard.authorized) return guard.response;

  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";

    let startDate: Date | undefined;
    const now = new Date();

    if (range === "today") {
      startDate = new Date(now.setHours(0, 0, 0, 0));
    } else if (range === "7d") {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "30d") {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === "90d") {
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    } else if (range === "1y") {
      startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    }

    const whereClause = startDate ? { createdAt: { gte: startDate } } : {};

    const [events, sessionsCount, visitorsCount] = await Promise.all([
      prisma.analyticsEvent.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: 500,
      }),
      prisma.analyticsSession.count({ where: whereClause }).catch(() => 0),
      prisma.visitor.count().catch(() => 0),
    ]);

    // Aggregate real metrics
    const totalEvents = events.length;
    const pageViews = events.filter((e) => e.event === "PAGE_VIEW").length;
    const careerViews = events.filter((e) => e.event === "CAREER_VIEW").length;
    const careerApplications = events.filter((e) => e.event === "CAREER_APPLICATION").length;
    const contactSubmissions = events.filter((e) => e.event === "CONTACT_SUBMISSION").length;
    const downloads = events.filter((e) => e.event === "DOWNLOAD").length;
    const gameViews = events.filter((e) => e.event === "GAME_VIEW").length;

    // Breakdown maps
    const eventCounts: Record<string, number> = {};
    const popularPages: Record<string, number> = {};
    const trafficSources: Record<string, number> = {};

    events.forEach((e) => {
      eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;

      if (e.metadata) {
        try {
          const meta = JSON.parse(e.metadata);
          if (meta.path || meta.url) {
            const page = meta.path || meta.url;
            popularPages[page] = (popularPages[page] || 0) + 1;
          }
          if (meta.referrer || meta.source) {
            const src = meta.referrer || meta.source;
            trafficSources[src] = (trafficSources[src] || 0) + 1;
          }
        } catch {
          // ignore non-json metadata
        }
      }
    });

    return NextResponse.json({
      success: true,
      timeRange: range,
      telemetry: {
        totalEvents,
        pageViews,
        uniqueVisitors: visitorsCount,
        sessionsCount,
        careerViews,
        careerApplications,
        contactSubmissions,
        downloads,
        gameViews,
      },
      eventCounts,
      popularPages,
      trafficSources,
      recentEvents: events.slice(0, 30).map((e) => ({
        id: e.id,
        event: e.event,
        category: e.category,
        userEmail: e.userEmail || "Visitor",
        ipAddress: e.ipAddress || "127.0.0.1",
        metadata: e.metadata,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal database error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
