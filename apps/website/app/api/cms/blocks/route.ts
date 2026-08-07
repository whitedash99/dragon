import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const key = searchParams.get("key");

    if (key) {
      const block = await prisma.contentBlock.findUnique({
        where: { key },
      });
      return NextResponse.json({ success: true, block }, {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
      });
    }

    const blocks = await prisma.contentBlock.findMany({
      where: category && category !== "All" ? { category } : { isPublished: true },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, blocks }, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
