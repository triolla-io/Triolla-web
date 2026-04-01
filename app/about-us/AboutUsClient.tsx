"use client";

import { useEffect, useRef, useState } from "react";
import { rewriteTriollaNavLinks } from "../lib/rewriteTriollaNavLinks";
import { installSnapshotPluginStubs } from "../lib/snapshotPluginStubs";
import { loadScript, loadStylesheet } from "../lib/snapshotLoader";
import aboutDeps from "./about-us-deps.json";
import { initTriollaOwlCarousels } from "./initTriollaCarousels";
import { mountTriollaSnapshotRevealStack } from "../lib/mountTriollaSnapshotRevealStack";
import { mountTriollaHeaderPill } from "./mountTriollaHeaderPill";
import { initTriollaLottie } from "../lib/initTriollaLottie";
import { mountTriollaMobileMenu } from "../lib/mountTriollaMobileMenu";

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
        for (const file of css) {
          if (cancelled) return;
          await loadStylesheet(`${assetBase}/${file}`);
        }

        const res = await fetch(FRAGMENT_URL);
        if (!res.ok) throw new Error("fragment fetch failed");
        const html = await res.text();
        if (cancelled) return;

        const el = rootRef.current;
        if (!el) return;
        el.innerHTML = html;
        rewriteTriollaNavLinks(el);

        for (const file of js) {
          if (cancelled) return;
          const src = `${assetBase}/${file}`;
          await loadScript(src);
          if (file === "lottie.min.js") {
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
        disposeMobileMenuRef.current?.();
        disposeMobileMenuRef.current = mountTriollaMobileMenu(el);
        setPhase("ready");
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
