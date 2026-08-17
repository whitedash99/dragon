export interface AiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; href?: string }[];
}

export interface AiCompletionRequest {
  messages: AiMessage[];
  context?: {
    userId?: string;
    currentGameSlug?: string;
    currentPage?: string;
  };
  stream?: boolean;
}

export interface AiCompletionResponse {
  id: string;
  message: AiMessage;
  tokensUsed?: number;
  model: string;
}

export interface AiProviderInterface {
  name: string;
  generateCompletion(req: AiCompletionRequest): Promise<AiCompletionResponse>;
  generateStream?(req: AiCompletionRequest, onChunk: (chunk: string) => void): Promise<void>;
}

export class GeminiDragonAiProvider implements AiProviderInterface {
  name = "Google-Gemini-AI";

  async generateCompletion(req: AiCompletionRequest): Promise<AiCompletionResponse> {
    const lastUserMsg = req.messages.filter((m) => m.role === "user").pop()?.content || "";

    try {
      const res = await fetch("/api/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: lastUserMsg }),
      });

      const data = await res.json();
      if (data.success && data.completion) {
        return {
          id: `res-${Date.now()}`,
          message: {
            id: `msg-${Date.now()}`,
            role: "assistant",
            content: data.completion,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          model: "google-gemini-llm",
        };
      }
    } catch (e) {
      console.warn("Gemini Provider fetch exception, falling back to local engine:", e);
    }

    // Fallback contextual responses if backend API call is unreachable
    let reply = "Greetings, Traveler! I am the Dragon Assistant. How can I assist your gaming experience today?";
    let actions: AiMessage["suggestedActions"] = undefined;

    const lower = lastUserMsg.toLowerCase();

    if (lower.includes("recommend") || lower.includes("play") || lower.includes("game")) {
      reply = "Based on your playstyle metrics, I highly recommend **Embers of Valyria** if you enjoy rich ARPG combat and dragon lore, or **Neon Drift: Overdrive** for high-velocity cyberpunk racing.";
      actions = [
        { label: "View Embers of Valyria", action: "navigate", href: "/games/embers-of-valyria" },
        { label: "View Neon Drift", action: "navigate", href: "/games/neon-drift" },
      ];
    } else if (lower.includes("engine") || lower.includes("dragon engine")) {
      reply = "Dragon Engine features proprietary low-latency netcode, real-time volumetric fog, dynamic global illumination, and 120 FPS high-refresh rate physics loops.";
      actions = [{ label: "Explore Engine Tech", action: "navigate", href: "/studio" }];
    } else if (lower.includes("download") || lower.includes("launcher")) {
      reply = "You can download the official Dragon Launcher for Windows 11/10 to keep your games patched with optimized patch delivery.";
      actions = [{ label: "Open Downloads Center", action: "navigate", href: "/downloads" }];
    } else if (lower.includes("career") || lower.includes("job") || lower.includes("hiring")) {
      reply = "Dragon Studios is currently hiring across our Bengaluru, Montreal, and London campuses for Principal Engine Engineers, Senior 3D Artists, and AI Gameplay Programmers.";
      actions = [{ label: "View Open Positions", action: "navigate", href: "/careers" }];
    }

    return {
      id: `res-${Date.now()}`,
      message: {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: actions,
      },
      model: this.name,
    };
  }
}

export const activeAiProvider: AiProviderInterface = new GeminiDragonAiProvider();
