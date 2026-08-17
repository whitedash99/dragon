import Ably from "ably";

// Server-side Ably instance cache
let ablyServerClient: Ably.Rest | null = null;

export function getAblyApiKey(): string | null {
  return (
    process.env.ABLY_API_KEY ||
    process.env.ABLY_KEY ||
    process.env.NEXT_PUBLIC_ABLY_KEY ||
    null
  );
}

export function getAblyServerClient(): Ably.Rest | null {
  const apiKey = getAblyApiKey();
  if (!apiKey) return null;

  if (!ablyServerClient) {
    try {
      ablyServerClient = new Ably.Rest({ key: apiKey });
    } catch (err) {
      console.warn("[Realtime] Failed to initialize Ably server client:", err);
      return null;
    }
  }
  return ablyServerClient;
}

/**
 * Creates an Ably Token Request for secure client-side authentication without exposing secret keys.
 */
export async function createTokenRequest(clientId: string, capability?: Record<string, string[]>) {
  const client = getAblyServerClient();
  if (!client) {
    throw new Error("Ably API key not configured on server.");
  }

  const tokenParams: Ably.TokenParams = {
    clientId: clientId || "dragon_guest",
    ttl: 3600 * 1000, // 1 hour token
    capability: capability ? JSON.stringify(capability) : JSON.stringify({ "community:*": ["*"] }),
  };

  return client.auth.createTokenRequest(tokenParams);
}

/**
 * Publishes a real-time event to a community channel.
 */
export async function publishCommunityEvent(
  channelName: string,
  eventName: string,
  payload: any
): Promise<boolean> {
  const client = getAblyServerClient();
  if (!client) {
    // If Ably is not configured, we gracefully return false and let HTTP polling/optimistic UI take over
    return false;
  }

  try {
    const channel = client.channels.get(channelName);
    await channel.publish(eventName, payload);
    return true;
  } catch (err) {
    console.warn(`[Realtime] Failed to publish event '${eventName}' to channel '${channelName}':`, err);
    return false;
  }
}

// ══════════════════════════════════════════════════════════════════
// 🛡️ ANTI-SPAM & RATE LIMITING ENGINE (IN-MEMORY TOKEN BUCKET)
// ══════════════════════════════════════════════════════════════════

interface RateLimitBucket {
  count: number;
  resetAt: number;
  lastMessageText?: string;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

// Cleanup stale buckets every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt < now) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function checkMessageRateLimit(
  userId: string,
  content: string,
  maxPerWindow = 6,
  windowMs = 5000
): { allowed: boolean; reason?: string; retryAfterMs?: number } {
  const now = Date.now();
  const bucket = rateLimitMap.get(userId);

  if (!bucket || bucket.resetAt < now) {
    rateLimitMap.set(userId, {
      count: 1,
      resetAt: now + windowMs,
      lastMessageText: content.trim().toLowerCase(),
    });
    return { allowed: true };
  }

  // 1. Duplicate message spam check
  if (bucket.lastMessageText && bucket.lastMessageText === content.trim().toLowerCase()) {
    return {
      allowed: false,
      reason: "Please do not send identical duplicate messages in rapid succession.",
      retryAfterMs: Math.max(1000, bucket.resetAt - now),
    };
  }

  // 2. Flood frequency check
  if (bucket.count >= maxPerWindow) {
    return {
      allowed: false,
      reason: `Message flood protection: You can send at most ${maxPerWindow} messages every 5 seconds.`,
      retryAfterMs: bucket.resetAt - now,
    };
  }

  bucket.count += 1;
  bucket.lastMessageText = content.trim().toLowerCase();
  return { allowed: true };
}
