import { prisma } from "@/lib/prisma";

export interface ContentBlockData {
  key: string;
  category: string;
  label: string;
  type: "text" | "textarea" | "richtext";
  content: string;
  draftContent?: string | null;
  isPublished: boolean;
  version: number;
  updatedBy?: string | null;
}

/**
 * Fetch single CMS Content Block from PostgreSQL with fallback
 */
export async function getContentBlock(key: string, fallback: string = ""): Promise<string> {
  try {
    const block = await prisma.contentBlock.findUnique({
      where: { key },
    });
    if (block && block.isPublished && block.content) {
      return block.content;
    }
  } catch (err) {
    console.error(`Error fetching ContentBlock [${key}]:`, err);
  }
  return fallback;
}

/**
 * Fetch all CMS Content Blocks for a specific category from PostgreSQL
 */
export async function getCategoryBlocks(category: string): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  try {
    const blocks = await prisma.contentBlock.findMany({
      where: { category, isPublished: true },
    });
    for (const b of blocks) {
      result[b.key] = b.content;
    }
  } catch (err) {
    console.error(`Error fetching category blocks [${category}]:`, err);
  }
  return result;
}

/**
 * Upsert CMS Content Block & Record Version History in PostgreSQL
 */
export async function updateContentBlock(data: {
  key: string;
  category: string;
  label: string;
  content: string;
  type?: string;
  publish?: boolean;
  updatedBy?: string;
}) {
  const { key, category, label, content, type = "text", publish = true, updatedBy = "Admin" } = data;

  const existing = await prisma.contentBlock.findUnique({
    where: { key },
  });

  const nextVersion = existing ? existing.version + 1 : 1;

  const block = await prisma.contentBlock.upsert({
    where: { key },
    update: {
      category,
      label,
      content: publish ? content : existing?.content || content,
      draftContent: publish ? null : content,
      isPublished: publish,
      version: nextVersion,
      updatedBy,
    },
    create: {
      key,
      category,
      label,
      type,
      content,
      isPublished: publish,
      version: 1,
      updatedBy,
    },
  });

  // Record Version History Snapshot
  await prisma.contentRevision.create({
    data: {
      blockKey: block.key,
      content,
      version: nextVersion,
      changedBy: updatedBy,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: publish ? "PUBLISH_CMS_BLOCK" : "DRAFT_CMS_BLOCK",
      userEmail: updatedBy,
      details: `Updated CMS Block [${key}] to version ${nextVersion}`,
    },
  });

  return block;
}
