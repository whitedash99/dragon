import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { createdAt: "desc" },
    });

    const devHubData = {
      projects: games.map((g) => ({
        id: g.id,
        title: g.title,
        slug: g.slug,
        status: g.status || "In Development",
        genre: g.genre,
        platforms: g.platforms,
        year: g.year,
        version: "v1.4.2-rc",
        buildCount: 28,
        activeBugsCount: 3,
        qaPassRate: "98.4%",
      })),
      recentBuilds: [
        { id: "b1", project: "Embers of Valyria", version: "v0.8.4-prealpha", platform: "Windows / Steam", status: "PASSED", size: "48.2 GB", date: "2026-08-01" },
        { id: "b2", project: "Neon Drift: Overdrive", version: "v1.2.0-beta", platform: "PS5 / Xbox Series X", status: "BUILDING", size: "32.1 GB", date: "2026-08-01" },
        { id: "b3", project: "Blacksite Zero", version: "v2.0.1-hotfix", platform: "Windows / Epic", status: "DEPLOYED", size: "18.6 GB", date: "2026-07-30" },
      ],
      activeBugs: [
        { id: "BUG-104", project: "Embers of Valyria", title: "Volumetric fog shadow flicker in DX12 renderer", severity: "HIGH", status: "IN_PROGRESS", assignee: "Alex (Engine Lead)" },
        { id: "BUG-108", project: "Neon Drift", title: "Gamepad haptic feedback latency on DualSense", severity: "NORMAL", status: "OPEN", assignee: "Priya (Input Dev)" },
        { id: "BUG-112", project: "Blacksite Zero", title: "Netcode packet loss during 64-player server tick", severity: "CRITICAL", status: "IN_PROGRESS", assignee: "Devon (Netcode Spec)" },
      ],
      sprintKanban: [
        { id: "task-1", title: "Implement Dragon Engine 4K DLSS 3.5 Frame Generation", status: "IN_PROGRESS", priority: "HIGH" },
        { id: "task-2", title: "Optimize PhysX 5 cloth simulation memory pool", status: "CODE_REVIEW", priority: "NORMAL" },
        { id: "task-3", title: "Audit Vulkan shader compilation pipeline on Linux", status: "BACKLOG", priority: "NORMAL" },
        { id: "task-4", title: "Integrate Spatial 3D Audio HRTF binaural renderer", status: "TESTING", priority: "HIGH" },
      ],
    };

    return NextResponse.json({ success: true, devhub: devHubData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, title, project, severity, assignee, description } = body;

    if (action === "create_bug") {
      await prisma.auditLog.create({
        data: {
          action: "DEVHUB_CREATE_BUG",
          userEmail: "Admin Developer",
          details: `Filed bug for ${project || "Game"}: ${title} (${severity}) assigned to ${assignee}`,
        },
      });
      return NextResponse.json({ success: true, message: "Bug ticket logged successfully." });
    }

    if (action === "trigger_build") {
      await prisma.auditLog.create({
        data: {
          action: "DEVHUB_TRIGGER_BUILD",
          userEmail: "Admin Developer",
          details: `Triggered automated CI/CD build matrix for ${project}`,
        },
      });
      return NextResponse.json({ success: true, message: "Automated build pipeline triggered." });
    }

    return NextResponse.json({ success: true, message: "DevHub action processed." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
