import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";
import { InitUploadSchema } from "@dragon/validation";
import { generatePresignedUploadUrl } from "@dragon/storage";
import { checkRateLimit } from "@dragon/utils";

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

    // Rate Limit: 20 upload inits per user per 10 minutes
    const rateLimit = checkRateLimit(`admin_upload_init_${auth.user.id}`, 20, 10 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Upload initialization rate limit exceeded. Please wait before starting another upload.",
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.retryAfterSeconds.toString(),
          },
        }
      );
    }

    const body = await req.json();
    const parsed = InitUploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const {
      gameId,
      releaseId,
      version,
      platform,
      fileName,
      fileSizeBytes,
      sha256Checksum,
      contentType,
    } = parsed.data;

    const game = await prisma.gameContent.findFirst({
      where: {
        OR: [{ id: gameId }, { slug: gameId }],
      },
    });

    if (!game) {
      return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 });
    }

    // Determine file type from extension
    const ext = fileName.split(".").pop()?.toUpperCase() || "BIN";
    let fileType = "EXE";
    if (ext === "APK") fileType = "APK";
    else if (ext === "AAB") fileType = "AAB";
    else if (ext === "ZIP") fileType = "ZIP";
    else if (ext === "MSI" || ext === "INSTALLER") fileType = "INSTALLER";

    // Generate S3 presigned PUT URL directly targeting Backblaze B2
    const presigned = await generatePresignedUploadUrl({
      gameSlug: game.slug,
      version,
      platform,
      fileName,
      fileSizeBytes,
      sha256Checksum,
      contentType: contentType || "application/octet-stream",
      expiresInSeconds: 3600, // 1 hour upload window
    });

    // Upsert release in UPLOADING status
    let release;
    if (releaseId) {
      release = await prisma.gameRelease.update({
        where: { id: releaseId },
        data: {
          version,
          platform,
          fileType,
          fileName,
          fileSizeBytes: BigInt(fileSizeBytes),
          sha256Checksum,
          b2ObjectKey: presigned.b2ObjectKey,
          b2Bucket: presigned.bucket,
          b2Region: presigned.region,
          contentType: contentType || "application/octet-stream",
          status: "UPLOADING",
          isPublished: false,
          uploadedById: auth.user.id,
        },
      });
    } else {
      release = await prisma.gameRelease.upsert({
        where: {
          gameId_version_platform: {
            gameId: game.id,
            version,
            platform,
          },
        },
        update: {
          fileType,
          fileName,
          fileSizeBytes: BigInt(fileSizeBytes),
          sha256Checksum,
          b2ObjectKey: presigned.b2ObjectKey,
          b2Bucket: presigned.bucket,
          b2Region: presigned.region,
          contentType: contentType || "application/octet-stream",
          status: "UPLOADING",
          isPublished: false,
          uploadedById: auth.user.id,
        },
        create: {
          gameId: game.id,
          version,
          platform,
          fileType,
          fileName,
          fileSizeBytes: BigInt(fileSizeBytes),
          sha256Checksum,
          b2ObjectKey: presigned.b2ObjectKey,
          b2Bucket: presigned.bucket,
          b2Region: presigned.region,
          contentType: contentType || "application/octet-stream",
          status: "UPLOADING",
          isPublished: false,
          uploadedById: auth.user.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      uploadUrl: presigned.uploadUrl,
      b2ObjectKey: presigned.b2ObjectKey,
      bucket: presigned.bucket,
      region: presigned.region,
      expiresInSeconds: presigned.expiresInSeconds,
      releaseId: release.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
