"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SnapshotEntry } from "./snapshotRegistry";
import { mountWidgets, unmountWidgets } from "./widgets";

interface Props {
  entry: SnapshotEntry;
  bodyHtml: string;
  widgetProps?: Record<string, { type: string; props: unknown }> | null;
}

// Minimal jQuery type for our shim. We only need the fluent methods we actually call.
// Using `unknown`-based opaque types keeps this free of @types/jquery dependency.
type JQueryLike = {
  length: number;
  data(key: string): unknown;
  each(cb: (this: HTMLElement, i: number, el: HTMLElement) => void): JQueryLike;
  trigger(eventName: string): JQueryLike;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
type JQueryStatic = ((selector: string | HTMLElement) => JQueryLike) & {
  fn?: { owlCarousel?: unknown };
};

declare global {
  interface Window {
    gsap?: { registerPlugin?: (plugin: unknown) => void };
    ScrollTrigger?: unknown;
    jQuery?: JQueryStatic;
    $?: JQueryStatic;
    gform_theme_config?: {
      common?: {
        form?: {
          honeypot?: { version_hash?: string };
          ajax?: {
            ajaxurl?: string;
            ajax_submission_nonce?: string;
            i18n?: Record<string, string>;
          };
        };
      };
      hmr_dev?: string;
      public_path?: string;
      config_nonce?: string;
    };
  }
}

function getSnapshotClientRoot(): HTMLElement | null {
  return document.querySelector("[data-snapshot-client]");
}

/** theme: .portfolio_text h1, .homemaintopone h1 use opacity:0 until .portfolio_text.show (etc.) */
function flushSnapshotVisibility(root: HTMLElement | null): void {
  const el = root ?? getSnapshotClientRoot();
  if (!el) return;
  try {
    document.body.classList.add("loaded");
  } catch (_) {}
  el.classList.add("show");
  el.querySelectorAll("*").forEach((n) => n.classList.add("show"));
  // Direct targets (in case a plugin sets inline opacity after .show)
  el.querySelectorAll(
    ".homemaintopone, .portfolio_text, .hommaitopinmob, .hometopimages",
  ).forEach((n) => n.classList.add("show"));
}

function announceSnapshotToLegacyScripts(): void {
  try { document.dispatchEvent(new Event("DOMContentLoaded")); } catch (_) {}
  try { window.dispatchEvent(new Event("load")); } catch (_) {}
  try { window.dispatchEvent(new Event("scroll")); } catch (_) {}
  try { window.dispatchEvent(new Event("rocket-allScriptsLoaded")); } catch (_) {}
}

function replayPostSnapshotPaint(): void {
  flushSnapshotVisibility(getSnapshotClientRoot());
  announceSnapshotToLegacyScripts();
}

function patchGfNumberFormats(): void {
  try {
    type GfGlobal = { number_formats?: Record<string | number, unknown> };
    const w = window as unknown as { gf_global?: GfGlobal };
    if (!w.gf_global) w.gf_global = {};
    const gfg = w.gf_global;
    gfg.number_formats = new Proxy((gfg.number_formats ?? {}) as Record<string | number, unknown>, {
      get(target, key: string | symbol) {
        const k = key as string | number;
        return k in target ? target[k] : { isNumber: false, isPrice: false };
      },
    });
  } catch (_) {}
}

function installGfGlobalInterceptor(): void {
  try {
    type GfGlobal = { number_formats?: Record<string | number, unknown> };
    const w = window as unknown as { gf_global?: GfGlobal };
    let _val = w.gf_global;
    Object.defineProperty(w, "gf_global", {
      configurable: true,
      get() { return _val; },
      set(v: GfGlobal) {
        _val = v;
        // Re-patch immediately after GF overwrites gf_global
        if (_val && typeof _val === "object") patchGfNumberFormats();
      },
    });
  } catch (_) {}
}

const _IMG_REVEAL_STYLE_ID = "snap-img-reveal-styles";
const _SKIP_ANCESTOR_SELECTORS = ["header", "nav", ".header_menu", ".hmenumob", ".site-header"];

function installImageRevealObserver(root: HTMLElement | null): void {
  if (!root || typeof IntersectionObserver === "undefined") return;

  if (!document.getElementById(_IMG_REVEAL_STYLE_ID)) {
    const style = document.createElement("style");
    style.id = _IMG_REVEAL_STYLE_ID;
    style.textContent = `
      img.snap-img-reveal {
        opacity: 0 !important;
        transform: translateY(40px) !important;
        transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1) !important;
        will-change: opacity, transform;
      }
      img.snap-img-reveal.snap-img-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }

  const images = Array.from(root.querySelectorAll<HTMLImageElement>("img"));
  const toAnimate = images.filter((img) => {
    if (img.classList.contains("snap-img-reveal")) return false;
    for (const sel of _SKIP_ANCESTOR_SELECTORS) {
      if (img.closest(sel)) return false;
    }
    const w = img.getAttribute("width");
    const h = img.getAttribute("height");
    if (w && h && Number(w) < 80 && Number(h) < 80) return false;
    return true;
  });

  if (toAnimate.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        (e.target as HTMLImageElement).classList.add("snap-img-visible");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
  );

  for (const img of toAnimate) {
    img.classList.add("snap-img-reveal");
    io.observe(img);
  }
}

function installWowObserver(root: HTMLElement): void {
  if (typeof IntersectionObserver === "undefined") return;
  const wowEls = Array.from(root.querySelectorAll<HTMLElement>(".wow:not(.animated)"));
  if (wowEls.length === 0) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("animated");
        io.unobserve(e.target);
      }
    },
    { threshold: 0.1 }
  );
  for (const el of wowEls) io.observe(el);
}

function installSnapshotPluginStubs(): void {
  const w = window as Window;
  installGfGlobalInterceptor();
  patchGfNumberFormats();
  // Stub WOW.js — theme scripts call new WOW().init() which re-scans .wow elements
  // and re-applies .animated, causing animations to fire multiple times. Replace with
  // a no-op; our installWowObserver handles the single-fire viewport reveal instead.
  if (!(w as unknown as Record<string, unknown>).WOW) {
    (w as unknown as Record<string, unknown>).WOW = function WOWStub() {
      return { init: function() {} };
    };
  }
  if (typeof w.gform_theme_config !== "undefined") return;
  w.gform_theme_config = {
    common: {
      form: {
        honeypot: { version_hash: "" },
        ajax: {
          ajaxurl: "/",
          ajax_submission_nonce: "",
          i18n: {
            step_announcement: "Step %1$s of %2$s, %3$s",
            unknown_error: "There was an unknown error processing your request. Please try again.",
          },
        },
      },
    },
    hmr_dev: "",
    public_path: "/",
    config_nonce: "",
  };
}

/**
 * Generic sequential snapshot loader.
 *
 * Loads CSS links + JS scripts in the exact order stored in SnapshotEntry.css/js —
 * preserving the cascade and plugin-init timing from the original site.
 *
 * Three critical timing rules enforced:
 *   1. GSAP ScrollTrigger registered after ScrollTrigger.min.js, before all.js
 *   2. document.body.classList.add("loaded") at loadedDelayMs (default 800ms)
 *   3. Inline scripts re-inserted at their original position indices
 */
function SnapshotClientImpl({ entry, bodyHtml, widgetProps }: Props) {
  const pathname = usePathname();
  const injectedRef = useRef(false);
  const prevPathnameRef = useRef<string | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  /** Bumps on popstate and bfcache pageshow so the one-shot script pipeline re-runs when JS state survives without a remount. */
  const [historyBust, setHistoryBust] = useState(0);


  // Synchronous: home h1 (and other opacity:0 → .show) must not wait on the
  // one-shot script pipeline — it can be skipped (injectedRef) on client nav/back.
  // Always resolve the root from the document — rootRef can lag one frame behind
  // dangerouslySetInnerHTML; Next may also serve cached RSC with identical deps
  // so this effect can skip; MutationObserver (below) covers that case.
  const routeKey = `${pathname}::${entry.slug}::${entry.locale}::${entry.loadOrderSha}`;
  useLayoutEffect(() => {
    const root = getSnapshotClientRoot() ?? rootRef.current;
    const run = () => {
      flushSnapshotVisibility(getSnapshotClientRoot() ?? rootRef.current);
    };
    run();
    installImageRevealObserver(root);
    queueMicrotask(run);
    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
  }, [routeKey, bodyHtml]);

  // When React replaces fragment HTML (incl. client "back" with fresh RSC children),
  // run visibility flush without relying on useEffect dependency identity.
  useEffect(() => {
    const el = getSnapshotClientRoot() ?? rootRef.current;
    if (!el) return;
    if (typeof MutationObserver === "undefined") return;
    const mo = new MutationObserver(() => {
      flushSnapshotVisibility(el);
    });
    mo.observe(el, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [routeKey]);

  useEffect(() => {
    const runFlush = () => {
      flushSnapshotVisibility(getSnapshotClientRoot() ?? rootRef.current);
      try { window.dispatchEvent(new Event("scroll")); } catch (_) {}
    };
    const onPop = () => {
      // History back/forward: React may not remount; injectedRef can stay true.
      // Bust the one-shot effect so script + .show pipeline runs after the new route paints.
      injectedRef.current = false;
      setHistoryBust((n) => n + 1);
      // Route swap can run after this tick — flush on the next two frames.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          runFlush();
        });
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    // Next may reuse a client instance across client navigations; the old guard
    // (injectedRef) stayed true and skipped the whole pipeline on "back" / revisit.
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      injectedRef.current = false;
    }
    prevPathnameRef.current = pathname;

    if (injectedRef.current) return;
    injectedRef.current = true;
    installSnapshotPluginStubs();

    // Hydrate any ``data-react-widget`` marker found in the injected HTML.
    // No-op when no markers or no widgetProps — keeps the fallback path
    // working unchanged on sites where detect_widgets matched nothing.
    void mountWidgets(rootRef.current, widgetProps ?? null);

    // Set HTML lang and dir attributes for locale
    if (entry.locale) {
      document.documentElement.lang = entry.locale;
    }
    if (entry.dir === "rtl") {
      document.documentElement.dir = "rtl";
    } else if (document.documentElement.dir !== "ltr") {
      document.documentElement.dir = "ltr";
    }

    // 1. CSS is now SSR'd via <link rel="stylesheet"> from page.tsx, so CSS
    //    downloads can start during the HTML parse — before hydration. The
    //    browser deduplicates identical hrefs, so we only re-inject any CSS
    //    that somehow got stripped (defensive; should be a no-op in prod).
    for (const href of entry.css) {
      if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    // 1b. Ticker FOUC guard.
    //
    // jctkr re-runs when synthetic load/DOMContentLoaded events fire below.
    // During re-initialization it removes .jctkr-initialized, resets <ul>
    // inline styles and li display, causing a vertical-list flash for 1-3 s.
    //
    // Fix: watch each .jctkr-initialized element with a MutationObserver.
    // The moment the class is removed (re-init starts) we hide the element.
    // The moment the class comes back (re-init done) we reveal it instantly.
    // No fixed timeouts — reveal is exactly synchronized with jctkr finishing.
    if (typeof MutationObserver !== "undefined") {
      document.querySelectorAll<HTMLElement>(".jctkr-initialized").forEach((el) => {
        const mo = new MutationObserver(() => {
          if (!el.classList.contains("jctkr-initialized")) {
            el.style.visibility = "hidden";
            const mo2 = new MutationObserver(() => {
              if (el.classList.contains("jctkr-initialized")) {
                mo2.disconnect();
                el.style.visibility = "";
              }
            });
            mo2.observe(el, { attributes: true, attributeFilter: ["class"] });
            mo.disconnect();
          }
        });
        mo.observe(el, { attributes: true, attributeFilter: ["class"] });
      });
    }

    // 2. Inject JS scripts sequentially — each script waits for the previous to load.
    //
    // Group inline scripts by position into an array-per-position map.
    // Object.fromEntries silently drops duplicates when multiple inline scripts
    // share the same position (e.g. 11 scripts at position 13 on the about page);
    // a Map<number, string[]> preserves all of them in their original order.
    //
    // Defensive filter: older extract_fragment runs captured non-JS payloads
    // (e.g. JSON-LD blocks starting with `{"@context"`) as inline "scripts".
    // Injecting them as <script> would throw SyntaxError on the first colon.
    // Strip anything that clearly isn't JavaScript so this component stays safe
    // against registries produced by older extractors.
    const _looksLikeJson = (src: string): boolean => {
      const t = src.trimStart();
      return t.startsWith("{") || t.startsWith("[");
    };
    // WP Rocket's lazy-loader intercepts ALL clicks (calling preventDefault) while
    // its script-loading pipeline runs. SnapshotClient already loads every script
    // sequentially, so Rocket's pipeline is redundant and actively blocks navigation.
    // Skipping this class is safe — we fire "rocket-allScriptsLoaded" manually below.
    const _isRocketLazyLoader = (src: string): boolean =>
      src.includes("RocketLazyLoadScripts");

    // Third-party tracking scripts are skipped entirely on the snapshot.
    // The snapshot is an SEO mirror — the live site already fires these pixels.
    // Loading them here: (a) tanks Best Practices via third-party cookies + deprecated APIs,
    // (b) double-counts analytics, (c) adds ~2s to page load with no benefit.
    // NOTE: assets.calendly is NOT tracking — it's the booking widget, kept enabled.
    const _TRACKING = /googletagmanager\.com|snap\.licdn|px\.ads\.linkedin|connect\.facebook\.net|js\.hs-scripts|js\.hsforms|static\.hotjar|js\.clarity\.ms|googleadservices|doubleclick\.net|ahrefs|hsadspixel|hubspot|\/cache\/min\/1\/\d+\.js/i;

    const inlineByPosition = new Map<number, string[]>();
    for (const s of entry.inlineScripts) {
      if (_looksLikeJson(s.code)) continue;
      if (_isRocketLazyLoader(s.code)) continue;
      if (_TRACKING.test(s.code)) continue;
      const arr = inlineByPosition.get(s.position) ?? [];
      arr.push(s.code);
      inlineByPosition.set(s.position, arr);
    }

    const _execInline = (code: string) => {
      const el = document.createElement("script");
      el.textContent = code;
      document.body.appendChild(el);
    };

    const _runInlineAt = (pos: number) => {
      for (const code of inlineByPosition.get(pos) ?? []) _execInline(code);
    };

    const loadScriptsSequentially = async () => {
      installSnapshotPluginStubs();

      // Kick off parallel downloads for all scripts before executing any.
      // Browser will fetch all simultaneously; execution order is still
      // enforced by the sequential loop below. This turns N×RTT into 1×RTT
      // for the download phase (e.g. 31 scripts × 150ms → ~150ms total download).
      for (const src of entry.js) {
        if (_TRACKING.test(src)) continue;
        if (/gravityforms\.min\.js/i.test(src)) continue;
        if (document.querySelector(`link[rel="preload"][href="${src}"]`)) continue;
        if (document.querySelector(`script[src="${src}"]`)) continue;
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "script";
        link.href = src;
        document.head.appendChild(link);
      }

      for (let i = 0; i < entry.js.length; i++) {
        _runInlineAt(i);
        const src = entry.js[i];

        if (document.querySelector(`script[src="${src}"]`)) {
          if (entry.gsapHook && /ScrollTrigger\.min\.js/i.test(src)) _registerGsap();
          continue;
        }

        if (_TRACKING.test(src)) continue;
        // GF validation JS crashes in snapshot env — submit is handled by our shim
        if (/gravityforms\.min\.js/i.test(src)) continue;

        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = () => {
            // WordPress loads jQuery in no-conflict mode (jQuery.noConflict() at the
            // end of jquery.min.js removes window.$). Re-establish $ = jQuery after
            // every script so plugins and inline scripts that use bare $ still work.
            const jq = (window as unknown as { jQuery?: unknown }).jQuery;
            if (jq) (window as unknown as { $: unknown }).$ = jq;

            if (entry.gsapHook && /ScrollTrigger\.min\.js/i.test(src)) {
              _registerGsap();
            }
            resolve();
          };
          script.onerror = () => resolve();
          document.body.appendChild(script);
        });
      }

      _runInlineAt(entry.js.length);
    };

    loadScriptsSequentially().then(() => {
      // 3a. Gravity Forms snapshot shim.
      //
      //     gravityforms.min.js expects a live WordPress backend for AJAX
      //     submission and accesses gf_global.number_formats[id].isNumber on
      //     every input change — both crash in the snapshot environment.
      //
      //     Fix 1: patch number_formats so index access never returns undefined.
      //     Fix 2: define gform.submission.handleButtonClick to intercept the
      //             submit button onclick, collect the form fields, and POST the
      //             payload to /api/contact — replacing the form on success.
      patchGfNumberFormats();

      try {
        type GformNS = { submission?: { handleButtonClick?: (btn: HTMLElement) => void } };
        const w = window as unknown as { gform?: GformNS };
        if (!w.gform) w.gform = {};
        if (!w.gform.submission?.handleButtonClick) {
          if (!w.gform.submission) w.gform.submission = {};
          w.gform.submission.handleButtonClick = function (btn: HTMLElement) {
            const form = btn.closest("form") as HTMLFormElement | null;
            if (!form) return;

            const data = new FormData(form);
            const payload: Record<string, unknown> = {};
            // Skip Gravity Forms internal hidden fields and the honeypot
            const GF_INTERNAL = /^(gform_|is_submit_|gf_|state_gforms|_gf_|input_13$)/;
            data.forEach((val, key) => {
              if (!GF_INTERNAL.test(key)) payload[key] = val;
            });

            const wrapper = form.closest(".gform_wrapper") as HTMLElement | null;
            if (wrapper) {
              const submitBtn = form.querySelector<HTMLInputElement>("[type=submit]");
              if (submitBtn) submitBtn.disabled = true;
            }

            fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            })
              .then((r) => {
                if (r.ok && wrapper) {
                  wrapper.innerHTML =
                    '<div class="gform_confirmation_wrapper"><div class="gform_confirmation_message">Thanks — we\'ll be in touch soon!</div></div>';
                } else if (!r.ok && wrapper) {
                  const submitBtn = form.querySelector<HTMLInputElement>("[type=submit]");
                  if (submitBtn) submitBtn.disabled = false;
                }
              })
              .catch(() => {
                if (wrapper) {
                  const submitBtn = form.querySelector<HTMLInputElement>("[type=submit]");
                  if (submitBtn) submitBtn.disabled = false;
                }
              });
          };
        }
      } catch (_) {}

      // 3. Replay lifecycle events that scripts missed because they were
      //    injected dynamically after those events already fired.
      //
      //    Scripts commonly bind handlers to:
      //      - document.addEventListener("DOMContentLoaded", …)  ← scroll-shrink, nav init
      //      - $(window).on("load", …)                           ← WOW.js init, .show classes
      //    These events have already fired by the time Next.js mounts this
      //    component, so dynamically-injected scripts never see them.
      //    Dispatching synthetic events here re-triggers those handlers.
      // FAQ accordion: pure-JS delegated handler — no jQuery dependency.
      // CSS sets .faqdetail { display: none }; we toggle inline style directly.
      // Guard prevents duplicate listeners across effect re-runs.
      try {
        const w = window as unknown as { __faqSnapshotBound?: boolean };
        if (!w.__faqSnapshotBound) {
          w.__faqSnapshotBound = true;
          const _faqStyle = document.createElement('style');
          _faqStyle.textContent = '.faqtitle a { outline: none !important; }';
          document.head.appendChild(_faqStyle);
          document.addEventListener('click', (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest?.('.faqtitle a');
            if (!anchor) return;
            e.preventDefault();
            e.stopPropagation(); // block jQuery's element-level handler from also toggling
            const faqTitle = (anchor as HTMLElement).parentElement; // .faqtitle
            const faqBox = faqTitle?.parentElement;                 // .port_faq_box
            const faqDetail = faqTitle?.nextElementSibling as HTMLElement | null; // .faqdetail
            if (!faqBox || !faqDetail) return;
            const isOpen = faqBox.classList.contains('active');
            // Close all open items
            document.querySelectorAll<HTMLElement>('.port_faq_box.active').forEach((box) => {
              box.classList.remove('active');
              const d = box.querySelector<HTMLElement>(':scope > .faqdetail');
              if (d) d.style.display = 'none';
            });
            // Open clicked item if it was closed
            if (!isOpen) {
              faqBox.classList.add('active');
              faqDetail.style.display = 'block';
            }
          }, true);
        }
      } catch (_) {}

      // Header nav dropdown — CSS hides `.header_menu li.bigmenu > ul` via
      // opacity:0; pointer-events:none. The original WP/theme JS sets inline
      // styles on click to reveal it, but never clears them — so the dropdown
      // stays open and stacks across re-clicks. Manage open/close ourselves:
      //  - click on a .bigmenu trigger toggles the dropdown
      //  - outside-click clears any open dropdown
      try {
        const w3 = window as unknown as { __navMenuSnapshotBound?: boolean };
        if (!w3.__navMenuSnapshotBound) {
          w3.__navMenuSnapshotBound = true;
          const TRIGGER_SEL = '.header_menu li.bigmenu, .hmenumob li.bigmenu';

          const showDropdown = (li: HTMLElement) => {
            const sub = li.querySelector<HTMLElement>(':scope > ul');
            if (!sub) return;
            sub.style.opacity = '1';
            sub.style.pointerEvents = 'auto';
            sub.style.visibility = 'visible';
            li.classList.add('snapshot-menu-open');
          };
          const hideDropdown = (li: HTMLElement) => {
            const sub = li.querySelector<HTMLElement>(':scope > ul');
            if (sub) {
              sub.style.opacity = '';
              sub.style.pointerEvents = '';
              sub.style.visibility = '';
            }
            li.classList.remove('snapshot-menu-open');
          };
          const closeAll = (except?: HTMLElement | null) => {
            document.querySelectorAll<HTMLElement>('.snapshot-menu-open').forEach((li) => {
              if (except && li === except) return;
              hideDropdown(li);
            });
          };

          document.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const li = target.closest?.(TRIGGER_SEL) as HTMLElement | null;
            if (!li) {
              closeAll();
              return;
            }
            // Click landed inside an already-open dropdown's submenu links —
            // don't toggle, let the link navigate.
            // Only toggle when the click is on the li's own <a> or .marrow,
            // not on a nested submenu link.
            const trigger = target.closest?.('a, .marrow') as HTMLElement | null;
            if (!trigger || trigger.parentElement !== li) return;
            e.preventDefault();
            e.stopPropagation();
            const isOpen = li.classList.contains('snapshot-menu-open');
            closeAll(li);
            if (isOpen) hideDropdown(li);
            else showDropdown(li);
          }, true);
        }
      } catch (_) {}

      // Ticker close button — hide .headerticker when .tickclose is clicked.
      try {
        const w2 = window as unknown as { __tickcloseSnapshotBound?: boolean };
        if (!w2.__tickcloseSnapshotBound) {
          w2.__tickcloseSnapshotBound = true;
          document.addEventListener('click', (e: MouseEvent) => {
            const btn = (e.target as HTMLElement).closest?.('.tickclose');
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            const ticker = (btn as HTMLElement).closest?.('.headerticker') as HTMLElement | null;
            if (ticker) ticker.style.display = 'none';
          }, true);
        }
      } catch (_) {}

      try { document.dispatchEvent(new Event("DOMContentLoaded")); } catch (_) {}
      try { window.dispatchEvent(new Event("load")); } catch (_) {}
      // Signal any code waiting for WP Rocket's pipeline to complete.
      try { window.dispatchEvent(new Event("rocket-allScriptsLoaded")); } catch (_) {}

      // 4. Add .loaded class — capped at 300ms so preloaded scripts (which now
      //    finish much faster) don't force an artificially long blank period.
      //    The original 800ms was sized for sequential download; parallel preloading
      //    makes that unnecessary. 300ms still gives animation libs (WOW, GSAP) one
      //    full frame to measure layout before .loaded triggers their reveals.
      setTimeout(() => {
        document.body.classList.add("loaded");
        // Fire a synthetic scroll so scroll-based .show checks run for above-fold
        // elements that would never receive a scroll event otherwise.
        try { window.dispatchEvent(new Event("scroll")); } catch (_) {}
      }, Math.min(entry.loadedDelayMs ?? 300, 300));

      // 5. Scroll-reveal fallback — two mechanisms in parallel:
      //
      //    a) Synthetic window.scroll events → jQuery handlers in all.js run when jQuery is healthy.
      //    b) Directly add .show to intersecting elements → works even when jQuery fails to init.
      //       ($.fn.isotope / $.fn.visible errors from plugin ordering issues break jQuery handlers;
      //       directly adding .show ensures opacity:0→1 transitions fire regardless.)
      //
      //    PLUS an immediate flush: reveal every element inside the snapshot root right now so
      //    content is never permanently hidden due to scroll-position timing or jQuery failure.
      const _fireScroll = () => {
        try { window.dispatchEvent(new Event("scroll")); } catch (_) {}
      };
      const snapshotRoot = document.querySelector("[data-snapshot-client]") as HTMLElement | null;
      if (snapshotRoot) {
        flushSnapshotVisibility(snapshotRoot);
        installWowObserver(snapshotRoot);
        _fireScroll();

        // IO keeps adding .show for any elements injected after this point and keeps
        // firing scroll events so jQuery-based handlers also have a chance to run.
        if (typeof IntersectionObserver !== "undefined") {
          const sectionObserver = new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (!e.isIntersecting) continue;
                e.target.classList.add("show");
                _fireScroll();
              }
            },
            { root: null, threshold: 0, rootMargin: "0px" }
          );
          snapshotRoot
            .querySelectorAll(":scope > div, :scope > section, :scope > div > div")
            .forEach((el) => sectionObserver.observe(el));
        }
      }

      // 6. owlCarousel pointer-events drag shim.
      //
      //    owlCarousel 2.x binds only legacy `touchstart`/`mousedown` events.
      //    Modern mobile browsers (and DevTools mobile emulation) typically
      //    only fire pointer events. Even when pointer events DO fire, the
      //    browser may hijack the horizontal gesture and convert pointerup to
      //    pointercancel, treating it as a page scroll — unless the element
      //    opts out via `touch-action: pan-y`.
      //
      //    This shim:
      //      a) Sets `touch-action: pan-y` on every .owl-carousel so the browser
      //         releases horizontal pointers to the app.
      //      b) Tracks pointer delta via pointermove (works even if the final
      //         event is pointercancel) and fires next/prev at a 40px threshold.
      //      c) Bails out if the user is scrolling vertically (|dy| > |dx|).
      //
      //    This works in addition to — not instead of — owl's built-in drag,
      //    so desktop mouse-drag still works through owl's own handlers.
      setTimeout(() => {
        // Label owl nav buttons — owl.js injects them with no text content.
        document.querySelectorAll<HTMLElement>("button.owl-prev, button.owl-next").forEach((btn) => {
          if (btn.getAttribute("aria-label")) return;
          btn.setAttribute("aria-label", btn.classList.contains("owl-prev") ? "Previous slide" : "Next slide");
        });

        const $ = (window as unknown as { jQuery?: JQueryStatic }).jQuery;
        if (!$) return;
        const $carousels = $(".owl-carousel.owl-loaded");
        if (!$carousels.length) return;

        $carousels.each(function (this: HTMLElement) {
          const el = this;
          if ((el as HTMLElement & { __owlPointerShim?: boolean }).__owlPointerShim) return;
          (el as HTMLElement & { __owlPointerShim?: boolean }).__owlPointerShim = true;

          // (a) Let horizontal gestures reach the app. `pan-y` still allows
          // vertical page scroll, so users can scroll past the carousel.
          el.style.touchAction = "pan-y";

          let startX = 0;
          let startY = 0;
          let lastDx = 0;
          let lastDy = 0;
          let active = false;

          const finish = () => {
            if (!active) return;
            active = false;
            const dx = lastDx;
            const dy = lastDy;
            if (Math.abs(dy) > Math.abs(dx)) return; // vertical → page scroll
            if (Math.abs(dx) < 40) return;           // too short → treat as tap
            $(el).trigger(dx < 0 ? "next.owl.carousel" : "prev.owl.carousel");
          };

          el.addEventListener("pointerdown", (ev: PointerEvent) => {
            if (ev.button !== undefined && ev.button !== 0) return;
            startX = ev.clientX;
            startY = ev.clientY;
            lastDx = 0;
            lastDy = 0;
            active = true;
          }, { passive: true });

          el.addEventListener("pointermove", (ev: PointerEvent) => {
            if (!active) return;
            lastDx = ev.clientX - startX;
            lastDy = ev.clientY - startY;
          }, { passive: true });

          el.addEventListener("pointerup", finish, { passive: true });
          el.addEventListener("pointercancel", finish, { passive: true });
          el.addEventListener("pointerleave", finish, { passive: true });
        });
      }, Math.min(entry.loadedDelayMs ?? 300, 300) + 200);

      // 7. owlCarousel mobile-resize fix.
      //
      //    CSS hides .owl-carousel elements on desktop (display:none!important)
      //    and shows them on mobile (≤767px). If the page loads on desktop, owl
      //    initialises on a hidden element and measures 0-width items. When the
      //    user resizes to mobile, the container becomes visible but items have
      //    wrong dimensions. Trigger owl's 'refresh' on every crossing of the
      //    767px boundary.
      {
        let wasMobile = window.innerWidth <= 767;
        const handleOwlResize = () => {
          const isMobile = window.innerWidth <= 767;
          if (isMobile === wasMobile) return;
          wasMobile = isMobile;
          const jq = (window as unknown as { jQuery?: JQueryStatic }).jQuery;
          if (!jq) return;
          const $owls = jq(".owl-carousel");
          if ($owls.length) $owls.trigger("refresh.owl.carousel");
        };
        window.addEventListener("resize", handleOwlResize, { passive: true });
      }
    });

    return () => {
      unmountWidgets(rootRef.current);
    };
  }, [entry, widgetProps, pathname, historyBust]);

  // Back-forward cache: the JS heap (incl. injectedRef) is restored; force pipeline replay.
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        injectedRef.current = false;
        setHistoryBust((n) => n + 1);
        requestAnimationFrame(() => replayPostSnapshotPaint());
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [entry.slug, pathname]);

  return (
    <main
      ref={rootRef as React.RefObject<HTMLElement>}
      data-snapshot-client
      className={entry.dir === "rtl" ? "rtl" : undefined}
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
      suppressHydrationWarning
    />
  );
}

/**
 * Remount the full client when the snapshot entry changes (key) so `injectedRef` and
 * one-shot script init match a full page reload. Do NOT use `usePathname()` here —
 * it can differ between SSR and the first client render and breaks hydration on
 * `dangerouslySetInnerHTML`. `entry.slug` + `entry.locale` are stable RSC props and
 * still change on every in-app navigation to a different page (incl. `he/[...segments]`).
 */
export default function SnapshotClient(props: Props) {
  const key = `${props.entry.slug}::${props.entry.locale}`;
  return <SnapshotClientImpl key={key} {...props} />;
}

function _registerGsap() {
  if (window.gsap?.registerPlugin && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }
}
