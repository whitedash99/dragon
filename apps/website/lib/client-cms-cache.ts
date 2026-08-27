"use client";

// In-memory request deduplication and caching for client components
let cmsBlocksPromise: Promise<Record<string, string>> | null = null;
let cmsBlocksCache: Record<string, string> | null = null;

export async function getClientCmsBlocks(): Promise<Record<string, string>> {
  if (cmsBlocksCache) return cmsBlocksCache;
  if (cmsBlocksPromise) return cmsBlocksPromise;

  cmsBlocksPromise = (async () => {
    try {
      const res = await fetch("/api/cms/blocks");
      const data = await res.json();
      const map: Record<string, string> = {};
      if (data.success && Array.isArray(data.blocks)) {
        data.blocks.forEach((b: any) => {
          if (b?.key && b?.content) map[b.key] = b.content;
        });
      }
      cmsBlocksCache = map;
      return map;
    } catch {
      return {};
    } finally {
      cmsBlocksPromise = null;
    }
  })();

  return cmsBlocksPromise;
}

let gamesPromise: Promise<any[]> | null = null;
let gamesCache: any[] | null = null;

export async function getClientGamesList(): Promise<any[]> {
  if (gamesCache) return gamesCache;
  if (gamesPromise) return gamesPromise;

  gamesPromise = (async () => {
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      if (data.success && Array.isArray(data.games)) {
        gamesCache = data.games;
        return data.games;
      }
      return [];
    } catch {
      return [];
    } finally {
      gamesPromise = null;
    }
  })();

  return gamesPromise;
}
