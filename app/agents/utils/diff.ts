// Recursively compares two plain objects and returns human-readable change lines.
import { CONTENT_SKIP_KEYS } from "../deployment-agent/constants";

export type DiffLine = { path: string; from: unknown; to: unknown };

export function diffObjects(
  from: Record<string, unknown>,
  to: Record<string, unknown>,
  path = ""
): DiffLine[] {
  const results: DiffLine[] = [];
  const keys = new Set([...Object.keys(from), ...Object.keys(to)]);

  for (const key of keys) {
    if (CONTENT_SKIP_KEYS.has(key)) continue;
    const fullPath = path ? `${path}.${key}` : key;
    const a = from[key];
    const b = to[key];

    if (isPlainObject(a) && isPlainObject(b)) {
      results.push(...diffObjects(
        a as Record<string, unknown>,
        b as Record<string, unknown>,
        fullPath
      ));
    } else if (JSON.stringify(a) !== JSON.stringify(b)) {
      results.push({ path: fullPath, from: a, to: b });
    }
  }

  return results;
}

export function formatDiff(lines: DiffLine[]): string[] {
  if (lines.length === 0) return ["(no content changes)"];
  return lines.map(({ path, from, to }) => {
    const f = from === undefined ? "(new)"    : JSON.stringify(from);
    const t = to   === undefined ? "(removed)" : JSON.stringify(to);
    return `${path}: ${f} → ${t}`;
  });
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}
