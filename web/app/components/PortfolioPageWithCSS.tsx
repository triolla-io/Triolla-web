"use client";

import { useEffect, useRef } from "react";
import { HebrewNavigation } from "@/components/HebrewNavigation";
import { initTriollaOwlCarousels } from "../about-us/initTriollaCarousels";
import { mountTriollaHeaderPill } from "../about-us/mountTriollaHeaderPill";
import { initTriollaConveyorTicker } from "../lib/initTriollaConveyorTicker";
import { mountTriollaFaqAccordion } from "../lib/mountTriollaFaqAccordion";
import { rewriteTriollaNavLinks } from "../lib/rewriteTriollaNavLinks";
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

/**
 * WordPress/triolla theme scripts expect inline globals. Portfolio React pages
 * have no wp_head output — define safe defaults before external bundles run.
 *
 * Reuse `installSnapshotPluginStubs` so GDPR `main.js` gets `moove_frontend_gdpr_scripts`
 * with `scripts_defined` (strict/thirdparty shapes); `{}` caused `.strict` crashes.
 */
function installTriollaPortfolioWindowStubs(): void {
  installSnapshotPluginStubs();
  const w = globalThis as typeof globalThis & Record<string, unknown>;
  /** Portfolio snapshots relied on Bodhi processing nested SVGs more than blog pages. */
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

  useEffect(() => {
    let cancelled = false;
    const injectedLinks: HTMLLinkElement[] = [];
    const injectedScripts: HTMLScriptElement[] = [];

    const loadAssets = async () => {
      installTriollaPortfolioWindowStubs();
      try {
        const response = await fetch(depsPath);
        const deps: Deps = await response.json();
        if (cancelled) return;

        const assetBaseNorm = deps.assetBase.replace(/\/$/, "");

        for (const cssFile of deps.css) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = `${assetBaseNorm}/${cssFile}`;
          document.head.appendChild(link);
          injectedLinks.push(link);
        }

        for (const jsFile of deps.js) {
          if (cancelled) return;
          const src = `${assetBaseNorm}/${jsFile}`;
          const scriptEl = await loadScriptSequential(src);
          injectedScripts.push(scriptEl);
        }

        if (cancelled) return;

        const root = mainContainerRef.current;
        if (!root) return;

        root.querySelector("[data-triolla-portfolio-chrome]")?.remove();

        if (lang !== "he" && !root.querySelector(".header.headnewact")) {
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
        await injectSharedFooter(root);
        rewriteTriollaNavLinks(root);
        if (lang === "he") {
          localizeContactStripForHebrew(root);
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

        if (cancelled) return;

        disposePillRef.current?.();
        disposePillRef.current = mountTriollaHeaderPill(root);
        initTriollaConveyorTicker(root);
        initTriollaOwlCarousels(root);
        disposeFaqRef.current?.();
        disposeFaqRef.current = mountTriollaFaqAccordion(root);
      } catch (error) {
        console.error("Failed to load assets:", error);
      }
    };

    void loadAssets();

    return () => {
      cancelled = true;
      disposePillRef.current?.();
      disposePillRef.current = null;
      disposeFaqRef.current?.();
      disposeFaqRef.current = null;
      injectedLinks.forEach((el) => el.remove());
      injectedScripts.forEach((el) => el.remove());
    };
  }, [depsPath, lang]);

  return (
    <>
      {lang === "he" ? <HebrewNavigation /> : null}
      <PortfolioPageTemplate ref={mainContainerRef} data={data} />
    </>
  );
}
