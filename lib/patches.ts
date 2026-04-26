import * as cheerio from "cheerio";
import type { Element } from "domhandler";
import { contentFingerprint } from "./fingerprint";

export type PatchOp = "setText" | "setHtml" | "setAttr";

export type Patch = {
  id: string;
  selector: string;
  op: PatchOp;
  attr?: string;
  value: string;
  fingerprint: string;
  updatedAt: number;
};

export type ApplyPatchesResult = {
  html: string;
  skipped: Array<{ patchId: string; reason: string }>;
};

function getFingerprintForElement($el: cheerio.Cheerio<Element>, op: PatchOp, attr?: string): string {
  if (op === "setAttr" && attr) {
    const v = $el.attr(attr) ?? "";
    return contentFingerprint(v);
  }
  if (op === "setHtml") {
    return contentFingerprint($el.html() ?? "");
  }
  return contentFingerprint($el.text() ?? "");
}

/**
 * Apply draft patches to snapshot body HTML (inner content of `[data-snapshot-client]`).
 * Wraps in `<main data-snapshot-client>` so selectors match the live DOM.
 */
export function applyPatches(bodyHtml: string, patches: Patch[]): ApplyPatchesResult {
  const skipped: ApplyPatchesResult["skipped"] = [];
  const wrapped = `<main data-snapshot-client>${bodyHtml}</main>`;
  let $: cheerio.CheerioAPI;
  try {
    $ = cheerio.load(wrapped, undefined, false);
  } catch (e) {
    console.error("[applyPatches] cheerio load failed", e);
    return { html: bodyHtml, skipped: patches.map((p) => ({ patchId: p.id, reason: "parse_error" })) };
  }

  for (const patch of patches) {
    try {
      let $targets: cheerio.Cheerio<Element>;
      try {
        $targets = $(patch.selector) as cheerio.Cheerio<Element>;
      } catch {
        skipped.push({ patchId: patch.id, reason: "invalid_selector" });
        continue;
      }
      const el = $targets.first();
      if (!el.length) {
        skipped.push({ patchId: patch.id, reason: "not_found" });
        continue;
      }
      const currentFp = getFingerprintForElement(el, patch.op, patch.attr);
      if (currentFp !== patch.fingerprint) {
        skipped.push({ patchId: patch.id, reason: "fingerprint_mismatch" });
        continue;
      }
      if (patch.op === "setText") {
        el.text(patch.value);
      } else if (patch.op === "setHtml") {
        el.html(patch.value);
      } else if (patch.op === "setAttr" && patch.attr) {
        el.attr(patch.attr, patch.value);
      } else {
        skipped.push({ patchId: patch.id, reason: "bad_op" });
        continue;
      }
    } catch (e) {
      console.error("[applyPatches] patch failed", patch.id, e);
      skipped.push({ patchId: patch.id, reason: "apply_error" });
    }
  }

  const main = $("main[data-snapshot-client]").first();
  const out = main.html() ?? bodyHtml;
  return { html: out, skipped };
}
