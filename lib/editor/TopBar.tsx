"use client";

import Link from "next/link";

type Props = {
  editMode: boolean;
  onToggleEditMode: (on: boolean) => void;
  changeCount: number;
  slug: string;
  locale: string;
};

export function TopBar({ editMode, onToggleEditMode, changeCount, slug, locale }: Props) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 48,
        background: "#111",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 16px",
        zIndex: 999999,
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
      }}
    >
      <span style={{ fontWeight: 600 }}>Triolla editor</span>
      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
        <input type="checkbox" checked={editMode} onChange={(e) => onToggleEditMode(e.target.checked)} />
        Edit mode
      </label>
      <span style={{ opacity: 0.85 }}>
        Changes: <strong>{changeCount}</strong>
      </span>
      <Link href="/" style={{ color: "#90caf9", marginLeft: "auto" }}>
        Home
      </Link>
      <Link href={`/blog/?edit=1`} style={{ color: "#90caf9" }}>
        Blog
      </Link>
      <span style={{ fontSize: 12, opacity: 0.7 }}>
        {slug} · {locale}
      </span>
    </div>
  );
}
