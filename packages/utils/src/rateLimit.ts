interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitBucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  retryAfterSeconds: number;
}

/**
 * Universal in-memory token-bucket / sliding-window rate limiter for serverless routes.
 * Automatically cleans up stale entries to prevent memory leaks.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  let bucket = rateLimitStore.get(key);

  if (!bucket || now > bucket.resetAt) {
    bucket = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(key, bucket);
    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - 1),
      resetMs: windowMs,
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    };
  }

  // Periodic memory sweep if store grows large
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (now > v.resetAt) {
        rateLimitStore.delete(k);
      }
    }
  }

  if (bucket.count >= maxRequests) {
    const remainingMs = Math.max(0, bucket.resetAt - now);
    return {
      allowed: false,
      remaining: 0,
      resetMs: remainingMs,
      retryAfterSeconds: Math.ceil(remainingMs / 1000),
    };
  }

  bucket.count += 1;
  const remainingMs = Math.max(0, bucket.resetAt - now);
  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - bucket.count),
    resetMs: remainingMs,
    retryAfterSeconds: Math.ceil(remainingMs / 1000),
  };
}
