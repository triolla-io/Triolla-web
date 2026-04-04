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

/**
 * Append all stylesheet links in dependency order (same cascade as sequential
 * `loadStylesheet` calls), but let the browser fetch them in parallel.
 * Returns only newly inserted `<link>` nodes (for cleanup on unmount).
 */
export function loadStylesheetsParallelOrdered(hrefs: string[]): Promise<HTMLLinkElement[]> {
  const toAppend: HTMLLinkElement[] = [];
  for (const href of hrefs) {
    const abs = resolvedUrl(href);
    let found = false;
    for (const node of document.querySelectorAll("link[rel='stylesheet']")) {
      if ((node as HTMLLinkElement).href === abs) {
        found = true;
        break;
      }
    }
    if (found) continue;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    toAppend.push(link);
  }

  for (const link of toAppend) {
    document.head.appendChild(link);
  }

  if (toAppend.length === 0) {
    return Promise.resolve([]);
  }

  return Promise.all(
    toAppend.map((link) => {
      const href = link.href;
      return new Promise<void>((resolve) => {
        link.addEventListener("load", () => resolve(), { once: true });
        link.addEventListener(
          "error",
          () => {
            console.error(`Failed to load stylesheet: ${href}`);
            resolve();
          },
          { once: true },
        );
      });
    }),
  ).then(() => toAppend);
}

const scriptPromises = new Map<string, Promise<void>>();

export function loadScript(src: string): Promise<void> {
  const abs = resolvedUrl(src);
  const cached = scriptPromises.get(abs);
  if (cached) return cached;

  const promise = new Promise<void>((resolve) => {
    let settled = false;
    let safetyId: number | undefined;
    const settle = () => {
      if (settled) return;
      settled = true;
      if (safetyId !== undefined) window.clearTimeout(safetyId);
      resolve();
    };

    safetyId = window.setTimeout(() => {
      console.warn("[snapshot] loadScript safety timeout (continuing):", src);
      settle();
    }, 15000);

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
