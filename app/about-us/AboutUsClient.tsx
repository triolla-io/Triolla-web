"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { rewriteTriollaNavLinks } from "../lib/rewriteTriollaNavLinks";
import { installSnapshotPluginStubs } from "../lib/snapshotPluginStubs";
import {
  loadScript,
  loadStylesheetsParallelOrdered,
  waitForSnapshotFonts,
} from "../lib/snapshotLoader";
import aboutDeps from "./about-us-deps.json";
import { initTriollaOwlCarousels } from "./initTriollaCarousels";
import { mountTriollaSnapshotRevealStack } from "../lib/mountTriollaSnapshotRevealStack";
import { mountTriollaHeaderPill } from "./mountTriollaHeaderPill";
import { initTriollaLottie } from "../lib/initTriollaLottie";
import {
  mountTriollaMobileMenu,
  stripJQueryMenutoggleClickHandlers,
} from "../lib/mountTriollaMobileMenu";

const FRAGMENT_URL = "/fragments/about-us-body.html";

export function AboutUsClient() {
  const rootRef = useRef<HTMLDivElement>(null);
  const disposeRevealRef = useRef<(() => void) | null>(null);
  const disposeHeaderPillRef = useRef<(() => void) | null>(null);
  const disposeMobileMenuRef = useRef<(() => void) | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const { assetBase, bodyClass, dataRsssl, css, js } = aboutDeps;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        installSnapshotPluginStubs();
        await loadStylesheetsParallelOrdered(css.map((file) => `${assetBase}/${file}`));

        const res = await fetch(FRAGMENT_URL);
        if (!res.ok) throw new Error("fragment fetch failed");
        const html = await res.text();
        if (cancelled) return;

        const el = rootRef.current;
        if (!el) return;
        el.innerHTML = html;
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
          // Load scripts with smart ordering: critical dependencies first, rest in parallel
          // jQuery and jquery plugins must load in sequence, but other scripts can load in parallel
          const criticalScripts = [
            js[2], // jquery.min.js (index 2)
            ...js.slice(3, 7), // jquery plugins (indices 3-6)
            js[20], // all.js (must load last)
          ];
          const parallelScripts = js.filter((_, i) => !criticalScripts.includes(js[i]));

          // Load jQuery first
          if (cancelled) return;
          await loadScript(`${assetBase}/${js[2]}`);

          // Load jquery plugins in parallel
          if (cancelled) return;
          await Promise.all(js.slice(3, 7).map((file) => loadScript(`${assetBase}/${file}`)));

          // Load remaining scripts in parallel (except all.js)
          if (cancelled) return;
          await Promise.all(
            parallelScripts.map((file) => {
              const src = `${assetBase}/${file}`;
              if (file === "lottie.min.js") {
                return loadScript(src).then(() => initTriollaLottie(el));
              }
              return loadScript(src);
            })
          );

          // Finally load all.js
          if (cancelled) return;
          await loadScript(`${assetBase}/${js[20]}`);

          const gsapWin = window as unknown as {
            gsap?: { registerPlugin?: (plugin: unknown) => void };
            ScrollTrigger?: unknown;
          };
          if (gsapWin.gsap?.registerPlugin && gsapWin.ScrollTrigger) {
            gsapWin.gsap.registerPlugin(gsapWin.ScrollTrigger);
          }

          initTriollaOwlCarousels(el);
          const $ = (window as unknown as { jQuery?: (sel: Window) => { trigger: (ev: string) => void } })
            .jQuery;
          $?.(window).trigger("resize");

          // Trigger load events - all.js listens for these to initialize animations
          window.dispatchEvent(new Event("DOMContentLoaded"));
          window.dispatchEvent(new Event("load"));

          // all.js will add .loaded class after 800ms via $(window).on('load', ...).
          // We add it here as a fallback to ensure animations trigger
          const addLoadedClass = () => {
            if (!document.body.classList.contains("loaded")) {
              document.body.classList.add("loaded");
            }
          };

          // Wait 300ms to let all.js add it first, then add as fallback if needed
          await new Promise<void>((resolve) => {
            setTimeout(() => {
              addLoadedClass();
              resolve();
            }, 300);
          });

          if (cancelled) return;

          // Wait for CSS animations triggered by .loaded class to complete
          // Most animations are 1.2s based on animation.css
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 1500);
          });

          if (cancelled) return;
          disposeRevealRef.current?.();
          disposeRevealRef.current = mountTriollaSnapshotRevealStack(el, "about");
          disposeHeaderPillRef.current?.();
          disposeHeaderPillRef.current = mountTriollaHeaderPill(el);
          stripJQueryMenutoggleClickHandlers(el);
          rewriteTriollaNavLinks(el);
        } catch (deferredErr) {
          console.error("[snapshot] about-us deferred scripts/init failed:", deferredErr);
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
  }, [assetBase, css, js]);

  useLayoutEffect(() => {
    if (phase !== "ready") return;
    const el = rootRef.current;
    if (!el) return;
    rewriteTriollaNavLinks(el);
  }, [phase]);

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
          Could not load the About page snapshot. Run{" "}
          <code>npm run sync:about</code> from <code>web/</code> and ensure{" "}
          <code>public/assets/triolla-io-about-us</code> is populated.
        </div>
      )}
      <div
        ref={rootRef}
        data-triolla-snapshot="1"
        dir="ltr"
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
