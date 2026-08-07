import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    const assets = await prisma.mediaAsset.findMany({
      where: category && category !== "All" ? { category } : undefined,
      orderBy: { createdAt: "desc" },
    });

    const filtered = assets.filter((a) => {
      if (!q) return true;
      const matchName = a.name.toLowerCase().includes(q.toLowerCase());
      const matchType = a.type.toLowerCase().includes(q.toLowerCase());
      return matchName || matchType;
    });

    const totalFiles = assets.length;
    const imagesCount = assets.filter((a) => a.category === "Images" || a.type === "PNG" || a.type === "JPG" || a.type === "WEBP").length;
    const videosCount = assets.filter((a) => a.category === "Videos" || a.type === "MP4" || a.type === "MOV").length;
    const docsCount = assets.filter((a) => a.category === "Documents" || a.type === "PDF" || a.type === "DOCX").length;

    return NextResponse.json({
      success: true,
      assets: filtered,
      telemetry: {
        totalFiles,
        storageUsage: "1.4 GB / 100 GB",
        imagesCount,
        videosCount,
        docsCount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, size, type, category, url, altText, dimensions } = body;

    if (!name || !url) {
      return NextResponse.json({ success: false, error: "Name and URL are required" }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.create({
      data: {
        name,
        size: size || "1.2 MB",
        type: type || "PNG",
        category: category || "Images",
        url,
        altText: altText || name,
        dimensions: dimensions || "1920x1080",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_MEDIA_ASSET",
        userEmail: "Admin",
        details: `Saved Media Asset: ${asset.name} (${asset.size})`,
      },
    });

    return NextResponse.json({ success: true, asset });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Asset ID is required" }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (asset) {
      await prisma.mediaAsset.delete({ where: { id } });

      await prisma.auditLog.create({
        data: {
          action: "DELETE_MEDIA_ASSET",
          userEmail: "Admin",
          details: `Deleted Media Asset: ${asset.name}`,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Asset deleted successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
