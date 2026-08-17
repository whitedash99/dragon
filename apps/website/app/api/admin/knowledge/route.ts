import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "All";

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });

    const docItems = [
      { id: "doc-1", title: "Dragon Engine 4.0 Vulkan Render Architecture", category: "Engineering Docs", readTime: "8 min read", author: "Alex (Engine Lead)", featured: true, excerpt: "Detailed specification of Vulkan 1.3 frame graphs, hardware ray-tracing BVH traversal, and DLSS 3.5 integration." },
      { id: "doc-2", title: "Embers of Valyria: World & Quest Design Bible", category: "Game Design Documents", readTime: "12 min read", author: "Elena (Lead Narrative)", featured: true, excerpt: "Core lore, faction hierarchy, open-world event triggers, and quest branching logic." },
      { id: "doc-3", title: "DragonID Session & Security Protocol Specification", category: "API Documentation", readTime: "6 min read", author: "Security Engineering", featured: false, excerpt: "Authentication flow, HTTP-only session cookies, rate limiting, and RBAC permission checks." },
      { id: "doc-4", title: "Dragon Studios Employee Onboarding & Workplace Standards", category: "HR Documents", readTime: "5 min read", author: "HR Leadership", featured: false, excerpt: "Remote work policies, studio benefits, equipment provisioning, and security compliance." },
    ];

    const filtered = docItems.filter((item) => {
      const matchesSearch = !q || item.title.toLowerCase().includes(q.toLowerCase()) || item.excerpt.toLowerCase().includes(q.toLowerCase());
      const matchesCategory = category === "All" || item.category === category;
      return matchesSearch && matchesCategory;
    });

    return NextResponse.json({ success: true, knowledge: filtered, articles });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, excerpt, readTime, author } = body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newDoc = await prisma.article.create({
      data: {
        title,
        slug: `${slug}-${Date.now()}`,
        excerpt: excerpt || title,
        tag: category || "Engineering Docs",
        readTime: readTime || "5 min read",
        author: author || "Dragon Editorial",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_KNOWLEDGE_DOC",
        userEmail: "Admin",
        details: `Published Knowledge Doc: ${newDoc.title} (${newDoc.tag})`,
      },
    });

    return NextResponse.json({ success: true, doc: newDoc });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
