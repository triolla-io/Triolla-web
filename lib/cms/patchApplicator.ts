import "server-only";
import * as cheerio from "cheerio";
import type { Patch } from "@/lib/patches";
import { sanitizeEditorHtml } from "@/lib/sanitize";

export function applyPatchesToHtml(html: string, patches: Patch[]): string {
  if (patches.length === 0) return html;
  const $ = cheerio.load(html);

  for (const patch of patches) {
    try {
      const $el = $(patch.selector);
      if ($el.length === 0) continue;

      if (patch.op === "setText") {
        $el.text(patch.value);
      } else if (patch.op === "setHtml") {
        $el.html(sanitizeEditorHtml(patch.value));
      } else if (patch.op === "setAttr" && patch.attr) {
        $el.attr(patch.attr, patch.value);
      }
    } catch {
      // Bad selector or malformed patch — skip silently, don't abort.
    }
  }

  // Return only the body content (Cheerio wraps in <html><body>…</body></html>).
  return $("body").html() ?? html;
}
