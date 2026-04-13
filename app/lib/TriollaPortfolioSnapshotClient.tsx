"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ensureJConveyorTickerPlugin,
  initTriollaConveyorTicker,
} from "./initTriollaConveyorTicker";
import { ensurePortfolioFaqWrapShown, mountTriollaFaqAccordion } from "./mountTriollaFaqAccordion";
import {
  rewriteTriollaNavLinks,
  stripTriollaMarketingOriginFromHtmlHrefs,
} from "./rewriteTriollaNavLinks";
import {
  mountTriollaMobileMenu,
  stripJQueryMenutoggleClickHandlers,
} from "./mountTriollaMobileMenu";
import { normalizeHeaderAssetUrls } from "./normalizeHeaderAssetUrls";
import { installSnapshotPluginStubs } from "./snapshotPluginStubs";
import {
  loadScript,
  loadStylesheetsParallelOrdered,
  waitForSnapshotFonts,
} from "./snapshotLoader";
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
  const disposeMobileMenuRef = useRef<(() => void) | null>(null);
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
        await loadStylesheetsParallelOrdered(css.map((file) => hrefFor(file)));

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
              const chromeRes = await fetch(effectiveChromeUrl, {
                cache: "no-store",
                signal: ac.signal,
              });
              if (chromeRes.ok) {
                let chromeHtml = await chromeRes.text();
                chromeHtml = chromeHtml
                  .split("%%ASSET_BASE%%")
                  .join(assetBase.replace(/\/$/, ""));
                chromeHtml = normalizeHeaderAssetUrls(chromeHtml);
                chromeHtml = stripTriollaMarketingOriginFromHtmlHrefs(chromeHtml);
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
        await new Promise<void>((r) =>
          requestAnimationFrame(() => requestAnimationFrame(() => r())),
        );

        if (cancelled) return;

        disposeMobileMenuRef.current?.();
        disposeMobileMenuRef.current = mountTriollaMobileMenu(el);

        if (cancelled) return;
        setPhase("ready");

        // #region agent log — h1 fix verification
        (() => {
          const h1 = el.querySelector('h1');
          if (!h1) return;
          const cs = window.getComputedStyle(h1);
          fetch('http://127.0.0.1:7442/ingest/16494b4c-3094-42cb-81b5-aad92874073c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'803122'},body:JSON.stringify({sessionId:'803122',location:'TriollaPortfolioSnapshotClient:ready',message:'h1 post-fix',data:{path:window.location.pathname,innerWidth:window.innerWidth,computedFontSize:cs.fontSize,runId:'post-fix'},timestamp:Date.now(),hypothesisId:'H-h1-fix'})}).catch(()=>{});
        })();
        // #endregion

        // #region agent log — contact button audit
        (() => {
          // Look in the whole doc (chrome is injected into header, outside `el`)
          const sel = '.header_contact a, .header_whatsapp a, .header_book a, [class*="contact"] a, a[href*="contact"]';
          const btns = Array.from(document.querySelectorAll(sel)).slice(0, 6).map(b => {
            const cs = window.getComputedStyle(b as Element);
            const r = (b as Element).getBoundingClientRect();
            return {
              text: (b as Element).textContent?.trim().slice(0, 40),
              class: (b as Element).className?.slice(0, 80),
              parentClass: (b as Element).parentElement?.className?.slice(0, 60),
              display: cs.display, visibility: cs.visibility, opacity: cs.opacity,
              fontSize: cs.fontSize, color: cs.color, bg: cs.backgroundColor,
              width: cs.width, height: cs.height,
              rect: { top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
              overflow: cs.overflow, zIndex: cs.zIndex,
            };
          });
          fetch('http://127.0.0.1:7442/ingest/16494b4c-3094-42cb-81b5-aad92874073c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'803122'},body:JSON.stringify({sessionId:'803122',location:'TriollaPortfolioSnapshotClient:ready',message:'contact btn audit',data:{path:window.location.pathname,innerWidth:window.innerWidth,btns},timestamp:Date.now(),hypothesisId:'H-contact'})}).catch(()=>{});
        })();
        // #endregion

        try {
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

          if (el.querySelector(".company_triker")) {
            await ensureJConveyorTickerPlugin(assetBase);
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
          stripJQueryMenutoggleClickHandlers(el);
          rewriteTriollaNavLinks(el);
        } catch (deferredErr) {
          console.error("[snapshot] portfolio snapshot deferred scripts/init failed:", deferredErr);
        }
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
      disposeMobileMenuRef.current?.();
      disposeMobileMenuRef.current = null;
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

  useLayoutEffect(() => {
    if (phase !== "ready") return;
    const el = rootRef.current;
    if (!el) return;
    rewriteTriollaNavLinks(el);
  }, [phase, lang]);

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
          dir={lang === "he" ? "rtl" : "ltr"}
          className={bodyClass}
          {...(dataRsssl != null ? { "data-rsssl": dataRsssl } : {})}
          suppressHydrationWarning
          style={{
            opacity: ready ? 1 : 0,
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
