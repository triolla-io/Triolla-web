"use client";

import { useEffect, useRef, useState } from "react";
import { initTriollaOwlCarousels } from "../about-us/initTriollaCarousels";
import { mountTriollaHeaderPill } from "../about-us/mountTriollaHeaderPill";
import { initTriollaConveyorTicker } from "../lib/initTriollaConveyorTicker";
import { mountTriollaFaqAccordion } from "../lib/mountTriollaFaqAccordion";
import { mountTriollaFooterAccordion } from "../lib/mountTriollaFooterAccordion";
import { rewriteTriollaNavLinks } from "../lib/rewriteTriollaNavLinks";
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

  useEffect(() => {
    let cancelled = false;
    const injectedLinks: HTMLLinkElement[] = [];
    const injectedScripts: HTMLScriptElement[] = [];
    setPhase("loading");

    const loadAssets = async () => {
      installTriollaPortfolioWindowStubs();
      try {
        const response = await fetch(depsPath);
        const deps: Deps = await response.json();
        if (cancelled) return;

        const assetBaseNorm = normalizeAssetBase(deps.assetBase);

        const cssHrefs = deps.css.map((cssFile) =>
          snapshotAssetUrl(assetBaseNorm, cssFile),
        );
        const newCssLinks = await loadStylesheetsParallelOrdered(cssHrefs);
        injectedLinks.push(...newCssLinks);

        const root = mainContainerRef.current;
        if (!root) return;

        root.querySelector("[data-triolla-portfolio-chrome]")?.remove();

        if (!root.querySelector(".header.headnewact")) {
          const chromeUrl =
            lang === "he"
              ? "/fragments/_portfolio-site-chrome-he.html"
              : "/fragments/_portfolio-site-chrome-en.html";
          const chromeRes = await fetch(chromeUrl);
          if (chromeRes.ok) {
            let chromeHtml = await chromeRes.text();
            chromeHtml = chromeHtml
              .split("%%ASSET_BASE%%")
              .join(assetBaseNorm);
            chromeHtml = normalizeHeaderAssetUrls(chromeHtml);
            chromeHtml = `<div data-triolla-portfolio-chrome="1" style="display:contents">${chromeHtml.trim()}</div>`;
            const holder = document.createElement("div");
            holder.innerHTML = chromeHtml;
            while (holder.firstChild) {
              root.insertBefore(holder.firstChild, root.firstChild);
            }
          }
        }

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
          for (const jsFile of deps.js) {
            if (cancelled) return;
            const src = snapshotAssetUrl(assetBaseNorm, jsFile);
            try {
              const scriptEl = await loadScriptSequential(src);
              injectedScripts.push(scriptEl);
            } catch (scriptError) {
              console.warn("Skipping failed script:", src, scriptError);
            }
          }

          if (cancelled) return;

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
            zIndex: 9999,
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
          Could not load page assets.
        </div>
      )}
      <div style={{ visibility: phase === "ready" ? "visible" : "hidden", minHeight: "100vh" }}>
        <PortfolioPageTemplate ref={mainContainerRef} data={data} />
      </div>
    </>
  );
}
