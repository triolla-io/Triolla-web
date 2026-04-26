/**
 * Deterministic fingerprint for patch conflict detection.
 * Same algorithm in browser and Node (no crypto dependency).
 */
export function contentFingerprint(s: string): string {
  let h = 5381 >>> 0;
  const t = s.trim();
  for (let i = 0; i < t.length; i++) {
    h = (((h << 5) + h) ^ t.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}
