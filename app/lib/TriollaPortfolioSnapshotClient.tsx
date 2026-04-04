"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { initTriollaConveyorTicker } from "./initTriollaConveyorTicker";
import { ensurePortfolioFaqWrapShown, mountTriollaFaqAccordion } from "./mountTriollaFaqAccordion";
import { rewriteTriollaNavLinks } from "./rewriteTriollaNavLinks";
import { mountTriollaMobileMenu } from "./mountTriollaMobileMenu";
import { normalizeHeaderAssetUrls } from "./normalizeHeaderAssetUrls";
import { installSnapshotPluginStubs } from "./snapshotPluginStubs";
import { loadScript, loadStylesheet, waitForSnapshotFonts } from "./snapshotLoader";
import { snapshotAssetUrl } from "./snapshotAssetUrl";
import { initTriollaOwlCarousels } from "../about-us/initTriollaCarousels";
import { mountTriollaHeaderPill } from "../about-us/mountTriollaHeaderPill";
import { mountTriollaSnapshotRevealStack } from "./mountTriollaSnapshotRevealStack";
import { initTriollaLottie } from "./initTriollaLottie";
import { useSnapshotHistoryRestoreKey } from "./useSnapshotHistoryRestoreKey";

export type TriollaPortfolioSnapshotDeps = {
  assetBase: string;
  bodyClass: string;
  dataRsssl: string | null;
  css: string[];
  js: string[];
  /** JSON imports infer `string`; runtime only uses `"segments"`. */
  pathEncoding?: "segments" | string;
};

export type TriollaPortfolioSnapshotClientProps = {
  fragmentUrl: string;
  deps: TriollaPortfolioSnapshotDeps;
  /** e.g. "Fintech & Finance" */
  pageLabel: string;
  /** landing-page folder, e.g. triolla-io-fintech-finance */
  landingSlug: string;
  /** public/assets/<dir> */
  assetDir: string;
  /** If set, injects snapshot chrome header (en or he) before rendering content */
  lang?: "en" | "he";
  /** Optional custom chrome URL; if not provided and lang is set, uses _portfolio-site-chrome-{lang}.html */
  chromeUrl?: string;
  /**
   * Runs after snapshot CSS/JS are loaded and synthetic `DOMContentLoaded` / `load` fire.
   * Return a disposer to run on unmount / before the next load (e.g. kill GSAP context).
   */
  afterScripts?: (root: HTMLElement) => void | (() => void);
};

