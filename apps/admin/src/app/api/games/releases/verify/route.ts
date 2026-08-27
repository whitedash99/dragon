import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";
import { VerifyUploadSchema } from "@dragon/validation";
import { verifyB2Object } from "@dragon/storage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (!can(auth.user, "games.manage") && !can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires games.manage permission." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = VerifyUploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { releaseId } = parsed.data;

    const release = await prisma.gameRelease.findUnique({
      where: { id: releaseId },
    });

    if (!release) {
      return NextResponse.json({ success: false, error: "Release not found." }, { status: 404 });
    }

    // Verify object in Backblaze B2 via S3 HeadObject
    const b2Verification = await verifyB2Object({
      b2ObjectKey: release.b2ObjectKey,
      expectedSizeBytes: Number(release.fileSizeBytes),
    });

    const updated = await prisma.gameRelease.update({
      where: { id: releaseId },
      data: {
        status: "VERIFIED",
        verifiedAt: new Date(),
        fileSizeBytes: BigInt(b2Verification.actualSizeBytes),
      },
    });

    return NextResponse.json({
      success: true,
      verified: true,
      release: {
        ...updated,
        fileSizeBytes: updated.fileSizeBytes.toString(),
      },
      b2Metadata: {
        lastModified: b2Verification.lastModified,
        etag: b2Verification.etag,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
