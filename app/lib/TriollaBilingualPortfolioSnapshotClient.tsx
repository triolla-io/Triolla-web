"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { initTriollaConveyorTicker } from "./initTriollaConveyorTicker";
import { mountTriollaFaqAccordion } from "./mountTriollaFaqAccordion";
import { rewriteTriollaNavLinks } from "./rewriteTriollaNavLinks";
import {
  injectSharedFaq,
  injectSharedFooter,
  localizeContactStripForHebrew,
} from "./triollaSharedBodyInject";
import { installSnapshotPluginStubs } from "./snapshotPluginStubs";
import {
  loadScript,
  loadStylesheet,
  loadStylesheetsParallel,
  waitForSnapshotFonts,
} from "./snapshotLoader";
import { snapshotAssetUrl } from "./snapshotAssetUrl";
import { initTriollaOwlCarousels } from "../about-us/initTriollaCarousels";
import { mountTriollaHeaderPill } from "../about-us/mountTriollaHeaderPill";
import { mountTriollaSnapshotRevealStack } from "./mountTriollaSnapshotRevealStack";
import type { TriollaSnapshotRevealPreset } from "./mountTriollaSnapshotRevealStack";
import type { TriollaPortfolioSnapshotDeps } from "./TriollaPortfolioSnapshotClient";
import { initTriollaLottie } from "./initTriollaLottie";
import { useSnapshotHistoryRestoreKey } from "./useSnapshotHistoryRestoreKey";

/**
 * Rewrite asset paths in HTML:
 * 1. Remove triolla.io font links (CORS blocked)
 * 2. (consolidated snapshots only) Remove hash suffixes and point /assets/* → _consolidated
 *
 * Full-theme pages (e.g. careers) use per-folder mirrors (`/assets/careers-he/...`); those
 * URLs must stay intact so CSS url() and <img> resolve next to the snapshot stylesheets.
 */
