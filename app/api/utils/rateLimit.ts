// ─── In-memory sliding window rate limiter ────────────────────────────────────

import { NextRequest } from "next/server";

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

// ─── IP resolution ────────────────────────────────────────────────────────────

// Current setup: Coolify uses Traefik which sets x-real-ip to the actual client IP
// server-side — not user-controllable, so safe to use directly.
//
// Alternative (Nginx with known proxy IP):
// Set PROXY_IP env var to your proxy's internal IP. Only trust x-forwarded-for
// when the request comes from that address — prevents header spoofing.
//
// const TRUSTED_PROXY_IP = process.env.PROXY_IP;
// export function getIp(req: NextRequest): string {
//   const remoteIp = req.headers.get("x-real-ip") ?? undefined;
//   if (TRUSTED_PROXY_IP && remoteIp === TRUSTED_PROXY_IP) {
//     return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? remoteIp;
//   }
//   return remoteIp ?? "unknown";
// }

export function getIp(req: NextRequest): string {
  return req.headers.get("x-real-ip") ?? "unknown";
  // return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}
