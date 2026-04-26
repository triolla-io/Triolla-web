"use client";

import type { Editor } from "@tiptap/core";
import type { CSSProperties } from "react";
import { useState } from "react";
import { BRAND_COLORS, FONT_SIZE_SCALE, isOnTypeScale } from "./brandPalette";

const btn: CSSProperties = {
  border: "1px solid #ccc",
  background: "#fff",
  borderRadius: 4,
  padding: "2px 6px",
  fontSize: 12,
  cursor: "pointer",
};

export function FloatingToolbar({
  editor,
  dir = "ltr",
  onOpenLinkPanel,
}: {
  editor: Editor | null;
  dir?: "ltr" | "rtl";
  onOpenLinkPanel?: () => void;
}) {
  const [linkHref, setLinkHref] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [sizeWarn, setSizeWarn] = useState(false);

  if (!editor) return null;

  const sep: CSSProperties = {
    width: 1,
    height: 20,
    background: "#ddd",
    margin: "0 4px",
  };

  return (
    <div
      dir={dir}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 4,
        padding: 6,
        background: "#fafafa",
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        maxWidth: "min(96vw, 920px)",
        zIndex: 999998,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <select
        style={btn}
        value={
          editor.isActive("heading", { level: 1 })
            ? "h1"
            : editor.isActive("heading", { level: 2 })
              ? "h2"
              : editor.isActive("heading", { level: 3 })
                ? "h3"
                : editor.isActive("blockquote")
                  ? "quote"
                  : "p"
        }
        onChange={(e) => {
          const v = e.target.value;
          const ch = editor.chain().focus();
          if (v === "p") ch.setParagraph().run();
          else if (v === "h1") ch.toggleHeading({ level: 1 }).run();
          else if (v === "h2") ch.toggleHeading({ level: 2 }).run();
          else if (v === "h3") ch.toggleHeading({ level: 3 }).run();
          else if (v === "quote") ch.toggleBlockquote().run();
        }}
      >
        <option value="p">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="quote">Quote</option>
      </select>

      <select
        style={btn}
        defaultValue=""
        onChange={(e) => {
          const px = Number(e.target.value);
          if (!px) return;
          if (!isOnTypeScale(px)) setSizeWarn(true);
          else setSizeWarn(false);
          editor.chain().focus().setFontSize(`${px}px`).run();
          e.target.selectedIndex = 0;
        }}
      >
        <option value="">Size</option>
        {FONT_SIZE_SCALE.map((n) => (
          <option key={n} value={n}>
            {n}px
          </option>
        ))}
      </select>
      {sizeWarn && (
        <span style={{ fontSize: 10, color: "#b26a00" }}>Custom size — not on type scale</span>
      )}

      <span style={sep} />

      <button
        type="button"
        style={{ ...btn, fontWeight: 700, background: editor.isActive("bold") ? "#e3f2fd" : "#fff" }}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (⌘B)"
      >
        B
      </button>
      <button
        type="button"
        style={{ ...btn, fontStyle: "italic", background: editor.isActive("italic") ? "#e3f2fd" : "#fff" }}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (⌘I)"
      >
        I
      </button>
      <button
        type="button"
        style={{ ...btn, textDecoration: "underline", background: editor.isActive("underline") ? "#e3f2fd" : "#fff" }}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline (⌘U)"
      >
        U
      </button>
      <button
        type="button"
        style={{ ...btn, textDecoration: "line-through", background: editor.isActive("strike") ? "#e3f2fd" : "#fff" }}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        S
      </button>

      <span style={sep} />

      <span style={{ fontSize: 11, color: "#555" }}>A</span>
      <select
        style={btn}
        onChange={(e) => {
          const v = e.target.value;
          if (v) editor.chain().focus().setColor(v).run();
          e.target.selectedIndex = 0;
        }}
      >
        <option value="">Text</option>
        {BRAND_COLORS.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <span style={{ fontSize: 11, color: "#555" }}>◐</span>
      <select
        style={btn}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "__none__") editor.chain().focus().unsetHighlight().run();
          else if (v) editor.chain().focus().setHighlight({ color: v }).run();
          e.target.selectedIndex = 0;
        }}
      >
        <option value="">Highlight</option>
        <option value="__none__">None</option>
        {BRAND_COLORS.map((c) => (
          <option key={`h-${c.value}`} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <span style={sep} />

      <button
        type="button"
        style={btn}
        title="Link (⌘K)"
        onClick={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          setLinkHref(prev ?? "https://");
          setLinkOpen((o) => !o);
        }}
      >
        🔗
      </button>
      {onOpenLinkPanel && (
        <button type="button" style={btn} title="Link properties" onClick={onOpenLinkPanel}>
          ⚙︎
        </button>
      )}

      <span style={sep} />

      {(["left", "center", "right", "justify"] as const).map((a) => (
        <button
          key={a}
          type="button"
          style={btn}
          onClick={() => editor.chain().focus().setTextAlign(a).run()}
          title={a}
        >
          {a[0].toUpperCase()}
        </button>
      ))}

      <span style={sep} />

      <button type="button" style={btn} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
        •
      </button>
      <button type="button" style={btn} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
        1.
      </button>

      <span style={sep} />

      <button type="button" style={btn} onClick={() => editor.chain().focus().undo().run()} title="Undo">
        ↶
      </button>
      <button type="button" style={btn} onClick={() => editor.chain().focus().redo().run()} title="Redo">
        ↷
      </button>

      <button
        type="button"
        style={btn}
        title="Clear formatting"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        ✕
      </button>

      {linkOpen && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 6,
            background: "#fff",
            width: "100%",
          }}
        >
          <label style={{ fontSize: 12 }}>
            URL
            <input
              style={{ width: "100%", marginTop: 4 }}
              value={linkHref}
              onChange={(e) => setLinkHref(e.target.value)}
            />
          </label>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              style={btn}
              onClick={() => {
                const href = linkHref.trim();
                if (href) editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
                setLinkOpen(false);
              }}
            >
              Apply
            </button>
            <button
              type="button"
              style={btn}
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setLinkOpen(false);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
