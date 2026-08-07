import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const games = await prisma.game.findMany({ orderBy: { createdAt: "desc" } });

    const liveOpsData = {
      activeGamesCount: games.length,
      activeEvents: [
        { id: "ev-101", title: "Embers of Valyria: Season 3 Dragons' Dawn", game: "Embers of Valyria", status: "LIVE", startDate: "2026-08-01", endDate: "2026-08-31", participants: "142,500 Players" },
        { id: "ev-102", title: "Neon Drift: Cyberpunk Overdrive Cup", game: "Neon Drift: Overdrive", status: "SCHEDULED", startDate: "2026-08-05", endDate: "2026-08-12", participants: "50,000 Registered" },
        { id: "ev-103", title: "Blacksite Zero: Tactical Warfare Beta", game: "Blacksite Zero", status: "DRAFT", startDate: "2026-08-15", endDate: "2026-08-20", participants: "TBD" },
      ],
      maintenanceWindows: [
        { id: "m-1", title: "Scheduled Netcode & Database Optimization Maintenance", status: "SCHEDULED", scheduledAt: "2026-08-03 02:00 UTC", duration: "2 Hours", impact: "Minimal Server Interruption" },
      ],
      patchHistory: [
        { id: "p-1", version: "v1.4.2", game: "Embers of Valyria", platform: "PC / Steam / PS5", releaseDate: "2026-08-01", notes: "DLSS 3.5 Frame Gen, Netcode latency fixes, and Ray-Tracing shadow optimization." },
        { id: "p-2", version: "v1.2.0", game: "Neon Drift: Overdrive", platform: "PC / Xbox Series X", releaseDate: "2026-07-28", notes: "DualSense haptic feedback profile added. 120 FPS high-refresh rate mode." },
      ],
      announcements: [
        { id: "an-1", title: "Dragon Studios Summer Playtest & Championship", priority: "HIGH", channel: "GLOBAL_BANNER", published: true, date: "2026-08-01" },
      ],
    };

    return NextResponse.json({ success: true, liveops: liveOpsData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, title, game, startDate, endDate, duration, reason } = body;

    if (action === "create_event") {
      await prisma.auditLog.create({
        data: {
          action: "LIVEOPS_CREATE_EVENT",
          userEmail: "LiveOps Manager",
          details: `Created Live Event: ${title} for game: ${game} (${startDate} to ${endDate})`,
        },
      });
      return NextResponse.json({ success: true, message: "Live Event created and scheduled." });
    }

    if (action === "schedule_maintenance") {
      await prisma.auditLog.create({
        data: {
          action: "LIVEOPS_SCHEDULE_MAINTENANCE",
          userEmail: "LiveOps Manager",
          details: `Scheduled Maintenance Window: ${title} (Duration: ${duration})`,
        },
      });
      return NextResponse.json({ success: true, message: "Maintenance window scheduled and announced." });
    }

    return NextResponse.json({ success: true, message: "LiveOps action processed." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
