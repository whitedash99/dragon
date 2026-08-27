import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@dragon/config";

let cachedS3Client: S3Client | null = null;

/**
 * Returns a singleton instance of the S3Client configured for Backblaze B2.
 */
export function getB2Client(): S3Client {
  if (cachedS3Client) {
    return cachedS3Client;
  }

  const endpoint = env.B2_ENDPOINT || "https://s3.us-east-005.backblazeb2.com";
  const region = env.B2_REGION || "us-east-005";
  const keyId = env.B2_KEY_ID || (process.env.B2_APPLICATION_KEY_ID || "").trim();
  const appKey = env.B2_APPLICATION_KEY || (process.env.B2_APPLICATION_KEY || "").trim();

  if (!keyId || !appKey) {
    throw new Error("Backblaze B2 credentials missing: B2_KEY_ID or B2_APPLICATION_KEY is not configured.");
  }

  cachedS3Client = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: keyId,
      secretAccessKey: appKey,
    },
    forcePathStyle: true,
  });

  return cachedS3Client;
}

/**
 * Sanitizes a path segment or filename to prevent directory traversal and invalid characters.
 */
export function sanitizePathSegment(segment: string): string {
  return segment
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/\.{2,}/g, ".");
}

export type StorageDomain = "games" | "users" | "admin" | "system";
export type StorageCategory = "cover" | "screenshots" | "assets" | "builds" | "avatar" | "uploads" | "test";

/**
 * Builds a standardized, hierarchical object key for Backblaze B2.
 * Structure:
 * - games/{gameId}/cover/{filename}
 * - games/{gameId}/screenshots/{filename}
 * - games/{gameId}/assets/{filename}
 * - games/{gameId}/builds/{filename}
 * - users/{userId}/avatar/{filename}
 * - users/{userId}/uploads/{filename}
 * - admin/uploads/{filename}
 * - system/{category}/{filename}
 */
export function buildObjectKey(params: {
  domain: StorageDomain;
  entityId?: string;
  category?: StorageCategory;
  fileName: string;
}): string {
  const safeDomain = sanitizePathSegment(params.domain.toLowerCase());
  const safeCategory = params.category ? sanitizePathSegment(params.category.toLowerCase()) : "uploads";
  const safeFile = sanitizePathSegment(params.fileName);

  if (params.domain === "games" && params.entityId) {
    const safeId = sanitizePathSegment(params.entityId.toLowerCase());
    return `games/${safeId}/${safeCategory}/${safeFile}`;
  }

  if (params.domain === "users" && params.entityId) {
    const safeId = sanitizePathSegment(params.entityId.toLowerCase());
    return `users/${safeId}/${safeCategory}/${safeFile}`;
  }

  if (params.domain === "admin") {
    return `admin/${safeCategory}/${safeFile}`;
  }

  return `system/${safeCategory}/${safeFile}`;
}

/**
 * Generates a deterministic storage key for Backblaze B2 game binaries.
 * Format: games/{gameSlug}/releases/{version}/{platform}/{filename}
 */
export function buildDeterministicStorageKey(params: {
  gameSlug: string;
  version: string;
  platform: "WINDOWS" | "ANDROID" | string;
  fileName: string;
}): string {
  const safeGame = sanitizePathSegment(params.gameSlug.toLowerCase());
  const safeVer = sanitizePathSegment(params.version.toLowerCase());
  const safePlatform = sanitizePathSegment(params.platform.toLowerCase());
  const safeFile = sanitizePathSegment(params.fileName);

  return `games/${safeGame}/releases/${safeVer}/${safePlatform}/${safeFile}`;
}

export interface UploadObjectParams {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
  metadata?: Record<string, string>;
}

/**
 * Direct server-side upload of an object to Backblaze B2.
 */
export async function uploadObject(params: UploadObjectParams): Promise<{
  key: string;
  bucket: string;
  etag?: string;
}> {
  const client = getB2Client();
  const bucket = env.B2_BUCKET_NAME || "dragon-games-production";

  const res = await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: typeof params.body === "string" ? Buffer.from(params.body, "utf-8") : params.body,
      ContentType: params.contentType || "application/octet-stream",
      Metadata: params.metadata,
    })
  );

  return {
    key: params.key,
    bucket,
    etag: res.ETag,
  };
}

/**
 * Direct server-side download of an object from Backblaze B2.
 */
export async function downloadObject(params: { key: string }): Promise<{
  body: Buffer;
  contentType?: string;
  contentLength: number;
  etag?: string;
  lastModified?: Date;
}> {
  const client = getB2Client();
  const bucket = env.B2_BUCKET_NAME || "dragon-games-production";

  const res = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: params.key,
    })
  );

  const bytes = await res.Body?.transformToByteArray();
  const body = bytes ? Buffer.from(bytes) : Buffer.alloc(0);

  return {
    body,
    contentType: res.ContentType,
    contentLength: res.ContentLength ?? body.length,
    etag: res.ETag,
    lastModified: res.LastModified,
  };
}

/**
 * Deletes an object from Backblaze B2.
 */
export async function deleteObject(params: { key: string }): Promise<{ deleted: boolean; key: string }> {
  const client = getB2Client();
  const bucket = env.B2_BUCKET_NAME || "dragon-games-production";

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: params.key,
    })
  );

  return { deleted: true, key: params.key };
}

/**
 * Checks object presence and retrieves metadata via HeadObject.
 */
