"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "./TopBar";
import { HoverOverlay } from "./HoverOverlay";
import { TiptapEditor } from "./TiptapEditor";
import { SidePanel } from "./SidePanel";
import { ToastViewport, useToasts } from "./Toast";
import { buildCanonicalSelector } from "./selectorPath";
import { isForbiddenElement } from "./forbiddenZones";
import type { Patch } from "@/lib/patches";

const TEXT_HOST = new Set([
  "P",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "LI",
  "BLOCKQUOTE",
  "A",
  "SPAN",
  "TD",
  "TH",
  "LABEL",
]);

function findTextHost(el: Element | null, root: HTMLElement): HTMLElement | null {
  let cur: Element | null = el;
  while (cur && cur !== root && root.contains(cur)) {
    if (isForbiddenElement(cur)) return null;
    if (TEXT_HOST.has(cur.tagName)) return cur as HTMLElement;
    cur = cur.parentElement;
  }
  return null;
}

function EditorShellInner({
  slug,
  locale,
  dir,
  children,
}: {
  slug: string;
  locale: string;
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  const enabled = process.env.NEXT_PUBLIC_EDITOR_ENABLED === "true";
  const searchParams = useSearchParams();
  const router = useRouter();
  const spEdit = searchParams.get("edit") === "1";
  const [editMode, setEditMode] = useState(spEdit);
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const [tiptapTarget, setTiptapTarget] = useState<{
    el: HTMLElement;
    selector: string;
  } | null>(null);
  const [sideMode, setSideMode] = useState<
    { kind: "img"; el: HTMLImageElement } | { kind: "link"; el: HTMLAnchorElement } | null
  >(null);
  const [patches, setPatches] = useState<Patch[]>([]);
  const { toasts, push } = useToasts();

  useEffect(() => {
    setEditMode(spEdit);
  }, [spEdit]);

  const refreshPatches = useCallback(async () => {
    if (!enabled) return;
    try {
      const r = await fetch(`/api/edits?slug=${encodeURIComponent(slug)}&locale=${encodeURIComponent(locale)}`);
      if (!r.ok) return;
      const d = (await r.json()) as { patches?: Patch[] };
      setPatches(Array.isArray(d.patches) ? d.patches : []);
    } catch {
      setPatches([]);
    }
  }, [enabled, locale, slug]);

  useEffect(() => {
    void refreshPatches();
  }, [refreshPatches]);

  useEffect(() => {
    const pick = () => {
      const m = document.querySelector("[data-snapshot-client]");
      setRoot(m as HTMLElement | null);
    };
    pick();
    const id = window.setInterval(pick, 800);
    return () => window.clearInterval(id);
  }, [slug, locale, children]);

  const onToggleEditMode = useCallback(
    (on: boolean) => {
      setEditMode(on);
      const u = new URL(window.location.href);
      if (on) u.searchParams.set("edit", "1");
      else u.searchParams.delete("edit");
      router.replace(u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString()}` : ""));
    },
    [router],
  );

  const onSaved = useCallback(() => {
    void refreshPatches();
    router.refresh();
  }, [refreshPatches, router]);

  useEffect(() => {
    if (!enabled || !editMode || !root) return;
    const onClick = (e: MouseEvent) => {
      const path = e.composedPath();
      if (
        path.some(
          (n) =>
            n instanceof HTMLElement &&
            (n.hasAttribute("data-editor-chrome") || n.closest("[data-editor-chrome]")),
        )
      ) {
        return;
      }
      const t = e.target as Element | null;
      if (!t || !root.contains(t)) return;
      if (isForbiddenElement(t)) return;

      if (t instanceof HTMLImageElement && e.detail === 1) {
        e.preventDefault();
        e.stopPropagation();
        setSideMode({ kind: "img", el: t });
        setTiptapTarget(null);
        return;
      }
      const a = t.closest("a");
      if (a && e.detail === 2 && root.contains(a)) {
        e.preventDefault();
        e.stopPropagation();
        setSideMode({ kind: "link", el: a as HTMLAnchorElement });
        setTiptapTarget(null);
        return;
      }

      const host = findTextHost(t, root);
      if (!host) return;
      const sel = buildCanonicalSelector(host, root);
      if (!sel) return;
      e.preventDefault();
      e.stopPropagation();
      setSideMode(null);
      setTiptapTarget({ el: host, selector: sel });
    };
    root.addEventListener("click", onClick, true);
    return () => root.removeEventListener("click", onClick, true);
  }, [editMode, enabled, root]);

  if (!enabled) {
    return <>{children}</>;
  }

  const showChrome = spEdit || editMode;

  return (
    <>
      {showChrome && (
        <div data-editor-chrome>
          <TopBar
            editMode={editMode}
            onToggleEditMode={onToggleEditMode}
            changeCount={patches.length}
            slug={slug}
            locale={locale}
          />
        </div>
      )}
      <div style={{ paddingTop: showChrome ? 48 : 0 }}>{children}</div>
      {showChrome && editMode && <HoverOverlay root={root} active={editMode} />}
      {tiptapTarget && (
        <TiptapEditor
          target={tiptapTarget.el}
          selector={tiptapTarget.selector}
          slug={slug}
          locale={locale}
          dir={dir}
          onOpenLinkPanel={() => {
            const a = tiptapTarget.el.closest("a");
            if (a) setSideMode({ kind: "link", el: a });
          }}
          onClose={() => setTiptapTarget(null)}
          onSaved={onSaved}
          toast={push}
        />
      )}
      {root && (
        <SidePanel
          mode={sideMode}
          root={root}
          slug={slug}
          locale={locale}
          onClose={() => setSideMode(null)}
          onSaved={onSaved}
          toast={push}
        />
      )}
      <ToastViewport toasts={toasts} />
    </>
  );
}

export function EditorShell({
  slug,
  locale,
  dir,
  children,
}: {
  slug: string;
  locale: string;
  dir: "ltr" | "rtl";
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={children}>
      <EditorShellInner slug={slug} locale={locale} dir={dir}>
        {children}
      </EditorShellInner>
    </Suspense>
  );
}
