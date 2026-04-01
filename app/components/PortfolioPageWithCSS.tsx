"use client";

import { useEffect, useRef, useState } from "react";
import { initTriollaOwlCarousels } from "../about-us/initTriollaCarousels";
import { mountTriollaHeaderPill } from "../about-us/mountTriollaHeaderPill";
import { initTriollaConveyorTicker } from "../lib/initTriollaConveyorTicker";
import { mountTriollaFaqAccordion } from "../lib/mountTriollaFaqAccordion";
import { mountTriollaFooterAccordion } from "../lib/mountTriollaFooterAccordion";
import { rewriteTriollaNavLinks } from "../lib/rewriteTriollaNavLinks";
import { mountTriollaMobileMenu } from "../lib/mountTriollaMobileMenu";
import {
  injectSharedFaq,
  injectSharedFooter,
  localizeContactStripForHebrew,
} from "../lib/triollaSharedBodyInject";
import { installSnapshotPluginStubs } from "../lib/snapshotPluginStubs";
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

function normalizeInjectedHeaderAssetUrls(html: string): string {
  return html
    .replaceAll(
      "https://triolla.io/wp-content/themes/triolla/images/hamburger.svg",
      "/images/hamburger.svg",
    )
    .replaceAll(
      "https://triolla.io/wp-content/themes/triolla/images/hamburger_white.svg",
      "/images/hamburger_white.svg",
    )
    .replace(/\/assets\/[^"'\s]+\/hamburger\.svg/gi, "/images/hamburger.svg")
    .replace(/\/assets\/[^"'\s]+\/hamburger_white\.svg/gi, "/images/hamburger_white.svg");
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

        for (const cssFile of deps.css) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = `${assetBaseNorm}/${cssFile}`;
          document.head.appendChild(link);
          injectedLinks.push(link);
        }

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
            chromeHtml = normalizeInjectedHeaderAssetUrls(chromeHtml);
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

        disposePillRef.current?.();
        disposePillRef.current = mountTriollaHeaderPill(root);
        disposeFaqRef.current?.();
        disposeFaqRef.current = mountTriollaFaqAccordion(root);

        for (const jsFile of deps.js) {
          if (cancelled) return;
          const src = `${assetBaseNorm}/${jsFile}`;
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

        disposeMobileMenuRef.current?.();
        disposeMobileMenuRef.current = mountTriollaMobileMenu(root);
        disposeFooterAccordionRef.current?.();
        disposeFooterAccordionRef.current = mountTriollaFooterAccordion(root);

        setPhase("ready");
      } catch (error) {
        console.error("Failed to load assets:", error);
        if (!cancelled) setPhase("error");
      }
    };

    void loadAssets();

    return () => {
      cancelled = true;
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
