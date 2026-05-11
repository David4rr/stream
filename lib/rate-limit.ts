/**
 * In-memory rate limiter — Edge Runtime compatible.
 *
 * Note: State resets on cold start in serverless deployments.
 * For production-grade rate limiting, back this with a KV store (e.g. Upstash Redis).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();
const videoStore = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000;  // 1 minute
const MAX_REQUESTS = 10;       // max login attempts per window per IP
const MAX_VIDEO_REQUESTS = 200; // max video proxy requests per window per IP (higher for video segments)

// Clean up expired entries periodically (every 5 minutes worth of requests)
let requestsUntilCleanup = 500;
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

/**
 * Returns `true` if the request is allowed, `false` if rate-limited.
 * @param key  — typically the client IP address
 */
export function checkRateLimit(key: string): boolean {
  const now = Date.now();

  if (--requestsUntilCleanup <= 0) {
    cleanup();
    requestsUntilCleanup = 500;
  }

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Rate limiter for video proxy requests.
 * Higher limit than login attempts since video streaming requires many segment fetches.
 * Returns `true` if the request is allowed, `false` if rate-limited.
 * @param key — typically the client IP address
 */
export function checkVideoRateLimit(key: string): boolean {
  const now = Date.now();

  // Cleanup video store periodically
  if (requestsUntilCleanup <= 0) {
    for (const [k, entry] of videoStore) {
      if (entry.resetAt < now) videoStore.delete(k);
    }
  }

  const entry = videoStore.get(key);

  if (!entry || entry.resetAt < now) {
    videoStore.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_VIDEO_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}
