const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || "dragon-studio-content-secret-2026";
const WEBSITE_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://dragongamingstudios.vercel.app";

export interface RevalidationResult {
  success: boolean;
  durationMs: number;
  tags: string[];
  paths: string[];
  error?: string;
}

/**
 * Triggers targeted cache invalidation on the public website.
 * Measures real execution time without fake 0ms numbers.
 */
export async function triggerWebsiteRevalidation(options: {
  tags?: string[];
  paths?: string[];
}): Promise<RevalidationResult> {
  const startTime = Date.now();
  const tags = options.tags || [];
  const paths = options.paths || [];

  try {
    const endpoint = `${WEBSITE_BASE_URL.replace(/\/$/, "")}/api/revalidate`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidation-secret": REVALIDATION_SECRET,
      },
      body: JSON.stringify({
        secret: REVALIDATION_SECRET,
        tags,
        paths,
      }),
      signal: AbortSignal.timeout(6000), // 6s timeout
    });

    const durationMs = Date.now() - startTime;

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[Website Revalidation Warning]: HTTP ${res.status} - ${errText}`);
      return {
        success: false,
        durationMs,
        tags,
        paths,
        error: `HTTP ${res.status}: ${errText}`,
      };
    }

    const data = await res.json().catch(() => ({}));
    return {
      success: true,
      durationMs,
      tags: data.tags || tags,
      paths: data.paths || paths,
    };
  } catch (error: unknown) {
    const durationMs = Date.now() - startTime;
    const msg = error instanceof Error ? error.message : "Revalidation network timeout";
    console.warn("[Website Revalidation Error]:", msg);
    return {
      success: false,
      durationMs,
      tags,
      paths,
      error: msg,
    };
  }
}
