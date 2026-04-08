// ─── In-memory sliding window rate limiter ────────────────────────────────────

// global for Next.js development
declare global { var _rateLimitStore: Map<string, number[]> | undefined; }
const store: Map<string, number[]> = (globalThis._rateLimitStore ??= new Map());

export type RateLimitOptions = {
  windowMs?: number;  // default: 60_000 (1 minute)
  max?: number;       // default: 5
};

export function isRateLimited(ip: string, options: RateLimitOptions = {}): boolean {
  const { windowMs = 60_000, max = 5 } = options;
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (store.get(ip) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= max) return true;
  store.set(ip, [...timestamps, now]);
  return false;
}

export function getIp(req: { headers: { get: (k: string) => string | null } }): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}