function rewriteAssetPaths(root: HTMLElement, consolidateStaticAssets: boolean): void {
  // Remove triolla.io font links - they cause CORS errors
  root.querySelectorAll("link[href*='triolla.io'][href*='fonts']").forEach((el) => {
    el.remove();
  });

  if (consolidateStaticAssets) {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "/assets/_consolidated/fonts.css";
    root.insertAdjacentElement("afterbegin", fontLink);
  }

  if (!consolidateStaticAssets) return;

  // Rewrite other asset paths
  root.querySelectorAll("[src], [srcset], [href]").forEach((el) => {
    const src = el.getAttribute("src");
    if (src && src.includes("/assets/")) {
      const filename = src.split('/').pop()?.replace(/(_[a-f0-9]{8})+(\.[a-z0-9]+)?(?=[?#]|$)/gi, '$2') || '';
      const rewritten = `/assets/_consolidated/${filename}`;
      if (rewritten !== src) el.setAttribute("src", rewritten);
    }

    const srcset = el.getAttribute("srcset");
    if (srcset && srcset.includes("/assets/")) {
      const rewritten = srcset.replace(/\/assets\/[^\/]+\/([^\s,]+)/g, (_match, filename) => {
        const clean = filename.replace(/(_[a-f0-9]{8})+(\.[a-z0-9]+)?(?=[?#\s,]|$)/gi, '$2');
        return `/assets/_consolidated/${clean}`;
      });
      if (rewritten !== srcset) el.setAttribute("srcset", rewritten);
    }

    const href = el.getAttribute("href");
    if (href && href.includes("/assets/")) {
      const filename = href.split('/').pop()?.replace(/(_[a-f0-9]{8})+(\.[a-z0-9]+)?(?=[?#]|$)/gi, '$2') || '';
      const rewritten = `/assets/_consolidated/${filename}`;
      if (rewritten !== href) el.setAttribute("href", rewritten);
    }
  });
}

export type TriollaBilingualPortfolioSnapshotClientProps = {
  lang: "en" | "he";
  depsEn: TriollaPortfolioSnapshotDeps;
  depsHe: TriollaPortfolioSnapshotDeps;
  fragmentUrlEn: string;
  fragmentUrlHe: string;
  pageLabel: string;
  landingSlugEn: string;
  landingSlugHe: string;
  assetDirEn: string;
  assetDirHe: string;
  /** Passed to `mountTriollaSnapshotRevealStack` (default **technology**). */
  revealPreset?: TriollaSnapshotRevealPreset;
};

function depsForLang(
  lang: "en" | "he",
  depsEn: TriollaPortfolioSnapshotDeps,
  depsHe: TriollaPortfolioSnapshotDeps,
): TriollaPortfolioSnapshotDeps {
  return lang === "he" ? depsHe : depsEn;
}

export function TriollaBilingualPortfolioSnapshotClient({
  lang,
  depsEn,
  depsHe,
  fragmentUrlEn,
  fragmentUrlHe,
  pageLabel,
  landingSlugEn,
  landingSlugHe,
  assetDirEn,
  assetDirHe,
  revealPreset = "technology",
}: TriollaBilingualPortfolioSnapshotClientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const disposeRevealRef = useRef<(() => void) | null>(null);
  const disposeHeaderPillRef = useRef<(() => void) | null>(null);
  const disposeFaqRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const { bodyClass, dataRsssl } = depsForLang(lang, depsEn, depsHe);
  const historyRestoreKey = useSnapshotHistoryRestoreKey();

  const depsEnKey = [
    depsEn.assetBase,
    depsEn.pathEncoding ?? "",
    ...depsEn.css,
    ...depsEn.js,
  ].join("\0");
  const depsHeKey = [
    depsHe.assetBase,
    depsHe.pathEncoding ?? "",
    ...depsHe.css,
    ...depsHe.js,
  ].join("\0");

  useLayoutEffect(() => {
    installSnapshotPluginStubs();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    setPhase("loading");
    const prevRoot = rootRef.current;
    if (prevRoot) prevRoot.innerHTML = "";

    const snap = depsForLang(lang, depsEn, depsHe);
    const { css, js, pathEncoding } = snap;
    const assetBaseUrl = snap.assetBase.replace(/\/$/, "");
    const hrefFor = (file: string) => snapshotAssetUrl(assetBaseUrl, file, pathEncoding);
    const fragmentUrl = lang === "he" ? fragmentUrlHe : fragmentUrlEn;

    (async () => {
      try {
        installSnapshotPluginStubs();
        const consolidateStaticAssets = snap.assetBase.includes("_consolidated");
        if (consolidateStaticAssets) {
          await loadStylesheet("/assets/_consolidated/fonts.css");
        }

        await loadStylesheetsParallel(css.map((file) => hrefFor(file)));
        if (cancelled) return;

        const res = await fetch(fragmentUrl, { signal: ac.signal });
        if (!res.ok) throw new Error("fragment fetch failed");
        let html = await res.text();
        if (cancelled) return;

        // Pre-process HTML: strip triolla.io font links BEFORE injection
        html = html.replace(/<link[^>]*href=['"]https?:\/\/[^'"]*triolla\.io[^'"]*fonts[^'"]*['"][^>]*>/gi, '');

        let el = rootRef.current;
        if (!el) {
          await new Promise<void>((r) =>
            requestAnimationFrame(() => requestAnimationFrame(() => r())),
          );
          el = rootRef.current;
        }
        if (!el) throw new Error("snapshot root not mounted");
        el.innerHTML = html;
        el.setAttribute("dir", lang === "he" ? "rtl" : "ltr");

        await injectSharedFaq(el, lang);
        await injectSharedFooter(el);

        rewriteAssetPaths(el, consolidateStaticAssets);
        rewriteTriollaNavLinks(el);
        if (lang === "he") {
          localizeContactStripForHebrew(el);
        }
        await waitForSnapshotFonts();

        for (const file of js) {
          if (cancelled) return;
          await loadScript(hrefFor(file));
          if (file.endsWith(".js") && (file.includes("lottie") || file.includes("bodymovin"))) {
            initTriollaLottie(el);
          }
        }

        initTriollaConveyorTicker(el);
        initTriollaOwlCarousels(el);
        const $ = (window as unknown as { jQuery?: (sel: Window) => { trigger: (ev: string) => void } })
          .jQuery;
        $?.(window).trigger("resize");

        window.dispatchEvent(new Event("DOMContentLoaded"));
        window.dispatchEvent(new Event("load"));
        $?.(window).trigger("load");

        if (cancelled) return;

        disposeRevealRef.current?.();
        disposeRevealRef.current = mountTriollaSnapshotRevealStack(el, revealPreset);
        disposeHeaderPillRef.current?.();
        disposeHeaderPillRef.current = mountTriollaHeaderPill(el);
        disposeFaqRef.current?.();
        disposeFaqRef.current = mountTriollaFaqAccordion(el);
        setPhase("ready");
      } catch (e) {
        if (cancelled) return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
      disposeRevealRef.current?.();
      disposeRevealRef.current = null;
      disposeHeaderPillRef.current?.();
      disposeHeaderPillRef.current = null;
      disposeFaqRef.current?.();
      disposeFaqRef.current = null;
    };
  }, [lang, depsEnKey, depsHeKey, fragmentUrlEn, fragmentUrlHe, revealPreset, historyRestoreKey]);

  const landingSlug = lang === "he" ? landingSlugHe : landingSlugEn;
  const assetDir = lang === "he" ? assetDirHe : assetDirEn;

  return (
    <>
      {phase === "loading" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fafafa",
            color: "#666",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Loading…
        </div>
      )}
      {phase === "error" && (
        <div
          style={{
            padding: "2rem",
            color: "#b91c1c",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Could not load the {pageLabel} snapshot ({lang === "he" ? "Hebrew" : "English"}). Re-download{" "}
          <code>landing-page/{landingSlug}</code>, run <code>extract_snapshot_fragment.py</code>, and sync{" "}
          <code>public/assets/{assetDir}</code>.
        </div>
      )}
      <div
        ref={rootRef}
        className={bodyClass}
        {...(dataRsssl != null ? { "data-rsssl": dataRsssl } : {})}
        suppressHydrationWarning
        style={{
          visibility: phase === "ready" ? "visible" : "hidden",
          minHeight: "100vh",
        }}
      />
    </>
  );
}
