import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";
import { PublishReleaseSchema } from "@dragon/validation";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (!can(auth.user, "games.publish") && !can(auth.user, "games.manage")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires games.publish permission." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = PublishReleaseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { releaseId, action } = parsed.data;

    const release = await prisma.gameRelease.findUnique({
      where: { id: releaseId },
      include: { game: true },
    });

    if (!release) {
      return NextResponse.json({ success: false, error: "Release not found." }, { status: 404 });
    }

    if (action === "PUBLISH") {
      // Must be verified prior to publishing
      if (release.status !== "VERIFIED" && release.status !== "PUBLISHED") {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot publish unverified release. Current status is ${release.status}. Please verify the upload first.`,
          },
          { status: 400 }
        );
      }

      // Deprecate previous published releases for the same game and platform
      await prisma.gameRelease.updateMany({
        where: {
          gameId: release.gameId,
          platform: release.platform,
          id: { not: releaseId },
          isPublished: true,
        },
        data: {
          isPublished: false,
          status: "DEPRECATED",
        },
      });

      const updated = await prisma.gameRelease.update({
        where: { id: releaseId },
        data: {
          isPublished: true,
          status: "PUBLISHED",
          publishedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        release: {
          ...updated,
          fileSizeBytes: updated.fileSizeBytes.toString(),
        },
        message: `Release ${release.version} (${release.platform}) is now PUBLISHED for ${release.game.name}.`,
      });
    } else if (action === "UNPUBLISH") {
      const updated = await prisma.gameRelease.update({
        where: { id: releaseId },
        data: {
          isPublished: false,
          status: "VERIFIED",
        },
      });

      return NextResponse.json({
        success: true,
        release: {
          ...updated,
          fileSizeBytes: updated.fileSizeBytes.toString(),
        },
        message: `Release ${release.version} unpublished.`,
      });
    } else if (action === "DEPRECATE") {
      const updated = await prisma.gameRelease.update({
        where: { id: releaseId },
        data: {
          isPublished: false,
          status: "DEPRECATED",
        },
      });

      return NextResponse.json({
        success: true,
        release: {
          ...updated,
          fileSizeBytes: updated.fileSizeBytes.toString(),
        },
        message: `Release ${release.version} marked as deprecated.`,
      });
    } else if (action === "ARCHIVE") {
      const updated = await prisma.gameRelease.update({
        where: { id: releaseId },
        data: {
          isPublished: false,
          status: "ARCHIVED",
        },
      });

      return NextResponse.json({
        success: true,
        release: {
          ...updated,
          fileSizeBytes: updated.fileSizeBytes.toString(),
        },
        message: `Release ${release.version} archived.`,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
