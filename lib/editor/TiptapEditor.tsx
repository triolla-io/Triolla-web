"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createEditorExtensions } from "./tiptapExtensions";
import { FloatingToolbar } from "./FloatingToolbar";
import { sanitizeEditorHtml } from "@/lib/sanitize";
import type { Patch } from "@/lib/patches";
import { contentFingerprint } from "@/lib/fingerprint";

type Props = {
  target: HTMLElement;
  selector: string;
  slug: string;
  locale: string;
  dir: "ltr" | "rtl";
  onOpenLinkPanel?: () => void;
  onClose: () => void;
  onSaved: () => void;
  toast: (kind: "success" | "error" | "info", text: string) => void;
};

function useBoundingRect(el: HTMLElement | null) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const update = useCallback(() => {
    if (!el) {
      setRect(null);
      return;
    }
    setRect(el.getBoundingClientRect());
  }, [el]);

  useLayoutEffect(() => {
    update();
    const onScroll = () => update();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", update);
    };
  }, [el, update]);

  return rect;
}

export function TiptapEditor({
  target,
  selector,
  slug,
  locale,
  dir,
  onOpenLinkPanel,
  onClose,
  onSaved,
  toast,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cancelledRef = useRef(false);
  const originalHtmlRef = useRef(target.innerHTML);
  const rect = useBoundingRect(target);

  useEffect(() => {
    target.style.visibility = "hidden";
    target.style.pointerEvents = "none";
    return () => {
      target.style.visibility = "";
      target.style.pointerEvents = "";
    };
  }, [target]);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: createEditorExtensions(),
      content: originalHtmlRef.current,
      editorProps: {
        attributes: {
          class: "triolla-tiptap-root",
          style: dir === "rtl" ? "direction:rtl;text-align:right;min-height:1.5em;" : "min-height:1.5em;",
        },
      },
    },
    [target],
  );

  const save = useCallback(async () => {
    if (!editor) return;
    const raw = editor.getHTML();
    const value = sanitizeEditorHtml(raw);
    const fp = contentFingerprint(originalHtmlRef.current);
    const patch: Patch = {
      id: crypto.randomUUID(),
      selector,
      op: "setHtml",
      value,
      fingerprint: fp,
      updatedAt: Date.now(),
    };
    try {
      const res = await fetch("/api/edits/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, locale, patch }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast("error", `Save failed: ${(err as { error?: string }).error ?? res.status}`);
        return;
      }
      toast("success", "Saved as draft");
      onSaved();
      onClose();
    } catch {
      toast("error", "Save failed — network error");
    }
  }, [editor, locale, onClose, onSaved, selector, slug, toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelledRef.current = true;
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, save]);

  if (!rect) return null;

  const padTop = 52;
  return createPortal(
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        top: Math.max(8, rect.top - padTop),
        left: Math.max(8, rect.left),
        width: Math.min(rect.width, window.innerWidth - 16),
        zIndex: 999997,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <FloatingToolbar editor={editor} dir={dir} onOpenLinkPanel={onOpenLinkPanel} />
      <div
        style={{
          border: "2px solid #1a73e8",
          borderRadius: 6,
          background: "#fff",
          padding: 8,
          maxHeight: "70vh",
          overflow: "auto",
        }}
        onBlurCapture={() => {
          window.setTimeout(() => {
            if (cancelledRef.current) return;
            const root = overlayRef.current;
            if (!root) return;
            if (!root.contains(document.activeElement)) void save();
          }, 180);
        }}
      >
        <EditorContent editor={editor} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={() => void save()} style={{ padding: "6px 12px", cursor: "pointer" }}>
          Save draft
        </button>
        <button
          type="button"
          onMouseDown={() => {
            cancelledRef.current = true;
          }}
          onClick={onClose}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
}
