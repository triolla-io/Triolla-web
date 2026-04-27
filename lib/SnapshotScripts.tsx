"use client";

import { useEffect, useRef } from "react";
import type { SnapshotEntry } from "./snapshotRegistry";

interface Props {
  entry: SnapshotEntry;
}

declare global {
  interface Window {
    gsap?: { registerPlugin?: (plugin: unknown) => void };
    ScrollTrigger?: unknown;
  }
}

export default function SnapshotScripts({ entry }: Props) {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    if (entry.dir === "rtl") {
      document.documentElement.dir = "rtl";
    }

    for (const href of entry.css) {
      if (document.querySelector(`link[href="${href}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    const looksLikeJson = (src: string): boolean => {
      const t = src.trimStart();
      return t.startsWith("{") || t.startsWith("[");
    };

    // Third-party tracking domains deferred until first user interaction,
    // mirroring WPRocket's rocketlazyloadscript behaviour on the real site.
    // Without this, Lighthouse (no interaction) fires GTM → LinkedIn/Google Ads
    // cookies + deprecated AttributionReporting API → Best Practices tanks.
    const DEFERRED_PATTERN = /googletagmanager\.com|snap\.licdn|px\.ads\.linkedin|connect\.facebook\.net|js\.hs-scripts|js\.hsforms|assets\.calendly|static\.hotjar|js\.clarity\.ms|googleadservices|doubleclick\.net|ahrefs|hsadspixel|hs-banner|hubspot|\/cache\/min\/1\/\d+\.js/i;

    const isDeferred = (code: string) => DEFERRED_PATTERN.test(code);

    let deferredCallbacks: Array<() => void> = [];
    let deferFired = false;

    const fireDeferredOnInteraction = () => {
      if (deferFired) return;
      deferFired = true;
      for (const cb of deferredCallbacks) cb();
      deferredCallbacks = [];
      const events = ["mousedown", "touchstart", "keydown", "scroll", "wheel"] as const;
      for (const e of events) window.removeEventListener(e, fireDeferredOnInteraction, { capture: true });
    };
    const INTERACTION_EVENTS = ["mousedown", "touchstart", "keydown", "scroll", "wheel"] as const;
    for (const e of INTERACTION_EVENTS) {
      window.addEventListener(e, fireDeferredOnInteraction, { passive: true, capture: true, once: true });
    }

    const inlineByPosition = new Map<number, string[]>();
    const deferredInlineByPosition = new Map<number, string[]>();
    for (const s of entry.inlineScripts) {
      if (looksLikeJson(s.code)) continue;
      if (isDeferred(s.code)) {
        const arr = deferredInlineByPosition.get(s.position) ?? [];
        arr.push(s.code);
        deferredInlineByPosition.set(s.position, arr);
      } else {
        const arr = inlineByPosition.get(s.position) ?? [];
        arr.push(s.code);
        inlineByPosition.set(s.position, arr);
      }
    }

    const execInline = (code: string) => {
      const el = document.createElement("script");
      el.textContent = code;
      document.body.appendChild(el);
    };

    const runInlineAt = (pos: number) => {
      for (const code of inlineByPosition.get(pos) ?? []) execInline(code);
      for (const code of deferredInlineByPosition.get(pos) ?? []) {
        deferredCallbacks.push(() => execInline(code));
      }
    };

    const registerGsap = () => {
      if (window.gsap?.registerPlugin && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
      }
    };

    const reEstablishJQuery = () => {
      const w = window as unknown as Record<string, unknown>;
      if (w["jQuery"] && w["$"] !== w["jQuery"]) {
        w["$"] = w["jQuery"];
      }
    };

    const loadScript = (src: string): Promise<void> =>
      new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
          reEstablishJQuery();
          if (entry.gsapHook && /ScrollTrigger\.min\.js/i.test(src)) registerGsap();
          resolve();
        };
        script.onerror = () => resolve();
        document.body.appendChild(script);
      });

    const loadScriptsSequentially = async () => {
      for (let i = 0; i < entry.js.length; i++) {
        runInlineAt(i);
        const src = entry.js[i];

        if (document.querySelector(`script[src="${src}"]`)) {
          reEstablishJQuery();
          if (entry.gsapHook && /ScrollTrigger\.min\.js/i.test(src)) registerGsap();
          continue;
        }

        if (DEFERRED_PATTERN.test(src)) {
          deferredCallbacks.push(() => loadScript(src));
          continue;
        }

        await loadScript(src);
      }

      runInlineAt(entry.js.length);
      reEstablishJQuery();
    };

    loadScriptsSequentially().then(() => {
      try {
        document.dispatchEvent(new Event("DOMContentLoaded"));
      } catch {}
      try {
        window.dispatchEvent(new Event("load"));
      } catch {}
      setTimeout(() => {
        document.body.classList.add("loaded");
        try {
          window.dispatchEvent(new Event("scroll"));
        } catch {}
      }, entry.loadedDelayMs ?? 800);
    });
  }, [entry]);

  return null;
}
