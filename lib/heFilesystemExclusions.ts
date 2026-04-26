import fs from "fs";
import path from "path";
import { heSegmentsToPathname, normalizeHePublicPath } from "./snapshotRegistry";

/**
 * Hebrew paths that already have a dedicated `app/he/.../page.tsx` (not the
 * `[...segments]` catch-all) so `generateStaticParams` must not duplicate them.
 */
export function getFilesystemHePagePaths(): Set<string> {
  const root = path.join(process.cwd(), "app", "he");
  const out = new Set<string>();
  function walk(dir: string, segments: string[]) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith("[")) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full, [...segments, e.name]);
      } else if (e.name === "page.tsx" && segments.length > 0) {
        out.add(heSegmentsToPathname(segments));
      }
    }
  }
  if (fs.existsSync(root)) walk(root, []);
  return out;
}
