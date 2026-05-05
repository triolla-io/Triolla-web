"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { SnapshotEntry } from "@/lib/snapshotRegistry";
import SnapshotClient from "@/lib/SnapshotClient";
import { EditorShell } from "@/lib/editor/EditorShell";

type Props = {
  entry: SnapshotEntry;
  bodyHtml: string;
  widgetProps: Record<string, { type: string; props: unknown }> | null;
  locale: string;
};

export default function PageEditorClient({ entry, bodyHtml, widgetProps, locale }: Props) {
  const router = useRouter();
  const [patchCount, setPatchCount] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const refreshPatches = useCallback(async () => {
    try {
      const r = await fetch(
        `/api/edits/?slug=${encodeURIComponent(entry.slug)}&locale=${encodeURIComponent(locale)}`
      );
      if (!r.ok) return;
      const d = (await r.json()) as { patches?: unknown[] };
      setPatchCount(Array.isArray(d.patches) ? d.patches.length : 0);
    } catch {
      /* ignore */
    }
  }, [entry.slug, locale]);

  useEffect(() => {
    void refreshPatches();
    const id = setInterval(() => void refreshPatches(), 4000);
    return () => clearInterval(id);
  }, [refreshPatches]);

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const r = await fetch("/api/cms/publish-patches/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ slug: entry.slug, locale }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setToast(`Publish failed: ${j.error ?? r.status}`);
        return;
      }
      setToast(`Published ${j.patchCount} change${j.patchCount === 1 ? "" : "s"} (${j.sha?.slice(0, 7) ?? "ok"}). Site rebuild triggered.`);
      setPatchCount(0);
      router.refresh();
    } finally {
      setPublishing(false);
    }
  };

  const dir = entry.dir ?? "ltr";

  return (
    <div>
      {/* Admin bar — sits above EditorShell's TopBar (z 999999) */}
      <div style={adminBar}>
        <button onClick={() => router.push("/admin")} style={backBtn}>← Admin</button>
        <span style={{ fontSize: 13, opacity: 0.7 }}>{entry.slug} · {locale}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {patchCount > 0 && (
            <span style={{ fontSize: 13, color: "#fbbf24" }}>
              {patchCount} unsaved change{patchCount === 1 ? "" : "s"}
            </span>
          )}
          <button
            onClick={handlePublish}
            disabled={publishing || patchCount === 0}
            style={patchCount > 0 ? publishBtn : publishBtnDisabled}
          >
            {publishing ? "Publishing…" : `Publish ${patchCount > 0 ? patchCount : ""} change${patchCount === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>

      {toast && (
        <div style={toastBox} onClick={() => setToast(null)}>
          {toast}
        </div>
      )}

      {/* Snapshot page wrapped with click-to-edit overlay */}
      <EditorShell slug={entry.slug} locale={locale} dir={dir} adminBarHeight={40}>
        <SnapshotClient entry={entry} bodyHtml={bodyHtml} widgetProps={widgetProps} />
      </EditorShell>
    </div>
  );
}

const adminBar: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: 40,
  background: "#0f1216",
  borderBottom: "1px solid #1f2328",
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "0 16px",
  zIndex: 1000000,
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  color: "#e7e9ec",
};

const backBtn: React.CSSProperties = {
  background: "#1f2328",
  color: "#c8ccd2",
  border: "1px solid #2b3036",
  padding: "4px 10px",
  borderRadius: 6,
  fontSize: 12,
  cursor: "pointer",
};

const publishBtn: React.CSSProperties = {
  background: "#16a34a",
  color: "#fff",
  border: 0,
  padding: "5px 12px",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const publishBtnDisabled: React.CSSProperties = {
  ...publishBtn,
  background: "#1f2328",
  color: "#6b7280",
  cursor: "not-allowed",
};

const toastBox: React.CSSProperties = {
  position: "fixed",
  bottom: 24,
  right: 24,
  background: "#1f2328",
  border: "1px solid #2b3036",
  color: "#e7e9ec",
  padding: "10px 14px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
  maxWidth: 400,
  zIndex: 1000001,
};
