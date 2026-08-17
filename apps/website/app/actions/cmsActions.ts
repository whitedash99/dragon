"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface SaveCMSBlockParams {
  key: string;
  content: string;
  category?: string;
  label?: string;
  type?: string;
  isPublished?: boolean;
  updatedBy?: string;
  clientTimestamp?: number;
}

/**
 * Production-Grade Server Action to save and publish CMS blocks
 * Updates draftContent, content, version, updatedAt, updatedBy in Prisma & Neon PostgreSQL
 */
export async function saveCMSBlockAction(params: SaveCMSBlockParams) {
  const { key, content, category, label, type, isPublished, updatedBy } = params;

  if (!key) {
    return { success: false, error: "CMS Block key is required" };
  }

  const safeContent = content ?? "";
  const author = updatedBy || "Dragon Studio Admin";

  try {
    const existing = await prisma.contentBlock.findUnique({ where: { key } });
    const nextVersion = existing ? existing.version + 1 : 1;

    // Create revision history record
    if (existing) {
      await prisma.contentRevision.create({
        data: {
          blockKey: key,
          version: existing.version,
          content: existing.content,
          changedBy: author,
        },
      }).catch((e: unknown) => console.warn("Revision creation log warning:", e));
    }

    // Upsert ContentBlock updating all required fields: draftContent, content, version, updatedAt, updatedBy
    const block = await prisma.contentBlock.upsert({
      where: { key },
      update: {
        content: isPublished !== false ? safeContent : existing?.content || safeContent,
        draftContent: safeContent,
        isPublished: isPublished ?? true,
        version: nextVersion,
        updatedBy: author,
        updatedAt: new Date(),
      },
      create: {
        key,
        category: category || "General",
        label: label || key,
        type: type || "text",
        content: safeContent,
        draftContent: safeContent,
        isPublished: isPublished ?? true,
        version: 1,
        updatedBy: author,
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        action: "COMMIT_CMS_BLOCK",
        userEmail: author,
        details: `Saved CMS Block [${key}] v${block.version} -> "${safeContent.slice(0, 40)}"`,
      },
    }).catch((e: unknown) => console.warn("Audit log warning:", e));

    // Revalidate caches across website
    try {
      revalidatePath("/", "layout");
    } catch (e: unknown) {
      console.warn("Revalidation warning:", e);
    }

    return {
      success: true,
      block: {
        id: block.id,
        key: block.key,
        category: block.category,
        label: block.label,
        type: block.type,
        content: block.content,
        draftContent: block.draftContent,
        isPublished: block.isPublished,
        version: block.version,
        updatedBy: block.updatedBy,
        updatedAt: block.updatedAt.toISOString(),
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database save error";
    console.error(`[CMS Server Action Error] Failed to save key "${key}":`, error);
    return { success: false, error: message };
  }
}
