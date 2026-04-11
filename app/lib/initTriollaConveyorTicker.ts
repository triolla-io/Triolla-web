/**
 * Inline $(document).ready() that called .jConveyorTicker() was stripped from the fragment.
 * Call once after jQuery loads; portfolio pages also call again on requestAnimationFrame so
 * the plugin re-measures after layout/fonts (avoids ul stuck at a bad negative left).
 *
 * Deps JSON must list `jquery.jConveyorTicker.min.js_edabec9e.js` after jQuery; if it is
 * missing, `ensureJConveyorTickerPlugin` loads a known copy from `_consolidated` or `_shared`.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { snapshotAssetUrl } from "./snapshotAssetUrl";

const CONVEYOR_BASENAME = "jquery.jConveyorTicker.min.js_edabec9e.js";

function normalizeSnapshotAssetBase(assetBase: string): string {
  const trimmed = assetBase.replace(/\/$/, "");
  return trimmed.replace(/^\/_assets\//, "/assets/");
}

function destroyJConveyorTickerIfAny($wrap: any): void {
  if (!$wrap?.length || !$wrap.hasClass?.("jctkr-initialized")) return;
  const $ul = $wrap.children("ul");
  $ul.stop(true, true);
  $wrap.unbind().removeData().removeClass("jctkr-wrapper jctkr-initialized");
  $ul.unbind().removeData().removeAttr("style").find(".clone").remove();
  $ul.children("li").removeAttr("style");
}

/**
 * If `.company_triker` is on the page but deps omitted the conveyor script, load jQuery plugin
 * from slug mirror, then consolidated, then shared hash copy.
 */
export async function ensureJConveyorTickerPlugin(assetBase: string): Promise<void> {
  const w = window as any;
  const jq = w.jQuery;
  if (!jq?.fn) return;
  if (jq.fn.jConveyorTicker) return;

  const base = normalizeSnapshotAssetBase(assetBase);
  const candidates = [
    snapshotAssetUrl(base, CONVEYOR_BASENAME),
    "/assets/_consolidated/jquery.jConveyorTicker.min.js_edabec9e.js",
    "/assets/_shared/eb5e45d752068adfb4185f39ea2978f6_jquery.jConveyorTicker.min.js_edabec9e.js",
  ];

  const hasExactScriptSrc = (src: string): boolean => {
    try {
      const resolved = new URL(src, window.location.origin).href;
      return Array.from(document.querySelectorAll("script[src]")).some(
        (n) => (n as HTMLScriptElement).src === resolved,
      );
    } catch {
      return false;
    }
  };

  for (const src of candidates) {
    if (jq.fn.jConveyorTicker) return;
    try {
      await new Promise<void>((resolve, reject) => {
        if (hasExactScriptSrc(src)) {
          queueMicrotask(() => resolve());
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(String(src)));
        document.body.appendChild(script);
      });
      if (jq.fn.jConveyorTicker) return;
    } catch {
      /* try next URL */
    }
  }
}

export function initTriollaConveyorTicker(root: HTMLElement): void {
  const $ = (window as any).jQuery;
  if (!$?.fn?.jConveyorTicker) return;

  const $el = $(root).find(".company_triker");
  if (!$el.length) return;

  destroyJConveyorTickerIfAny($el);
  $el.jConveyorTicker({ force_loop: true });
}
