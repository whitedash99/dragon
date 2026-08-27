import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const vercelToken = process.env.VERCEL_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;
    const vercelTeamId = process.env.VERCEL_TEAM_ID;
    const isVercelConnected = Boolean(vercelToken && vercelProjectId);

    let vercelDeployments: Array<{
      id: string;
      app: string;
      domain: string;
      environment: string;
      target: string;
      status: string;
      commit?: string;
      updatedAt: string;
      url?: string;
    }> = [];

    if (isVercelConnected) {
      try {
        const teamParam = vercelTeamId ? `&teamId=${vercelTeamId}` : "";
        const res = await fetch(
          `https://api.vercel.com/v6/deployments?projectId=${vercelProjectId}&limit=10${teamParam}`,
          {
            headers: {
              Authorization: `Bearer ${vercelToken}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.deployments)) {
            vercelDeployments = data.deployments.map((d: any) => ({
              id: d.uid || d.id,
              app: d.name || "Dragon Studios",
              domain: d.url ? `https://${d.url}` : "Vercel Edge",
              environment: d.target === "production" ? "Production" : "Preview",
              target: "Vercel Edge",
              status: d.state || "READY",
              commit: d.meta?.githubCommitMessage || d.meta?.gitlabCommitMessage || "Production Build",
              updatedAt: new Date(d.createdAt || d.created).toLocaleDateString(),
              url: d.url ? `https://${d.url}` : undefined,
            }));
          }
        }
      } catch (fetchErr) {
        console.warn("Vercel API fetch warning:", fetchErr);
      }
    }

    // Also fetch recorded deployment history in PostgreSQL DB
    const dbDeployments = await prisma.cloudDeployment.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const hasDeployHook = Boolean(process.env.VERCEL_DEPLOY_HOOK_URL);

    return NextResponse.json({
      success: true,
      connected: isVercelConnected || hasDeployHook,
      provider: isVercelConnected ? "Vercel API" : hasDeployHook ? "Vercel Deploy Hook" : "Not Connected",
      message: isVercelConnected || hasDeployHook 
        ? "Deployment provider connected." 
        : "Deployment provider not connected. Set VERCEL_TOKEN / VERCEL_DEPLOY_HOOK_URL in environment variables to manage live builds.",
      deployments: vercelDeployments.length > 0 ? vercelDeployments : dbDeployments.map((d) => ({
        id: d.id,
        app: "Dragon Studios",
        domain: "dragongamingstudios.vercel.app",
        environment: "Production",
        target: "Vercel Edge",
        status: d.status,
        commit: `${d.version} (${d.commit || "main"})`,
        updatedAt: new Date(d.createdAt).toLocaleDateString(),
      })),
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
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    if (!can(auth.user, "settings.manage") && !can(auth.user, "security.manage")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires settings.manage permission." }, { status: 403 });
    }

    const body = await req.json();
    const { action } = body;

    // Trigger real Vercel Deploy Hook if configured
    if (action === "trigger_deploy") {
      const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
      if (!hookUrl) {
        return NextResponse.json(
          {
            success: false,
            error: "Deployment provider not connected: VERCEL_DEPLOY_HOOK_URL is not configured in environment variables.",
          },
          { status: 400 }
        );
      }

      const hookRes = await fetch(hookUrl, { method: "POST" });
      if (!hookRes.ok) {
        return NextResponse.json(
          {
            success: false,
            error: `Vercel Deploy Hook returned status ${hookRes.status}`,
          },
          { status: 502 }
        );
      }

      const deploy = await prisma.cloudDeployment.create({
        data: {
          version: `Release-${new Date().toISOString().slice(0, 10)}`,
          branch: "main",
          status: "TRIGGERED",
          deployedBy: auth.user.email,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "TRIGGER_PRODUCTION_DEPLOYMENT",
          resource: "DEPLOYMENTS",
          details: `Triggered real Vercel deploy hook for production build.`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));

      return NextResponse.json({ success: true, deployment: deploy, message: "Production deployment triggered successfully via Vercel Deploy Hook." });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
