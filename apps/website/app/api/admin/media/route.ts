import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all media assets with filter & search
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const typeFilter = searchParams.get("type") || "All";

    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
    });

    const filtered = assets.filter((a) => {
      const matchesSearch = !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.type.toLowerCase().includes(q.toLowerCase());
      const matchesType = typeFilter === "All" || (
        typeFilter === "Images" ? ["PNG", "JPG", "JPEG", "WEBP", "SVG", "AVIF", "GIF"].includes(a.type.toUpperCase()) :
        typeFilter === "Videos" ? ["MP4", "WEBM", "MOV", "AVI", "MKV"].includes(a.type.toUpperCase()) :
        typeFilter === "Audio" ? ["MP3", "WAV", "OGG", "FLAC"].includes(a.type.toUpperCase()) :
        typeFilter === "3D Assets" ? ["FBX", "OBJ", "GLTF", "GLB", "BLEND"].includes(a.type.toUpperCase()) :
        typeFilter === "Documents" ? ["PDF", "ZIP", "DOCX", "TXT", "RAW"].includes(a.type.toUpperCase()) : true
      );
      return matchesSearch && matchesType;
    });

    return NextResponse.json({ success: true, assets: filtered });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, assets: [] }, { status: 500 });
  }
}

// DELETE: Delete asset from PostgreSQL
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Asset ID is required" }, { status: 400 });
    }

    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return NextResponse.json({ success: false, error: "Asset not found" }, { status: 404 });
    }

    await prisma.mediaAsset.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_MEDIA_ASSET",
        userEmail: "Admin",
        details: `Deleted asset: ${asset.name} (${asset.url})`,
      },
    }).catch(() => {});

    return NextResponse.json({ success: true, message: "Asset deleted successfully." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
