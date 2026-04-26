"use client";

import { useEffect, useState } from "react";
import type { Patch } from "@/lib/patches";
import { contentFingerprint } from "@/lib/fingerprint";
import { sanitizeEditorHtml } from "@/lib/sanitize";
import { buildCanonicalSelector } from "./selectorPath";

type Mode = { kind: "img"; el: HTMLImageElement } | { kind: "link"; el: HTMLAnchorElement };

type Props = {
  mode: Mode | null;
  root: HTMLElement;
  slug: string;
  locale: string;
  onClose: () => void;
  onSaved: () => void;
  toast: (kind: "success" | "error" | "info", text: string) => void;
};

export function SidePanel({ mode, root, slug, locale, onClose, onSaved, toast }: Props) {
  const [cas, setCas] = useState<string[]>([]);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [href, setHref] = useState("");
  const [label, setLabel] = useState("");
  const [targetBlank, setTargetBlank] = useState(false);
  const [extWarn, setExtWarn] = useState(false);

  useEffect(() => {
    if (!mode) return;
    if (mode.kind === "img") {
      setSrc(mode.el.getAttribute("src") ?? "");
      setAlt(mode.el.getAttribute("alt") ?? "");
    } else {
      setHref(mode.el.getAttribute("href") ?? "");
      setLabel(mode.el.textContent ?? "");
      setTargetBlank(mode.el.getAttribute("target") === "_blank");
      setExtWarn(/^https?:\/\//i.test(mode.el.getAttribute("href") ?? ""));
    }
  }, [mode]);

  useEffect(() => {
    if (!mode || mode.kind !== "img") return;
    void fetch("/api/cas-list")
      .then((r) => r.json())
      .then((d: { files?: string[] }) => setCas(Array.isArray(d.files) ? d.files : []))
      .catch(() => setCas([]));
  }, [mode]);

  if (!mode) return null;

  const selector = buildCanonicalSelector(mode.el, root);
  if (!selector) {
    return null;
  }

  const postPatch = async (patch: Patch) => {
    const res = await fetch("/api/edits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, locale, patch }),
    });
    if (!res.ok) {
      toast("error", "Save failed");
      return false;
    }
    toast("success", "Saved as draft");
    return true;
  };

  const saveImg = async () => {
    const el = mode.kind === "img" ? mode.el : null;
    if (!el) return;
    const fpSrc = contentFingerprint(el.getAttribute("src") ?? "");
    const fpAlt = contentFingerprint(el.getAttribute("alt") ?? "");
    const idBase = crypto.randomUUID();
    const ok1 = await postPatch({
      id: idBase,
      selector,
      op: "setAttr",
      attr: "src",
      value: src,
      fingerprint: fpSrc,
      updatedAt: Date.now(),
    });
    if (!ok1) return;
    await postPatch({
      id: crypto.randomUUID(),
      selector,
      op: "setAttr",
      attr: "alt",
      value: alt,
      fingerprint: fpAlt,
      updatedAt: Date.now(),
    });
    onSaved();
    onClose();
  };

  const saveLink = async () => {
    const el = mode.kind === "link" ? mode.el : null;
    if (!el) return;
    const fpHref = contentFingerprint(el.getAttribute("href") ?? "");
    const fpHtml = contentFingerprint(el.innerHTML);
    const ok1 = await postPatch({
      id: crypto.randomUUID(),
      selector,
      op: "setAttr",
      attr: "href",
      value: href,
      fingerprint: fpHref,
      updatedAt: Date.now(),
    });
    if (!ok1) return;
    await postPatch({
      id: crypto.randomUUID(),
      selector,
      op: "setHtml",
      value: sanitizeEditorHtml(label),
      fingerprint: fpHtml,
      updatedAt: Date.now(),
    });
    if (targetBlank) {
      await postPatch({
        id: crypto.randomUUID(),
        selector,
        op: "setAttr",
        attr: "target",
        value: "_blank",
        fingerprint: contentFingerprint(el.getAttribute("target") ?? ""),
        updatedAt: Date.now(),
      });
    }
    onSaved();
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 360,
        maxWidth: "100vw",
        height: "100vh",
        background: "#fff",
        borderLeft: "1px solid #ccc",
        zIndex: 999998,
        padding: 16,
        overflow: "auto",
        boxShadow: "-4px 0 16px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong>{mode.kind === "img" ? "Image" : "Link"}</strong>
        <button type="button" onClick={onClose} style={{ cursor: "pointer" }}>
          ✕
        </button>
      </div>
      {mode.kind === "img" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          <label style={{ fontSize: 13 }}>
            src
            <input value={src} onChange={(e) => setSrc(e.target.value)} style={{ width: "100%", marginTop: 4 }} />
          </label>
          <label style={{ fontSize: 13 }}>
            alt
            <input value={alt} onChange={(e) => setAlt(e.target.value)} style={{ width: "100%", marginTop: 4 }} />
          </label>
          <div style={{ fontSize: 12, color: "#555" }}>Pick from CAS (Phase 1)</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 200, overflow: "auto" }}>
            {cas.slice(0, 200).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setSrc(u)}
                style={{ border: "1px solid #ddd", padding: 2, cursor: "pointer", background: "#fafafa" }}
                title={u}
              >
                <img src={u} alt="" width={40} height={40} style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => void saveImg()} style={{ padding: "8px 12px", cursor: "pointer" }}>
            Save
          </button>
        </div>
      )}
      {mode.kind === "link" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
          {extWarn && (
            <div style={{ fontSize: 12, color: "#b26a00" }}>External URL — double-check before changing to internal.</div>
          )}
          <label style={{ fontSize: 13 }}>
            URL
            <input value={href} onChange={(e) => setHref(e.target.value)} style={{ width: "100%", marginTop: 4 }} />
          </label>
          <label style={{ fontSize: 13 }}>
            Label (plain text)
            <input value={label} onChange={(e) => setLabel(e.target.value)} style={{ width: "100%", marginTop: 4 }} />
          </label>
          <label style={{ fontSize: 13, display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={targetBlank} onChange={(e) => setTargetBlank(e.target.checked)} />
            Open in new tab
          </label>
          <button type="button" onClick={() => void saveLink()} style={{ padding: "8px 12px", cursor: "pointer" }}>
            Save
          </button>
        </div>
      )}
    </div>
  );
}
