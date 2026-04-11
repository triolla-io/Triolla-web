"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { rewriteTriollaNavLinks } from "../../lib/rewriteTriollaNavLinks";
import { installSnapshotPluginStubs } from "../../lib/snapshotPluginStubs";
import {
  loadScript,
  loadStylesheetsParallelOrdered,
  waitForSnapshotFonts,
} from "../../lib/snapshotLoader";
import { snapshotAssetUrl } from "../../lib/snapshotAssetUrl";
import aboutUsDepsEn from "./about-us-deps.json";
import aboutUsDepsHe from "./about-us-he-deps.json";
import { initTriollaOwlCarousels } from "./initTriollaCarousels";
import { mountTriollaSnapshotRevealStack } from "../../lib/mountTriollaSnapshotRevealStack";
import { mountTriollaHeaderPill } from "./mountTriollaHeaderPill";
import { initTriollaLottie } from "../../lib/initTriollaLottie";
import {
  mountTriollaMobileMenu,
  stripJQueryMenutoggleClickHandlers,
} from "../../lib/mountTriollaMobileMenu";

function getFragmentUrl(lang: string): string {
  return lang === "he"
    ? "/fragments/about-us-he-body.html"
    : "/fragments/about-us-body.html";
}

function getAssetBase(lang: string): string {
  return lang === "he" ? "/assets/about-us-he" : "/assets/about-us";
}

type SnapshotDeps = {
  bodyClass: string;
  dataRsssl: string | null;
  css: string[];
  js: string[];
  pathEncoding?: "segments";
};

function depsForLang(lang: string): SnapshotDeps {
  if (lang === "he") return aboutUsDepsHe as SnapshotDeps;
  return aboutUsDepsEn as SnapshotDeps;
}

export function AboutUsClient({ lang }: { lang: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const disposeRevealRef = useRef<(() => void) | null>(null);
  const disposeHeaderPillRef = useRef<(() => void) | null>(null);
  const disposeMobileMenuRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const { bodyClass, dataRsssl } = depsForLang(lang);

  useEffect(() => {
    let cancelled = false;
    const { css, js, pathEncoding } = depsForLang(lang);
    const assetBaseUrl = getAssetBase(lang);
    const hrefFor = (file: string) => snapshotAssetUrl(assetBaseUrl, file, pathEncoding);

    (async () => {
      try {
        installSnapshotPluginStubs();
        const fragmentUrl = getFragmentUrl(lang);

        await loadStylesheetsParallelOrdered(css.map((file) => hrefFor(file)));

        const res = await fetch(fragmentUrl);
        if (!res.ok) throw new Error("fragment fetch failed");
        const html = await res.text();
        if (cancelled) return;

        const el = rootRef.current;
        if (!el) return;
        el.innerHTML = html;
        el.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
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
            await loadScript(hrefFor(file));
            if (file.includes("lottie")) {
              initTriollaLottie(el);
            }
          }

          initTriollaOwlCarousels(el);
          const $ = (window as unknown as { jQuery?: (sel: Window) => { trigger: (ev: string) => void } })
            .jQuery;
          $?.(window).trigger("resize");

          window.dispatchEvent(new Event("DOMContentLoaded"));
          window.dispatchEvent(new Event("load"));

          if (cancelled) return;
          disposeRevealRef.current?.();
          disposeRevealRef.current = mountTriollaSnapshotRevealStack(el, "about");
          disposeHeaderPillRef.current?.();
          disposeHeaderPillRef.current = mountTriollaHeaderPill(el);
          stripJQueryMenutoggleClickHandlers(el);
          rewriteTriollaNavLinks(el);
        } catch (deferredErr) {
          console.error("[snapshot] about-us (lang) deferred scripts/init failed:", deferredErr);
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
      disposeMobileMenuRef.current?.();
      disposeMobileMenuRef.current = null;
    };
  }, [lang]);

  useLayoutEffect(() => {
    if (phase !== "ready") return;
    const el = rootRef.current;
    if (!el) return;
    rewriteTriollaNavLinks(el);
  }, [phase, lang]);

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
          Could not load the About page snapshot. From <code>web/</code>, run{" "}
          <code>npm run sync:about</code>
          {lang === "he" ? (
            <>
              {" "}
              (English) and <code>npm run sync:about:he</code> after downloading{" "}
              <code>landing-page/triolla-io-about-us-he</code> with{" "}
              <code>_download_snapshot.py</code>
            </>
          ) : null}
          . Ensure <code>public/assets/about-us{lang === "he" ? "-he" : ""}</code> and the matching
          fragment exist.
        </div>
      )}
      <div
        ref={rootRef}
        data-triolla-snapshot="1"
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
