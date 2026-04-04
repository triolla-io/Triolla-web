"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { initTriollaOwlCarousels } from "../about-us/initTriollaCarousels";
import { mountTriollaHeaderPill } from "../about-us/mountTriollaHeaderPill";
import { initTriollaConveyorTicker } from "../lib/initTriollaConveyorTicker";
import { mountTriollaFaqAccordion } from "../lib/mountTriollaFaqAccordion";
import { mountTriollaFooterAccordion } from "../lib/mountTriollaFooterAccordion";
import {
  rewriteTriollaNavLinks,
  stripTriollaMarketingOriginFromHtmlHrefs,
} from "../lib/rewriteTriollaNavLinks";
import {
  mountTriollaMobileMenu,
  stripJQueryMenutoggleClickHandlers,
} from "../lib/mountTriollaMobileMenu";
import { normalizeHeaderAssetUrls } from "../lib/normalizeHeaderAssetUrls";
import {
  injectSharedFaq,
  injectSharedFooter,
  localizeContactStripForHebrew,
} from "../lib/triollaSharedBodyInject";
import { installSnapshotPluginStubs } from "../lib/snapshotPluginStubs";
import { mountTriollaSnapshotRevealStack } from "../lib/mountTriollaSnapshotRevealStack";
import { loadStylesheetsParallelOrdered, waitForSnapshotFonts } from "../lib/snapshotLoader";
import { snapshotAssetUrl } from "../lib/snapshotAssetUrl";
import {
  PortfolioPageTemplate,
  type PortfolioPageData,
} from "./PortfolioPageTemplate";

export type { PortfolioPageData };

export interface PortfolioPageWithCSSProps {
  data: PortfolioPageData;
  depsPath: string;
  lang?: "en" | "he";
}

interface Deps {
  css: string[];
  js: string[];
  assetBase: string;
}

function normalizeAssetBase(assetBase: string): string {
  const trimmed = assetBase.replace(/\/$/, "");
  return trimmed.replace(/^\/_assets\//, "/assets/");
}

function installTriollaPortfolioWindowStubs(): void {
  installSnapshotPluginStubs();
  const w = globalThis as typeof globalThis & Record<string, unknown>;
  w.svgSettings = { skipNested: false };
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  w.gform_theme_config = {
    config_nonce: "",
    common: {
      form: {
        honeypot: { version_hash: "" },
        ajax: {
          ajaxurl: origin ? `${origin}/` : "/",
          ajax_submission: "",
          ajax_submission_nonce: "",
          i18n: { unknown_error: "Unknown error" },
        },
      },
    },
    hmr_dev: "",
    public_path: "/",
  };
}

function loadScriptSequential(src: string): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
}

/** Basename for dependency matching (handles `/shared/foo.js` paths). */
function scriptBasename(path: string): string {
  const seg = path.split("/").pop() ?? path;
  return seg.toLowerCase();
}

/**
 * Load snapshot JS with safe parallelism: metaview overlaps following chain;
 * independent scripts between ScrollTrigger and all.js load in parallel.
 */
