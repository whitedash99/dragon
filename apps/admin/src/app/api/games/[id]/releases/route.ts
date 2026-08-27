import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getAuthenticatedUser } from "@/lib/auth/auth";
import { can } from "@dragon/auth";
import { CreateGameReleaseSchema } from "@dragon/validation";
import { buildDeterministicStorageKey } from "@dragon/storage";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Game can be looked up by ID or slug
    const game = await prisma.gameContent.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        releases: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!game) {
      return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 });
    }

    // Convert BigInt fileSizeBytes to string for JSON serialization
    const serializedReleases = game.releases.map((r) => ({
      ...r,
      fileSizeBytes: r.fileSizeBytes.toString(),
    }));

    return NextResponse.json({
      success: true,
      game: {
        id: game.id,
        slug: game.slug,
        name: game.name,
      },
      releases: serializedReleases,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthenticatedUser();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Authentication required." }, { status: 401 });
    }

    if (!can(auth.user, "games.manage") && !can(auth.user, "cms.edit")) {
      return NextResponse.json({ success: false, error: "Access Denied: Requires games.manage permission." }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const parsed = CreateGameReleaseSchema.safeParse({ ...body, gameId: id });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const {
      version,
      buildNumber,
      platform,
      targetArch,
      fileType,
      fileName,
      fileSizeBytes,
      sha256Checksum,
      releaseNotes,
    } = parsed.data;

    const game = await prisma.gameContent.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!game) {
      return NextResponse.json({ success: false, error: "Game not found" }, { status: 404 });
    }

    const b2ObjectKey = buildDeterministicStorageKey({
      gameSlug: game.slug,
      version,
      platform,
      fileName,
    });

    const release = await prisma.gameRelease.upsert({
      where: {
        gameId_version_platform: {
          gameId: game.id,
          version,
          platform,
        },
      },
      update: {
        buildNumber,
        targetArch: targetArch || "x64",
        fileType,
        fileName,
        fileSizeBytes: BigInt(fileSizeBytes),
        sha256Checksum,
        b2ObjectKey,
        releaseNotes: releaseNotes || null,
        status: "DRAFT",
        isPublished: false,
        uploadedById: auth.user.id,
      },
      create: {
        gameId: game.id,
        version,
        buildNumber,
        platform,
        targetArch: targetArch || "x64",
        fileType,
        fileName,
        fileSizeBytes: BigInt(fileSizeBytes),
        sha256Checksum,
        b2ObjectKey,
        releaseNotes: releaseNotes || null,
        status: "DRAFT",
        isPublished: false,
        uploadedById: auth.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      release: {
        ...release,
        fileSizeBytes: release.fileSizeBytes.toString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
