/**
 * Avoid querySelector(`link[href="${href}"]`) — long encoded paths can break CSS
 * selector parsing in some browsers. Match on resolved link.href / script.src instead.
 */

function resolvedUrl(url: string): string {
  return new URL(url, window.location.origin).href;
}

/** True if this URL has a completed resource timing entry (handles missed `load` on cached/reused scripts). */
function scriptResourceFinished(abs: string): boolean {
  if (typeof performance === "undefined" || !performance.getEntriesByName) {
    return false;
  }
  try {
    const entries = performance.getEntriesByName(
      abs,
      "resource",
    ) as PerformanceResourceTiming[];
    return entries.some((e) => e.responseEnd > 0);
  } catch {
    return false;
  }
}

export function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const abs = resolvedUrl(href);
    for (const node of document.querySelectorAll("link[rel='stylesheet']")) {
      if ((node as HTMLLinkElement).href === abs) {
        resolve();
        return;
      }
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
    document.head.appendChild(link);
  });
}

export async function loadStylesheetsParallel(hrefs: string[]): Promise<void> {
  const unique = Array.from(new Set(hrefs));
  await Promise.all(
    unique.map(async (href) => {
      try {
        await loadStylesheet(href);
      } catch (error) {
        console.error(`Failed to load stylesheet: ${href}`, error);
      }
    }),
  );
}

const scriptPromises = new Map<string, Promise<void>>();

export function loadScript(src: string): Promise<void> {
  const abs = resolvedUrl(src);
  const cached = scriptPromises.get(abs);
  if (cached) return cached;

  const promise = new Promise<void>((resolve) => {
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    for (const node of document.querySelectorAll("script[src]")) {
      const el = node as HTMLScriptElement;
      if (el.src !== abs) continue;
      if (el.dataset.loaded === "true") {
        settle();
        return;
      }
      const markAndSettle = () => {
        el.dataset.loaded = "true";
        settle();
      };
      el.addEventListener("load", markAndSettle, { once: true });
      el.addEventListener("error", markAndSettle, { once: true });
      // If `load` already fired (browser cache / revisit) listeners never run — unblock via timing.
      const tryFinishFromTiming = () => {
        if (settled) return;
        if (scriptResourceFinished(abs)) {
          el.dataset.loaded = "true";
          settle();
        }
      };
      queueMicrotask(tryFinishFromTiming);
      setTimeout(tryFinishFromTiming, 0);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => {
      script.dataset.loaded = "true";
      settle();
    };
    script.onerror = () => {
      script.remove();
      settle();
    };
    document.body.appendChild(script);
  });

  scriptPromises.set(abs, promise);
  return promise;
}

/** After snapshot CSS/DOM, wait for @font-face loads so text does not flash system fonts (FOUT). */
export function waitForSnapshotFonts(timeoutMs = 5000): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const ready = document.fonts?.ready;
  if (!ready) return Promise.resolve();
  return Promise.race([
    ready.then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}