async function loadPortfolioSnapshotScripts(
  jsFiles: string[],
  assetBaseNorm: string,
  cancelled: () => boolean,
  injectedScripts: HTMLScriptElement[],
): Promise<void> {
  const metaIndex = jsFiles.findIndex((f) => /metaview/i.test(scriptBasename(f)));
  const allIndex = jsFiles.findIndex((f) => /(^|[^a-z])all\.js/i.test(scriptBasename(f)));
  const stIndex = jsFiles.findIndex((f) =>
    /scrolltrigger\.min\.js/i.test(scriptBasename(f)),
  );

  let metaviewPromise: Promise<unknown> = Promise.resolve();

  const pushLoaded = async (src: string): Promise<void> => {
    try {
      const el = await loadScriptSequential(src);
      injectedScripts.push(el);
    } catch (e) {
      console.warn("Skipping failed script:", src, e);
    }
  };

  for (let i = 0; i < jsFiles.length; i++) {
    if (cancelled()) return;

    if (i === metaIndex) {
      continue;
    }

    // Between ScrollTrigger and all.js: parallelize (single Promise.all still OK for one file).
    if (
      stIndex >= 0 &&
      allIndex > stIndex + 1 &&
      i === stIndex + 1
    ) {
      const middle = jsFiles.slice(stIndex + 1, allIndex);
      await Promise.allSettled(
        middle.map((f) => pushLoaded(snapshotAssetUrl(assetBaseNorm, f))),
      );
      i = allIndex - 1;
      continue;
    }

    if (stIndex >= 0 && allIndex >= 0 && i > stIndex && i < allIndex) {
      continue;
    }

    const src = snapshotAssetUrl(assetBaseNorm, jsFiles[i]);
    await pushLoaded(src);

    if (
      metaIndex > 0 &&
      i === metaIndex - 1 &&
      !cancelled()
    ) {
      const metaSrc = snapshotAssetUrl(assetBaseNorm, jsFiles[metaIndex]);
      metaviewPromise = pushLoaded(metaSrc);
    }
  }

  if (cancelled()) return;
  await metaviewPromise;
}

