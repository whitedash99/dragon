import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { generateGeminiText } from "@/lib/ai/gemini";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      campaigns,
      audiences,
      promotions,
      emailCampaigns,
      totalUsers,
      totalPlayers,
      totalStaff,
      totalEmailLogs,
    ] = await Promise.all([
      prisma.campaign.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.audienceSegment.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.promotion.findMany({
        orderBy: { createdAt: "desc" },
      }),
      prisma.emailCampaign.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.user.count({ where: { isDeleted: false } }),
      prisma.user.count({ where: { isDeleted: false, role: { in: ["USER", "PLAYER"] } } }),
      prisma.user.count({ where: { isDeleted: false, role: { notIn: ["USER", "PLAYER"] } } }),
      prisma.emailLog.count(),
    ]);

    const activeCampaignsCount = campaigns.filter((c) => c.status === "ACTIVE").length;

    return NextResponse.json({
      success: true,
      telemetry: {
        totalUsers,
        totalPlayers,
        totalStaff,
        activeCampaigns: activeCampaignsCount,
        totalDispatches: totalEmailLogs,
      },
      campaigns,
      audiences,
      promotions,
      emailCampaigns,
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
    if (!can(auth.user, "settings.manage") && !can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires settings.manage permission." }, { status: 403 });
    }

    const body = await req.json();
    const { action, name, type, audience, topic, targetAudience, code, discount } = body;

    // 1. Create Campaign
    if (action === "create_campaign" && name) {
      const campaign = await prisma.campaign.create({
        data: {
          name,
          type: type || "Product Launch",
          audience: audience || "All Active Players",
          status: "ACTIVE",
          reach: 0,
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "CREATE_MARKETING_CAMPAIGN",
          resource: "MARKETING",
          details: `Created Campaign: ${name}`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));

      return NextResponse.json({ success: true, campaign });
    }

    // 2. AI Copywriting Generator with Gemini 2.5
    if (action === "ai_copywriting" && topic) {
      const prompt = `Generate compelling 3D & 2D gaming marketing copy for: "${topic}". Include:\n1. Catchy Headline\n2. Call to Action (CTA)\n3. Email Subject Line\n4. 2-sentence Ad Copy for Social Media.`;
      const systemInstruction = `You are the Lead Marketing & Copywriting AI for Dragon Studios Game Franchise. Target Audience: ${targetAudience || "Gamers"}.`;

      const generatedCopy = await generateGeminiText({ prompt, systemInstruction });

      return NextResponse.json({ success: true, copy: generatedCopy });
    }

    // 3. Create Discount Promotion
    if (action === "create_promotion" && code) {
      const promo = await prisma.promotion.create({
        data: {
          code: code.toUpperCase(),
          discount: discount || "25% OFF",
          status: "ACTIVE",
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: auth.user.id,
          userEmail: auth.user.email,
          action: "CREATE_PROMOTION",
          resource: "MARKETING",
          details: `Created Promotion Code: ${code.toUpperCase()} (${discount || "25% OFF"})`,
        },
      }).catch((e) => console.warn("AuditLog warning:", e));

      return NextResponse.json({ success: true, promotion: promo });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
