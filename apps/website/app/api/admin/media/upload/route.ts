import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "General";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided in request." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prepare uploads directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "assets");
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/assets/${filename}`;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const formattedSize = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${(file.size / 1024).toFixed(0)} KB`;
    const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";

    // Save to PostgreSQL via Prisma
    const asset = await prisma.mediaAsset.create({
      data: {
        name: file.name,
        size: formattedSize,
        type: ext,
        url: fileUrl,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPLOAD_MEDIA_ASSET",
        userEmail: "Admin",
        details: `Uploaded asset: ${asset.name} (${formattedSize}) to folder: ${folder}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Asset uploaded successfully.",
      asset,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Media Upload API Error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
