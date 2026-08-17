export interface GeminiOptions {
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

export async function generateGeminiText(options: GeminiOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return `[DragonOS AI Engine] Processed prompt: "${options.prompt.slice(0, 70)}...". (Configure GEMINI_API_KEY in .env for live Google Gemini LLM API calls).`;
  }

  for (const model of GEMINI_MODELS) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
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
              : undefined,
            generationConfig: {
              temperature: options.temperature ?? 0.7,
              maxOutputTokens: options.maxTokens ?? 1024,
            },
          }),
        }
      );

      const data = await res.json();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      if (data.error && data.error.code === 404) {
        continue;
      }

      if (data.error) {
        throw new Error(data.error.message || "Gemini API error");
      }
    } catch (error: unknown) {
      console.warn(`Gemini Request Exception on ${model}:`, error);
    }
  }

  return "Unable to complete Gemini request across available models.";
}

export async function analyzeTicketWithAi(ticket: {
  ticketId: string;
  customerName: string;
  customerEmail: string;
  category: string;
  subject: string;
  description: string;
}) {
  const prompt = `Analyze this support ticket for Dragon Studios:
Ticket ID: ${ticket.ticketId}
Category: ${ticket.category}
Customer: ${ticket.customerName} (${ticket.customerEmail})
Subject: ${ticket.subject}
Description: ${ticket.description}

Provide:
1. Executive Summary (1-2 sentences)
2. Sentiment (Positive, Neutral, Negative, Frustrated)
3. Urgency Level (LOW, NORMAL, HIGH, CRITICAL)
4. Recommended Agent Reply`;

  const systemInstruction = "You are an enterprise AI assistant for Dragon Studios Customer Operations.";
  return generateGeminiText({ prompt, systemInstruction });
}

export async function generateSeoWithAi(topic: string) {
  const prompt = `Generate SEO meta tags for a gaming web page about "${topic}" at Dragon Studios.
Provide output formatted as JSON with keys: title, description, keywords.`;

  const systemInstruction = "You are an expert SEO Optimization AI for AAA Gaming Studios.";
  const text = await generateGeminiText({ prompt, systemInstruction });
  try {
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch {
    return {
      title: `${topic} | Dragon Studios`,
      description: `Discover ${topic} from Dragon Studios, premier AAA game development studio.`,
      keywords: `Dragon Studios, ${topic}, AAA Games, Dragon Engine`,
    };
  }
}
