import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePresignedDownloadUrl } from "@dragon/storage";
import { checkRateLimit } from "@dragon/utils";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "127.0.0.1";

    // Rate Limit: 15 download URL requests per IP per 10-minute window
    const rateLimit = checkRateLimit(`game_dl_${ipAddress}`, 15, 10 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Download rate limit exceeded. Please wait before requesting another download.",
          retryAfterSeconds: rateLimit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.retryAfterSeconds.toString(),
            "X-RateLimit-Limit": "15",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.retryAfterSeconds.toString(),
          },
        }
      );
    }

    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const rawPlatform = searchParams.get("platform") || "windows";
    const shouldRedirect = searchParams.get("redirect") === "1" || searchParams.get("redirect") === "true";

    const platform = rawPlatform.toUpperCase() === "ANDROID" ? "ANDROID" : "WINDOWS";

    // 1. Look up game by slug
    const game = await prisma.gameContent.findUnique({
      where: { slug },
      include: {
        releases: {
          where: {
            platform,
            isPublished: true,
            status: "PUBLISHED",
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!game) {
      return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 });
    }

    const latestRelease = game.releases[0];

    if (!latestRelease) {
      return NextResponse.json(
        {
          success: false,
          error: `No published release available for ${game.name} on ${platform}.`,
        },
        { status: 404 }
      );
    }

    // 2. Generate secure presigned Backblaze B2 S3 download URL (15 mins valid)
    const downloadUrl = await generatePresignedDownloadUrl({
      b2ObjectKey: latestRelease.b2ObjectKey,
      downloadFileName: latestRelease.fileName,
      expiresInSeconds: 900,
    });

    // 3. Record download telemetry asynchronously
    const userAgent = req.headers.get("user-agent") || "unknown";

    prisma.gameRelease.update({
      where: { id: latestRelease.id },
      data: {
        downloadCount: { increment: 1 },
      },
    }).catch((e) => console.error("Error updating download count:", e));

    prisma.gameDownloadLog.create({
      data: {
        releaseId: latestRelease.id,
        gameId: game.id,
        platform,
        ipAddress,
        userAgent,
        status: "COMPLETED",
      },
    }).catch((e) => console.error("Error recording download log:", e));

    // 4. Return response
    if (shouldRedirect) {
      return NextResponse.redirect(downloadUrl, { status: 302 });
    }

    return NextResponse.json({
      success: true,
      downloadUrl,
      fileName: latestRelease.fileName,
      fileSizeBytes: latestRelease.fileSizeBytes.toString(),
      sha256Checksum: latestRelease.sha256Checksum,
      version: latestRelease.version,
      platform: latestRelease.platform,
      game: {
        name: game.name,
        slug: game.slug,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Download error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
