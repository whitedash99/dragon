import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || "dragon-studio-content-secret-2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const secret = req.headers.get("x-revalidation-secret") || body.secret;

    if (secret !== REVALIDATION_SECRET) {
      return NextResponse.json({ success: false, error: "Unauthorized: Invalid revalidation token" }, { status: 401 });
    }

    const { tags, paths } = body;
    const revalidatedTags: string[] = [];
    const revalidatedPaths: string[] = [];

    // Targeted tag revalidation
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (typeof tag === "string" && tag.trim()) {
          revalidateTag(tag.trim());
          revalidatedTags.push(tag.trim());
        }
      }
    } else if (typeof tags === "string" && tags.trim()) {
      revalidateTag(tags.trim());
      revalidatedTags.push(tags.trim());
    }

    // Targeted path revalidation
    if (Array.isArray(paths)) {
      for (const p of paths) {
        if (typeof p === "string" && p.trim()) {
          revalidatePath(p.trim());
          revalidatedPaths.push(p.trim());
        }
      }
    } else if (typeof paths === "string" && paths.trim()) {
      revalidatePath(paths.trim());
      revalidatedPaths.push(paths.trim());
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      tags: revalidatedTags,
      paths: revalidatedPaths,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Revalidation error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const tag = searchParams.get("tag");
  const pathParam = searchParams.get("path");

  if (secret !== REVALIDATION_SECRET) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag);
  }
  if (pathParam) {
    revalidatePath(pathParam);
  }

  return NextResponse.json({
    success: true,
    revalidated: true,
    tag,
    path: pathParam,
    timestamp: Date.now(),
  });
}
