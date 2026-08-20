import { getContentText } from "@/lib/cms";

export interface GeminiGenerateOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
}

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.5-flash",
];

/**
 * Executes a server-side request to Google Gemini API with automatic model fallback.
 * Uses GEMINI_API_KEY environment variable.
 */
export async function generateGeminiContent(options: GeminiGenerateOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return `[Dragon Assistant AI] Processed prompt: "${options.prompt.slice(0, 60)}...". Note: Configure GEMINI_API_KEY in your environment or Secrets Vault to enable live Google Gemini LLM responses!`;
  }

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: options.prompt }],
            },
          ],
          systemInstruction: options.systemInstruction
            ? { parts: [{ text: options.systemInstruction }] }
            : { parts: [{ text: "You are Dragon Assistant, an intelligent, helpful AI assistant for Dragon Studios, an independent game studio." }] },
          generationConfig: {
            temperature: options.temperature ?? 0.7,
            maxOutputTokens: options.maxTokens ?? 1024,
          },
        }),
      });

      const data = await res.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      if (data.error && data.error.code === 404) {
        // Model not found, try next model in loop
        continue;
      }

      if (data.error) {
        console.error(`Gemini API Error (${model}):`, data.error);
        throw new Error(data.error.message || `Gemini API error on ${model}`);
      }
    } catch (error: any) {
      console.warn(`Gemini Request Exception on model ${model}:`, error);
      // Try next model if available
    }
  }

  return "Dragon Assistant was unable to reach Google Gemini API. Please verify your GEMINI_API_KEY.";
}

/**
 * Summarizes a support ticket and suggests a response.
 */
export async function summarizeSupportTicketWithAi(ticket: {
  ticketId: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}) {
  const prompt = `Analyze this support ticket for Dragon Studios:
Ticket ID: ${ticket.ticketId}
Category: ${ticket.category}
Customer: ${ticket.name} (${ticket.email})
Subject: ${ticket.subject}
Message: ${ticket.message}

Provide:
1. Executive Summary (1-2 sentences)
2. Sentiment (Positive, Neutral, Negative, Frustrated)
3. Urgency Level (LOW, NORMAL, HIGH, CRITICAL)
4. Recommended Support Agent Reply`;

  const systemInstruction = "You are an enterprise AI assistant for Dragon Studios Customer Operations.";

  return generateGeminiContent({ prompt, systemInstruction });
}

/**
 * Generates SEO Metadata (Title, Description, Keywords) for a topic.
 */
export async function generateSeoWithAi(topic: string) {
  const prompt = `Generate SEO meta tags for a gaming web page about "${topic}" at Dragon Studios.
Provide output formatted as JSON with keys: title, description, keywords.`;

  const systemInstruction = "You are an expert SEO Optimization AI for Gaming Studios.";

  const text = await generateGeminiContent({ prompt, systemInstruction });
  try {
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch {
    return {
      title: `${topic} | Dragon Studios`,
      description: `Discover ${topic} from Dragon Studios, independent game development studio.`,
      keywords: `Dragon Studios, ${topic}, 3D Games, 2D Games, Dragon Engine`,
    };
  }
}
