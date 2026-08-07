import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".pdf", ".zip", ".docx", ".txt"];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds maximum size limit of 25MB." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `File type ${ext} is not allowed. Supported: PNG, JPEG, ZIP, PDF, DOCX, TXT.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads/attachments/
    const uploadDir = path.join(process.cwd(), "public", "uploads", "attachments");
    await mkdir(uploadDir, { recursive: true });

    const safeHash = crypto.randomBytes(8).toString("hex");
    const safeFilename = `${Date.now()}_${safeHash}${ext}`;
    const filePath = path.join(uploadDir, safeFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/attachments/${safeFilename}`;

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type || ext,
        url: publicUrl,
      },
    });
  } catch (error: any) {
    console.error("Attachment Upload Error:", error);
    return NextResponse.json({ error: "Failed to process file upload." }, { status: 500 });
  }
}
