"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { initTriollaConveyorTicker } from "./lib/initTriollaConveyorTicker";
import { mountTriollaFaqAccordion } from "./lib/mountTriollaFaqAccordion";
import {
  mountTriollaMobileMenu,
  stripJQueryMenutoggleClickHandlers,
} from "./lib/mountTriollaMobileMenu";
import { rewriteTriollaNavLinks } from "./lib/rewriteTriollaNavLinks";
import { installSnapshotPluginStubs } from "./lib/snapshotPluginStubs";
import {
  loadScript,
  loadStylesheetsParallelOrdered,
  waitForSnapshotFonts,
} from "./lib/snapshotLoader";
import { snapshotAssetUrl } from "./lib/snapshotAssetUrl";
import { initTriollaOwlCarousels } from "./about-us/initTriollaCarousels";
import { mountTriollaHeaderPill } from "./about-us/mountTriollaHeaderPill";
import homeDepsEn from "./home-deps.json";
import homeDepsHe from "./home-he-deps.json";
import { mountTriollaSnapshotRevealStack } from "./lib/mountTriollaSnapshotRevealStack";
import { initTriollaLottie } from "./lib/initTriollaLottie";
import { useSnapshotHistoryRestoreKey } from "./lib/useSnapshotHistoryRestoreKey";

type SnapshotDeps = {
  assetBase: string;
  bodyClass: string;
  dataRsssl: string | null;
  css: string[];
  js: string[];
  pathEncoding?: "segments";
};

export function HomeClient() {
  const pathname = usePathname();
  const historyRestoreKey = useSnapshotHistoryRestoreKey();
  const pathNorm = (pathname ?? "").replace(/\/+$/, "") || "/";
  const isHebrewHome = pathNorm === "/he";

  const deps = useMemo(
    () => (isHebrewHome ? homeDepsHe : homeDepsEn) as SnapshotDeps,
    [isHebrewHome],
  );
  const fragmentUrl = isHebrewHome
    ? "/fragments/home-he-body.html"
    : "/fragments/home-body.html";

  const rootRef = useRef<HTMLDivElement>(null);
  const disposeRevealRef = useRef<(() => void) | null>(null);
  const disposeHeaderPillRef = useRef<(() => void) | null>(null);
  const disposeFaqRef = useRef<(() => void) | null>(null);
  const disposeMobileMenuRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const { assetBase, bodyClass, dataRsssl, css, js, pathEncoding } = deps;

  const hrefFor = (file: string) => snapshotAssetUrl(assetBase, file, pathEncoding);

  useEffect(() => {
    let cancelled = false;
    setPhase("loading");
    const prevRoot = rootRef.current;
    if (prevRoot) prevRoot.innerHTML = "";

    (async () => {
      try {
        installSnapshotPluginStubs();
        await loadStylesheetsParallelOrdered(css.map((file) => hrefFor(file)));

        const res = await fetch(fragmentUrl);
        if (!res.ok) throw new Error("fragment fetch failed");
        let html = await res.text();
        // Some snapshots reference non-existent /assets/home[-he]/hamburger*.svg.
        // Normalize to stable shared image paths so mobile icon always renders.
        html = html
          .replaceAll('/assets/_shared/hamburger.svg', '/images/hamburger.svg')
          .replaceAll('/assets/_shared/hamburger_white.svg', '/images/hamburger_white.svg')
          .replaceAll('/assets/_shared/hamburger.svg', '/images/hamburger.svg')
          .replaceAll('/assets/_shared/hamburger_white.svg', '/images/hamburger_white.svg');
        if (cancelled) return;

        const el = rootRef.current;
        if (!el) return;
        el.innerHTML = html;
        el.setAttribute("dir", isHebrewHome ? "rtl" : "ltr");
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

          const gsapWin = window as unknown as {
            gsap?: { registerPlugin?: (plugin: unknown) => void; to?: (target: unknown, vars: unknown) => void };
            ScrollTrigger?: unknown;
          };
          if (gsapWin.gsap?.registerPlugin && gsapWin.ScrollTrigger) {
            gsapWin.gsap.registerPlugin(gsapWin.ScrollTrigger);
          }

          initTriollaConveyorTicker(el);
          initTriollaOwlCarousels(el);
          const $ = (window as unknown as { jQuery?: (sel: Window) => { trigger: (ev: string) => void } })
            .jQuery;
          $?.(window).trigger("resize");

          window.dispatchEvent(new Event("DOMContentLoaded"));
          window.dispatchEvent(new Event("load"));

          setTimeout(() => {
            document.body.classList.add("loaded");
          }, 800);

          if (cancelled) return;
          disposeRevealRef.current?.();
          disposeRevealRef.current = mountTriollaSnapshotRevealStack(el, "technology");
          disposeHeaderPillRef.current?.();
          disposeHeaderPillRef.current = mountTriollaHeaderPill(el);
          disposeFaqRef.current?.();
          disposeFaqRef.current = mountTriollaFaqAccordion(el);
          stripJQueryMenutoggleClickHandlers(el);
        } catch (deferredErr) {
          console.error("[snapshot] home deferred scripts/init failed:", deferredErr);
        }
      } catch {
        if (!cancelled) setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
      disposeRevealRef.current?.();
      disposeRevealRef.current = null;
      disposeHeaderPillRef.current?.();
      disposeHeaderPillRef.current = null;
      disposeFaqRef.current?.();
      disposeFaqRef.current = null;
      disposeMobileMenuRef.current?.();
      disposeMobileMenuRef.current = null;
    };
  }, [assetBase, css, js, pathEncoding, fragmentUrl, historyRestoreKey, isHebrewHome]);

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
          Could not load the home page snapshot. English:{" "}
          <code>landing-page/triolla-io-home</code> → <code>public/assets/home</code>. Hebrew:{" "}
          <code>landing-page/triolla-io-home-he</code> → <code>public/assets/home-he</code> and{" "}
          <code>fragments/home-he-body.html</code>.
        </div>
      )}
      <div
        ref={rootRef}
        data-triolla-snapshot="1"
        dir={isHebrewHome ? "rtl" : "ltr"}
        className={bodyClass}
        {...(dataRsssl != null ? { "data-rsssl": dataRsssl } : {})}
        suppressHydrationWarning
        style={{
          opacity: phase === "ready" ? 1 : 0,
          pointerEvents: phase === "ready" ? "auto" : "none",
          minHeight: "100vh",
        }}
      />
    </>
  );
}
