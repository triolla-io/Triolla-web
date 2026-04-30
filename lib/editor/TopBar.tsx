"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  editMode: boolean;
  onToggleEditMode: (on: boolean) => void;
  changeCount: number;
  slug: string;
  locale: string;
  onLocaleChange?: (locale: string) => void;
  /** Height in px of any fixed bar sitting above this TopBar (e.g. the admin bar). */
  adminBarHeight?: number;
};

export function TopBar({ editMode, onToggleEditMode, changeCount, slug, locale, onLocaleChange, adminBarHeight = 0 }: Props) {
  const router = useRouter();

  const handleLocaleChange = (next: string) => {
    if (next === locale) return;
    if (onLocaleChange) {
      onLocaleChange(next);
      return;
    }
    // Default: reload the page with the new locale query param.
    const url = new URL(window.location.href);
    url.searchParams.set("locale", next);
    url.searchParams.set("edit", "1");
    router.push(url.pathname + "?" + url.searchParams.toString());
  };

  const topOffset = adminBarHeight;

  return (
    <div
      style={{
        position: "fixed",
        top: topOffset,
        left: 0,
        right: 0,
        height: 48,
        background: "#1a1a2e",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "0 16px",
        zIndex: 999999,
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        borderBottom: "1px solid #2b3036",
      }}
    >
      <span style={{ fontWeight: 600, color: "#93c5fd" }}>✏ Edit mode</span>

      <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
        <input type="checkbox" checked={editMode} onChange={(e) => onToggleEditMode(e.target.checked)} />
        Active
      </label>

      <span style={{ opacity: 0.85, fontSize: 13 }}>
        {changeCount > 0 ? (
          <strong style={{ color: "#fbbf24" }}>{changeCount} pending</strong>
        ) : (
          <span style={{ opacity: 0.5 }}>No changes</span>
        )}
      </span>

      {/* Locale switcher */}
      <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
        {["en", "he"].map((l) => (
          <button
            key={l}
            onClick={() => handleLocaleChange(l)}
            style={{
              background: l === locale ? "#3b82f6" : "#1f2328",
              color: "#fff",
              border: l === locale ? 0 : "1px solid #2b3036",
              padding: "3px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: l === locale ? 700 : 400,
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 11, opacity: 0.5 }}>{slug}</span>
        {adminBarHeight === 0 && (
          <Link href="/admin" style={{ color: "#90caf9", fontSize: 12 }}>
            ← Admin
          </Link>
        )}
      </div>
    </div>
  );
}