export function PortfolioPageWithCSS({
  data,
  depsPath,
  lang = "en",
}: PortfolioPageWithCSSProps) {
  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  const disposePillRef = useRef<(() => void) | null>(null);
  const disposeFaqRef = useRef<(() => void) | null>(null);
  const disposeFooterAccordionRef = useRef<(() => void) | null>(null);
  const disposeMobileMenuRef = useRef<(() => void) | null>(null);
  const disposeRevealRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [triollaChromeHtml, setTriollaChromeHtml] = useState("");

  useEffect(() => {
    let cancelled = false;
    const injectedLinks: HTMLLinkElement[] = [];
    const injectedScripts: HTMLScriptElement[] = [];
    setTriollaChromeHtml("");
    setPhase("loading");

    const loadAssets = async () => {
      installTriollaPortfolioWindowStubs();
      try {
        const response = await fetch(depsPath, { cache: "no-store" });
        const deps: Deps = await response.json();
        if (cancelled) return;

        const assetBaseNorm = normalizeAssetBase(deps.assetBase);

        const cssHrefs = deps.css.map((cssFile) =>
          snapshotAssetUrl(assetBaseNorm, cssFile),
        );
        const newCssLinks = await loadStylesheetsParallelOrdered(cssHrefs);
        injectedLinks.push(...newCssLinks);

        let chromeInner = "";
        const chromeUrl =
          lang === "he"
            ? "/fragments/_portfolio-site-chrome-he.html"
            : "/fragments/_portfolio-site-chrome-en.html";
        const chromeRes = await fetch(chromeUrl, { cache: "no-store" });
        if (chromeRes.ok) {
          let chromeHtml = await chromeRes.text();
          chromeHtml = chromeHtml.split("%%ASSET_BASE%%").join(assetBaseNorm);
          chromeHtml = normalizeHeaderAssetUrls(chromeHtml);
          chromeHtml = stripTriollaMarketingOriginFromHtmlHrefs(chromeHtml);
          chromeInner = chromeHtml.trim();
        }

        setTriollaChromeHtml(chromeInner);

        // Two RAFs: React needs a full commit cycle to render dangerouslySetInnerHTML
        await new Promise<void>((r) =>
          requestAnimationFrame(() => requestAnimationFrame(() => r())),
        );

        const root = mainContainerRef.current;
        if (!root) return;

        if (cancelled) return;

        await injectSharedFaq(root, lang);
        await injectSharedFooter(root, lang);
        rewriteTriollaNavLinks(root);
        if (lang === "he") {
          localizeContactStripForHebrew(root);
        }

        if (cancelled) return;

        await waitForSnapshotFonts();
        await new Promise<void>((r) =>
          requestAnimationFrame(() => requestAnimationFrame(() => r())),
        );

        if (cancelled) return;

        disposeMobileMenuRef.current?.();
        disposeMobileMenuRef.current = mountTriollaMobileMenu(root);

        if (cancelled) return;
        setPhase("ready");

        try {
          await loadPortfolioSnapshotScripts(
            deps.js,
            assetBaseNorm,
            () => cancelled,
            injectedScripts,
          );

          if (cancelled) return;

          const gsapWin = window as unknown as {
            gsap?: { registerPlugin?: (plugin: unknown) => void };
            ScrollTrigger?: unknown;
          };
          if (gsapWin.gsap?.registerPlugin && gsapWin.ScrollTrigger) {
            gsapWin.gsap.registerPlugin(gsapWin.ScrollTrigger);
          }

          const $ = (
            window as unknown as {
              jQuery?: (sel: Window) => { trigger: (ev: string) => void };
            }
          ).jQuery;
          $?.(window).trigger("resize");
          window.dispatchEvent(new Event("DOMContentLoaded"));
          window.dispatchEvent(new Event("load"));
          $?.(window).trigger("load");

          initTriollaConveyorTicker(root);
          initTriollaOwlCarousels(root);

          disposeRevealRef.current?.();
          disposeRevealRef.current = mountTriollaSnapshotRevealStack(
            root,
            "technology",
          );

          disposePillRef.current?.();
          disposePillRef.current = mountTriollaHeaderPill(root);
          disposeFaqRef.current?.();
          disposeFaqRef.current = mountTriollaFaqAccordion(root);

          stripJQueryMenutoggleClickHandlers(root);
          rewriteTriollaNavLinks(root);
          disposeFooterAccordionRef.current?.();
          disposeFooterAccordionRef.current = mountTriollaFooterAccordion(root);
        } catch (deferredErr) {
          console.error("[snapshot] portfolio page deferred scripts/init failed:", deferredErr);
        }
      } catch (error) {
        console.error("Failed to load assets:", error);
        if (!cancelled) setPhase("error");
      }
    };

    void loadAssets();

    return () => {
      cancelled = true;
      disposeRevealRef.current?.();
      disposeRevealRef.current = null;
      disposePillRef.current?.();
      disposePillRef.current = null;
      disposeFaqRef.current?.();
      disposeFaqRef.current = null;
      disposeFooterAccordionRef.current?.();
      disposeFooterAccordionRef.current = null;
      disposeMobileMenuRef.current?.();
      disposeMobileMenuRef.current = null;
      injectedLinks.forEach((el) => el.remove());
      injectedScripts.forEach((el) => el.remove());
    };
  }, [depsPath, lang]);

  /** React may re-commit chrome when `phase` becomes ready; theme `all.js` runs after — re-apply local hrefs. */
  useLayoutEffect(() => {
    if (phase !== "ready") return;
    const root = mainContainerRef.current;
    if (!root) return;
    rewriteTriollaNavLinks(root);
  }, [phase, lang]);

  return (
    <>
      {/*
        Do not hide page content with opacity:0 while loading — that delays LCP until
        "ready" (fonts + menu) and Lighthouse can report very poor LCP. Keep content paintable;
        use a slim top bar instead of a full-screen opaque overlay.
      */}
      {phase === "loading" && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            zIndex: 9999,
            background:
              "linear-gradient(90deg, #e5e5e5 0%, #111 45%, #e5e5e5 90%)",
            backgroundSize: "200% 100%",
            animation: "triolla-portfolio-loading-bar 1.1s ease-in-out infinite",
          }}
        />
      )}
      <style>{`@keyframes triolla-portfolio-loading-bar {
        0% { background-position: 100% 0; }
        100% { background-position: -100% 0; }
      }`}</style>
      {phase === "error" && (
        <div
          style={{
            padding: "2rem",
            color: "#b91c1c",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Could not load page assets.
        </div>
      )}
      <div style={{ minHeight: "100vh" }} aria-busy={phase === "loading"}>
        <PortfolioPageTemplate
          ref={mainContainerRef}
          data={data}
          triollaPortfolioChromeHtml={triollaChromeHtml}
        />
      </div>
    </>
  );
}
