import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    let categories = await prisma.supportCategory.findMany({
      orderBy: { order: "asc" },
    });

    if (categories.length === 0) {
      // Seed default support categories
      const defaults = [
        { name: "Technical Support", slug: "technical-support", description: "Game crashes, graphics & performance issues", icon: "FileCode", order: 1 },
        { name: "Game Bug", slug: "game-bug", description: "Report gameplay glitches or engine bugs", icon: "Bug", order: 2 },
        { name: "Business Inquiry", slug: "business-inquiry", description: "Licensing & corporate inquiries", icon: "Building2", order: 3 },
        { name: "Publishing", slug: "publishing", description: "Game distribution & co-publishing proposals", icon: "Sparkles", order: 4 },
        { name: "Partnership", slug: "partnership", description: "Sponsorship & brand collaborations", icon: "Handshake", order: 5 },
        { name: "Investor Relations", slug: "investor-relations", description: "Financial & shareholder communications", icon: "DollarSign", order: 6 },
        { name: "Press", slug: "press", description: "Media accreditation & review keys", icon: "Newspaper", order: 7 },
        { name: "Careers", slug: "careers", description: "Recruitment & hiring inquiries", icon: "UserCheck", order: 8 },
        { name: "Feedback", slug: "feedback", description: "Player feedback & suggestions", icon: "MessageCircle", order: 9 },
        { name: "Other", slug: "other", description: "General inquiries", icon: "HelpCircle", order: 10 },
      ];

      for (const item of defaults) {
        await prisma.supportCategory.upsert({
          where: { slug: item.slug },
          update: {},
          create: item,
        });
      }

      categories = await prisma.supportCategory.findMany({
        orderBy: { order: "asc" },
      });
    }

    return NextResponse.json({ success: true, categories });
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
    if (!can(auth.user, "crm.manage") && !can(auth.user, "settings.manage")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires crm.manage permission." }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, icon, order, active } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const category = await prisma.supportCategory.upsert({
      where: { slug },
      update: {
        name,
        description: description || null,
        icon: icon || "HelpCircle",
        order: Number(order) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
      create: {
        name,
        slug,
        description: description || null,
        icon: icon || "HelpCircle",
        order: Number(order) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "UPSERT_SUPPORT_CATEGORY",
        resource: "CRM",
        details: `Saved Support Category: ${name}`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({ success: true, category });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }
    if (!can(auth.user, "crm.manage") && !can(auth.user, "settings.manage")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires crm.manage permission." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
    }

    await prisma.supportCategory.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: auth.user.id,
        userEmail: auth.user.email,
        action: "DELETE_SUPPORT_CATEGORY",
        resource: "CRM",
        details: `Deleted Support Category ${id}`,
      },
    }).catch((e) => console.warn("AuditLog warning:", e));

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