export function TriollaPortfolioSnapshotClient({
  fragmentUrl,
  deps,
  pageLabel,
  landingSlug,
  assetDir,
  lang,
  chromeUrl,
  afterScripts,
}: TriollaPortfolioSnapshotClientProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const disposeRevealRef = useRef<(() => void) | null>(null);
  const disposeAfterScriptsRef = useRef<(() => void) | null>(null);
  const disposeHeaderPillRef = useRef<(() => void) | null>(null);
  const disposeFaqRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const { assetBase, bodyClass, dataRsssl, css, js, pathEncoding } = deps;
  const historyRestoreKey = useSnapshotHistoryRestoreKey();

  const hrefFor = (file: string) => snapshotAssetUrl(assetBase, file, pathEncoding);

  const cssKey = css.join("\0");
  const jsKey = js.join("\0");

  useLayoutEffect(() => {
    installSnapshotPluginStubs();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    setPhase("loading");
    const prevRoot = rootRef.current;
    if (prevRoot) prevRoot.innerHTML = "";

    (async () => {
      try {
        installSnapshotPluginStubs();
        for (const file of css) {
          if (cancelled) return;
          try {
            await loadStylesheet(hrefFor(file));
          } catch (err) {
            console.error(`Failed to load CSS: ${file}`, err);
          }
        }

        const res = await fetch(fragmentUrl, { signal: ac.signal });
        if (!res.ok) throw new Error("fragment fetch failed");
        let html = await res.text();
        if (cancelled) return;
        html = normalizeHeaderAssetUrls(html);

        let el = rootRef.current;
        if (!el) {
          await new Promise<void>((r) =>
            requestAnimationFrame(() => requestAnimationFrame(() => r())),
          );
          el = rootRef.current;
        }
        if (!el) throw new Error("snapshot root not mounted");
        el.innerHTML = html;

        if (lang) {
          el.querySelector("[data-triolla-portfolio-chrome]")?.remove();
          const isHeNav = !!el.querySelector(".menu-header-menu-he-container");
          if (!isHeNav) {
            el.querySelector(".headerticker")?.remove();
            el.querySelector(".header.headnewact")?.remove();
          }
          if (!el.querySelector(".header.headnewact")) {
            const effectiveChromeUrl =
              chromeUrl ||
              (lang === "he"
                ? "/fragments/_portfolio-site-chrome-he.html"
                : "/fragments/_portfolio-site-chrome-en.html");
            try {
              const chromeRes = await fetch(effectiveChromeUrl, { signal: ac.signal });
              if (chromeRes.ok) {
                let chromeHtml = await chromeRes.text();
                chromeHtml = chromeHtml
                  .split("%%ASSET_BASE%%")
                  .join(assetBase.replace(/\/$/, ""));
                chromeHtml = normalizeHeaderAssetUrls(chromeHtml);
                chromeHtml = `<div data-triolla-portfolio-chrome="1" style="display:contents">${chromeHtml.trim()}</div>`;
                const holder = document.createElement("div");
                holder.innerHTML = chromeHtml;
                while (holder.firstChild) {
                  el.insertBefore(holder.firstChild, el.firstChild);
                }
              }
            } catch (err) {
              console.warn(`Failed to inject chrome for lang=${lang}`, err);
            }
          }
        }

        ensurePortfolioFaqWrapShown(el);
        rewriteTriollaNavLinks(el);
        await waitForSnapshotFonts();

        for (const file of js) {
          if (cancelled) return;
          const src = hrefFor(file);
          await loadScript(src);
          if (
            file.endsWith(".js") &&
            (file.includes("lottie") || file.includes("bodymovin"))
          ) {
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

        if (cancelled) return;
        disposeAfterScriptsRef.current?.();
        disposeAfterScriptsRef.current = null;
        if (afterScripts) {
          const d = afterScripts(el);
          disposeAfterScriptsRef.current = typeof d === "function" ? d : null;
        }

        disposeRevealRef.current?.();
        disposeRevealRef.current = mountTriollaSnapshotRevealStack(el, "technology");
        disposeHeaderPillRef.current?.();
        disposeHeaderPillRef.current = mountTriollaHeaderPill(el);
        disposeFaqRef.current?.();
        disposeFaqRef.current = mountTriollaFaqAccordion(el);

        if (lang) {
          mountTriollaMobileMenu(el);
        }

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
      disposeAfterScriptsRef.current?.();
      disposeAfterScriptsRef.current = null;
      disposeRevealRef.current?.();
      disposeRevealRef.current = null;
      disposeHeaderPillRef.current?.();
      disposeHeaderPillRef.current = null;
      disposeFaqRef.current?.();
      disposeFaqRef.current = null;
    };
  }, [
    afterScripts,
    assetBase,
    css,
    cssKey,
    js,
    jsKey,
    pathEncoding,
    fragmentUrl,
    lang,
    chromeUrl,
    historyRestoreKey,
  ]);

  const ready = phase === "ready";

  return (
    <>
      {phase === "error" && (
        <div
          style={{
            padding: "2rem",
            color: "#b91c1c",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Could not load the {pageLabel} page snapshot. Re-download{" "}
          <code>landing-page/{landingSlug}</code>, run <code>extract_snapshot_fragment.py</code>, and sync{" "}
          <code>public/assets/{assetDir}</code>.
        </div>
      )}
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <div
          ref={rootRef}
          data-triolla-snapshot="1"
          dir="ltr"
          className={bodyClass}
          {...(dataRsssl != null ? { "data-rsssl": dataRsssl } : {})}
          suppressHydrationWarning
          style={{
            visibility: ready ? "visible" : "hidden",
            pointerEvents: ready ? "auto" : "none",
            minHeight: "100vh",
          }}
        />
        {phase === "loading" && (
          <div
            aria-busy="true"
            aria-live="polite"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
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
      </div>
    </>
  );
}
