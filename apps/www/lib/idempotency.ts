type Cached = { status: number; body: unknown; expiresAt: number };

const TTL_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 500;

/** Process-local cache for contact Idempotency-Key (best-effort on serverless). */
const cache = new Map<string, Cached>();

function prune(now: number) {
  for (const [key, value] of cache) {
    if (value.expiresAt <= now) cache.delete(key);
  }
  while (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
}

export function getIdempotentResponse(key: string | null): Cached | null {
  if (!key) return null;
  const now = Date.now();
  prune(now);
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= now) {
    cache.delete(key);
    return null;
  }
  return hit;
}

export function storeIdempotentResponse(
  key: string | null,
  status: number,
  body: unknown,
) {
  if (!key) return;
  const now = Date.now();
  prune(now);
  cache.set(key, { status, body, expiresAt: now + TTL_MS });
}
