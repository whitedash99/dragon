import { z } from "@dragon/validation";
import crypto from "crypto";

export const BannerVisionAnalysisSchema = z.object({
  focalPoint: z.object({
    x: z.number().min(0).max(1),
    y: z.number().min(0).max(1),
  }),
  desktop: z.object({
    objectPosition: z.string(),
    textSafeArea: z.enum(["left", "right", "top", "bottom", "center"]),
  }),
  tablet: z.object({
    objectPosition: z.string(),
    textSafeArea: z.enum(["left", "right", "top", "bottom", "center"]),
  }),
  mobile: z.object({
    objectPosition: z.string(),
    textSafeArea: z.enum(["left", "right", "top", "bottom", "center"]),
  }),
  card: z.object({
    objectPosition: z.string(),
  }),
  primarySubject: z.string(),
  contrastScore: z.number().min(0).max(1).optional().default(0.8),
  recommendedOverlay: z.number().min(0).max(1).default(0.4),
  isHeroSuitable: z.boolean().default(true),
  confidence: z.number().min(0).max(1).default(0.95),
  assetHash: z.string().optional(),
});

export type BannerVisionAnalysis = z.infer<typeof BannerVisionAnalysisSchema>;

export const DEFAULT_BANNER_ANALYSIS: BannerVisionAnalysis = {
  focalPoint: { x: 0.5, y: 0.5 },
  desktop: { objectPosition: "50% 50%", textSafeArea: "left" },
  tablet: { objectPosition: "50% 50%", textSafeArea: "left" },
  mobile: { objectPosition: "50% 50%", textSafeArea: "top" },
  card: { objectPosition: "50% 50%" },
  primarySubject: "Center Frame Composition",
  contrastScore: 0.85,
  recommendedOverlay: 0.45,
  isHeroSuitable: true,
  confidence: 1.0,
  assetHash: "default",
};

export function computeAssetHash(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 32);
}

export async function analyzeBannerImageWithGemini(
  imageUrl: string,
  existingHash?: string
): Promise<{ success: boolean; data: BannerVisionAnalysis; source: "AI_GENERATED" | "CACHE_HIT" | "FALLBACK"; error?: string }> {
  const currentHash = computeAssetHash(imageUrl);

  if (!imageUrl || !imageUrl.startsWith("http")) {
    return {
      success: true,
      data: { ...DEFAULT_BANNER_ANALYSIS, assetHash: currentHash },
      source: "FALLBACK",
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[Gemini Vision] GEMINI_API_KEY is not configured. Returning fallback positioning.");
    return {
      success: true,
      data: { ...DEFAULT_BANNER_ANALYSIS, assetHash: currentHash },
      source: "FALLBACK",
    };
  }

  try {
    const imgResponse = await fetch(imageUrl, {
      headers: { "User-Agent": "Dragon-Content-Plane/1.0" },
      signal: AbortSignal.timeout(8000),
    });

    if (!imgResponse.ok) {
      throw new Error(`Failed to fetch image: HTTP ${imgResponse.status}`);
    }

    const arrayBuffer = await imgResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = imgResponse.headers.get("content-type") || "image/jpeg";
    const base64Data = buffer.toString("base64");

    const systemInstruction = `You are a world-class Game Studio Art Director and Visual Composition AI for Dragon Gaming Studios.
Analyze game banners to determine optimal responsive crops for Desktop (16:9), Tablet (4:3), Mobile (9:16 portrait), and Game Cards (3:2).
Return ONLY a valid JSON object matching this exact schema:
{
  "focalPoint": { "x": <number between 0.0 and 1.0 (0=left, 1=right)>, "y": <number between 0.0 and 1.0 (0=top, 1=bottom)> },
  "desktop": { "objectPosition": "<percentage string e.g. 72% 48%>", "textSafeArea": "<left, right, top, bottom, or center>" },
  "tablet": { "objectPosition": "<percentage string e.g. 68% 50%>", "textSafeArea": "<left, right, top, bottom, or center>" },
  "mobile": { "objectPosition": "<percentage string e.g. 65% 50%>", "textSafeArea": "<left, right, top, bottom, or center>" },
  "card": { "objectPosition": "<percentage string e.g. 70% 45%>" },
  "primarySubject": "<short description of the main focal subject>",
  "contrastScore": <number 0.0 to 1.0>,
  "recommendedOverlay": <number 0.1 to 0.8>,
  "isHeroSuitable": <boolean>,
  "confidence": <number 0.5 to 1.0>
}`;

    const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

    for (const model of models) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    inline_data: {
                      mime_type: mimeType.startsWith("image/") ? mimeType : "image/jpeg",
                      data: base64Data,
                    },
                  },
                  {
                    text: "Analyze this game artwork and determine focal coordinates and responsive crops. Return JSON only.",
                  },
                ],
              },
            ],
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            generationConfig: {
              temperature: 0.1,
              response_mime_type: "application/json",
            },
          }),
          signal: AbortSignal.timeout(12000),
        });

        const data = await res.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          const rawText = data.candidates[0].content.parts[0].text;
          const cleanJson = rawText.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          
          const validated = BannerVisionAnalysisSchema.parse({
            ...parsed,
            assetHash: currentHash,
          });

          return {
            success: true,
            data: validated,
            source: "AI_GENERATED",
          };
        }

        if (data.error && data.error.code === 404) {
          continue;
        }

        if (data.error) {
          console.warn(`[Gemini Vision] Model ${model} returned error:`, data.error.message);
        }
      } catch (err: unknown) {
        console.warn(`[Gemini Vision] Attempt failed on ${model}:`, err instanceof Error ? err.message : String(err));
      }
    }

    return {
      success: true,
      data: { ...DEFAULT_BANNER_ANALYSIS, assetHash: currentHash },
      source: "FALLBACK",
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error during vision analysis";
    console.error("[Gemini Vision Analysis Error]:", errorMsg);
    return {
      success: true,
      data: { ...DEFAULT_BANNER_ANALYSIS, assetHash: currentHash },
      source: "FALLBACK",
      error: errorMsg,
    };
  }
}