export async function headObject(params: { key: string }): Promise<{
  exists: boolean;
  contentLength: number;
  contentType?: string;
  etag?: string;
  lastModified?: Date;
  metadata?: Record<string, string>;
}> {
  const client = getB2Client();
  const bucket = env.B2_BUCKET_NAME || "dragon-games-production";

  try {
    const head = await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: params.key,
      })
    );

    return {
      exists: true,
      contentLength: head.ContentLength ?? 0,
      contentType: head.ContentType,
      etag: head.ETag,
      lastModified: head.LastModified,
      metadata: head.Metadata,
    };
  } catch (err: any) {
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
      return { exists: false, contentLength: 0 };
    }
    throw err;
  }
}

export interface PresignedUploadParams {
  gameSlug: string;
  version: string;
  platform: "WINDOWS" | "ANDROID" | string;
  fileName: string;
  contentType?: string;
  fileSizeBytes?: number;
  sha256Checksum?: string;
  expiresInSeconds?: number;
}

export interface PresignedUploadResult {
  uploadUrl: string;
  b2ObjectKey: string;
  bucket: string;
  region: string;
  expiresInSeconds: number;
}

/**
 * Generates a secure presigned S3 PUT URL for direct browser-to-B2 uploads.
 * Zero game binary bytes flow through Vercel serverless functions.
 */
export async function generatePresignedUploadUrl(
  params: PresignedUploadParams
): Promise<PresignedUploadResult> {
  const client = getB2Client();
  const bucket = env.B2_BUCKET_NAME || "dragon-games-production";
  const region = env.B2_REGION || "us-east-005";
  const b2ObjectKey = buildDeterministicStorageKey({
    gameSlug: params.gameSlug,
    version: params.version,
    platform: params.platform,
    fileName: params.fileName,
  });

  const expiresInSeconds = params.expiresInSeconds || 3600; // 1 hour

  const metadata: Record<string, string> = {
    "game-slug": params.gameSlug,
    "game-version": params.version,
    "game-platform": params.platform,
  };

  if (params.sha256Checksum) {
    metadata["sha256-checksum"] = params.sha256Checksum;
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: b2ObjectKey,
    ContentType: params.contentType || "application/octet-stream",
    Metadata: metadata,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: expiresInSeconds,
  });

  return {
    uploadUrl,
    b2ObjectKey,
    bucket,
    region,
    expiresInSeconds,
  };
}

export const createPresignedUploadUrl = generatePresignedUploadUrl;

export interface PresignedDownloadParams {
  b2ObjectKey: string;
  downloadFileName?: string;
  expiresInSeconds?: number;
}

/**
 * Generates a secure, short-lived signed download URL for the requested game release.
 * Sets Content-Disposition header so browsers prompt a direct download.
 */
export async function generatePresignedDownloadUrl(
  params: PresignedDownloadParams
): Promise<string> {
  const client = getB2Client();
  const bucket = env.B2_BUCKET_NAME || "dragon-games-production";
  const expiresIn = params.expiresInSeconds || 900; // 15 minutes default

  const safeDownloadName = params.downloadFileName
    ? sanitizePathSegment(params.downloadFileName)
    : params.b2ObjectKey.split("/").pop() || "game_release.bin";

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: params.b2ObjectKey,
    ResponseContentDisposition: `attachment; filename="${safeDownloadName}"`,
  });

  return getSignedUrl(client, command, { expiresIn });
}

export const createPresignedDownloadUrl = generatePresignedDownloadUrl;

/**
 * Verifies object presence and metadata in Backblaze B2 using HeadObject.
 * Validates file size without buffering binaries into server memory.
 */
export async function verifyB2Object(params: {
  b2ObjectKey: string;
  expectedSizeBytes?: number;
}): Promise<{
  verified: boolean;
  actualSizeBytes: number;
  lastModified?: Date;
  etag?: string;
  metadata?: Record<string, string>;
}> {
  const client = getB2Client();
  const bucket = env.B2_BUCKET_NAME || "dragon-games-production";

  try {
    const head = await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: params.b2ObjectKey,
      })
    );

    const actualSizeBytes = head.ContentLength ?? 0;

    if (params.expectedSizeBytes && params.expectedSizeBytes > 0) {
      if (actualSizeBytes !== params.expectedSizeBytes) {
        throw new Error(
          `File size mismatch: Expected ${params.expectedSizeBytes} bytes, but B2 reported ${actualSizeBytes} bytes.`
        );
      }
    }

    return {
      verified: true,
      actualSizeBytes,
      lastModified: head.LastModified,
      etag: head.ETag,
      metadata: head.Metadata,
    };
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      throw new Error(`Object not found in Backblaze B2 storage: ${params.b2ObjectKey}`);
    }
    throw error;
  }
}

/**
 * Safely tests Backblaze B2 connection without modifying or printing any secret data.
 */
export async function testB2Connection(): Promise<{
  success: boolean;
  bucket: string;
  region: string;
  endpoint: string;
}> {
  const client = getB2Client();
  const bucket = env.B2_BUCKET_NAME || "dragon-games-production";
  const region = env.B2_REGION || "us-east-005";
  const endpoint = env.B2_ENDPOINT || "https://s3.us-east-005.backblazeb2.com";

  await client.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      MaxKeys: 1,
    })
  );

  return {
    success: true,
    bucket,
    region,
    endpoint,
  };
}
