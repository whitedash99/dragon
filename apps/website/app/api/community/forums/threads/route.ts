import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateThreadSchema } from "@dragon/validation";

const DEFAULT_FORUM_CATEGORIES = [
  { name: "General Discussion", slug: "general", description: "General chatter, studio news, and community introductions.", icon: "MessageSquare", color: "#38bdf8", order: 1 },
  { name: "Game Discussion", slug: "games", description: "Deep dives into Embers of Valyria, Neon Drift, and Blacksite Zero.", icon: "Gamepad2", color: "#22c55e", order: 2 },
  { name: "Engine & Tech Dev", slug: "engine-dev", description: "C++ engine architecture, rollback netcode, shaders, and rendering pipelines.", icon: "Cpu", color: "#a855f7", order: 3 },
  { name: "Guides & Builds", slug: "guides", description: "Meta loadouts, frame data, and advanced mastery strategies.", icon: "BookOpen", color: "#f59e0b", order: 4 },
  { name: "Screenshots & Media", slug: "media", description: "Player photo mode, ray-traced captures, clips, and creative showcases.", icon: "Image", color: "#ec4899", order: 5 },
  { name: "Suggestions & Feedback", slug: "suggestions", description: "Propose gameplay features, UI improvements, and balance tweaks.", icon: "Lightbulb", color: "#06b6d4", order: 6 },
  { name: "Bug Reports & QA", slug: "bug-reports", description: "Report glitches, reproduction steps, and performance tickets.", icon: "AlertTriangle", color: "#ef4444", order: 7 },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const tag = searchParams.get("tag");
    const query = searchParams.get("q");

    // Ensure categories exist
    const catCount = await prisma.forumCategory.count();
    if (catCount === 0) {
      for (const cat of DEFAULT_FORUM_CATEGORIES) {
        await prisma.forumCategory.upsert({
          where: { slug: cat.slug },
          update: {},
          create: cat,
        });
      }
    }

    const categories = await prisma.forumCategory.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { threads: true } },
      },
    });

    const where: any = {};
    if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }
    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ];
    }

    const threads = await prisma.forumThread.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 50,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            image: true,
            role: true,
            department: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            color: true,
          },
        },
        _count: {
          select: { posts: true, bookmarks: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      categories,
      threads,
    });
  } catch (error: any) {
    console.error("[Forums GET Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch forum threads." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Authentication required to create forum threads." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    const parsed = CreateThreadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Invalid thread data." },
        { status: 400 }
      );
    }

    const { categoryId, title, content, tags } = parsed.data;

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const thread = await prisma.forumThread.create({
      data: {
        categoryId,
        authorId: userId,
        title: title.trim(),
        slug,
        content: content.trim(),
        tags: JSON.stringify(tags || []),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            image: true,
            role: true,
          },
        },
        category: true,
      },
    });

    return NextResponse.json({
      success: true,
      thread,
    });
  } catch (error: any) {
    console.error("[Forum Thread POST Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create forum thread." },
      { status: 500 }
    );
  }
}
