"use client";

import type { Editor } from "@tiptap/core";
import type { CSSProperties } from "react";
import { useState } from "react";
import { BRAND_COLORS, FONT_SIZE_SCALE } from "./brandPalette";

const btn = (active = false): CSSProperties => ({
  border: "1px solid " + (active ? "#1a73e8" : "#ccc"),
  background: active ? "#e3f2fd" : "#fff",
  borderRadius: 4,
  padding: "2px 7px",
  fontSize: 12,
  cursor: "pointer",
  whiteSpace: "nowrap",
});

const swatch = (color: string): CSSProperties => ({
  width: 16,
  height: 16,
  borderRadius: 3,
  background: color,
  border: "1px solid #999",
  cursor: "pointer",
  flexShrink: 0,
});

const sep: CSSProperties = {
  width: 1,
  height: 20,
  background: "#ddd",
  margin: "0 2px",
  flexShrink: 0,
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
  const [showTextColors, setShowTextColors] = useState(false);
  const [showHighlightColors, setShowHighlightColors] = useState(false);

  if (!editor) return null;

  const blockType = editor.isActive("heading", { level: 1 })
    ? "h1"
    : editor.isActive("heading", { level: 2 })
      ? "h2"
      : editor.isActive("heading", { level: 3 })
        ? "h3"
        : editor.isActive("blockquote")
          ? "quote"
          : "p";

  return (
    <div
      dir={dir}
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 3,
        padding: "5px 8px",
        background: "#fafafa",
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        maxWidth: "min(96vw, 960px)",
        zIndex: 999998,
      }}
    >
      {/* Block type */}
      <button type="button" style={btn(blockType === "p")} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setParagraph().run(); }} title="Paragraph">P</button>
      <button type="button" style={btn(blockType === "h1")} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 1 }).run(); }} title="Heading 1">H1</button>
      <button type="button" style={btn(blockType === "h2")} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 2 }).run(); }} title="Heading 2">H2</button>
      <button type="button" style={btn(blockType === "h3")} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHeading({ level: 3 }).run(); }} title="Heading 3">H3</button>
      <button type="button" style={btn(blockType === "quote")} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBlockquote().run(); }} title="Blockquote">&ldquo;</button>

      <span style={sep} />

      {/* Font size */}
      <input
        type="number"
        min={8}
        max={128}
        style={{ width: 44, fontSize: 12, border: "1px solid #ccc", borderRadius: 4, padding: "2px 4px", textAlign: "center" }}
        placeholder="px"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const px = Number((e.target as HTMLInputElement).value);
            if (px > 0) editor.chain().focus().setFontSize(`${px}px`).run();
          }
        }}
        onBlur={(e) => {
          const px = Number(e.target.value);
          if (px > 0) editor.chain().focus().setFontSize(`${px}px`).run();
        }}
        title="Font size (px)"
      />

      <span style={sep} />

      {/* Inline marks */}
      <button type="button" style={{ ...btn(editor.isActive("bold")), fontWeight: 700 }} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run(); }} title="Bold (⌘B)">B</button>
      <button type="button" style={{ ...btn(editor.isActive("italic")), fontStyle: "italic" }} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run(); }} title="Italic (⌘I)">I</button>
      <button type="button" style={{ ...btn(editor.isActive("underline")), textDecoration: "underline" }} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run(); }} title="Underline (⌘U)">U</button>
      <button type="button" style={{ ...btn(editor.isActive("strike")), textDecoration: "line-through" }} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleStrike().run(); }} title="Strikethrough">S</button>

      <span style={sep} />

      {/* Text color swatches */}
      <button
        type="button"
        style={btn(showTextColors)}
        onMouseDown={(e) => { e.preventDefault(); setShowTextColors((v) => !v); setShowHighlightColors(false); }}
        title="Text color"
      >
        A
      </button>
      {showTextColors && BRAND_COLORS.map((c) => (
        <button
          key={c.value}
          type="button"
          title={c.label}
          style={swatch(c.value)}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(c.value).run(); setShowTextColors(false); }}
        />
      ))}

      <span style={sep} />

      {/* Highlight swatches */}
      <button
        type="button"
        style={btn(showHighlightColors)}
        onMouseDown={(e) => { e.preventDefault(); setShowHighlightColors((v) => !v); setShowTextColors(false); }}
        title="Highlight"
      >
        ◐
      </button>
      {showHighlightColors && (
        <>
          <button
            type="button"
            style={{ ...btn(), fontSize: 10 }}
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); setShowHighlightColors(false); }}
            title="Remove highlight"
          >
            ✕
          </button>
          {BRAND_COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              title={c.label}
              style={swatch(c.value)}
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setHighlight({ color: c.value }).run(); setShowHighlightColors(false); }}
            />
          ))}
        </>
      )}

      <span style={sep} />

      {/* Link */}
      <button
        type="button"
        style={btn(editor.isActive("link"))}
        title="Link (⌘K)"
        onMouseDown={(e) => {
          e.preventDefault();
          const prev = editor.getAttributes("link").href as string | undefined;
          setLinkHref(prev ?? "https://");
          setLinkOpen((o) => !o);
        }}
      >
        🔗
      </button>
      {onOpenLinkPanel && (
        <button type="button" style={btn()} title="Link properties" onMouseDown={(e) => { e.preventDefault(); onOpenLinkPanel(); }}>⚙︎</button>
      )}

      <span style={sep} />

      {/* Alignment */}
      {(["left", "center", "right", "justify"] as const).map((a) => (
        <button
          key={a}
          type="button"
          style={btn(editor.isActive({ textAlign: a }))}
          onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setTextAlign(a).run(); }}
          title={a}
        >
          {a === "left" ? "⇤" : a === "center" ? "↔" : a === "right" ? "⇥" : "≡"}
        </button>
      ))}

      <span style={sep} />

      {/* Lists */}
      <button type="button" style={btn(editor.isActive("bulletList"))} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBulletList().run(); }} title="Bullet list">•</button>
      <button type="button" style={btn(editor.isActive("orderedList"))} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleOrderedList().run(); }} title="Numbered list">1.</button>

      <span style={sep} />

      {/* Undo / redo / clear */}
      <button type="button" style={btn()} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }} title="Undo">↶</button>
      <button type="button" style={btn()} onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }} title="Redo">↷</button>
      <button type="button" style={btn()} title="Clear formatting" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetAllMarks().clearNodes().run(); }}>✕</button>

      {/* Link input row */}
      {linkOpen && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 6,
            background: "#fff",
            width: "100%",
          }}
        >
          <input
            style={{ flex: 1, minWidth: 160, fontSize: 12, border: "1px solid #ccc", borderRadius: 4, padding: "2px 6px" }}
            value={linkHref}
            onChange={(e) => setLinkHref(e.target.value)}
            placeholder="https://"
          />
          <button
            type="button"
            style={btn()}
            onMouseDown={(e) => {
              e.preventDefault();
              const href = linkHref.trim();
              if (href) editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
              setLinkOpen(false);
            }}
          >
            Apply
          </button>
          <button
            type="button"
            style={btn()}
            onMouseDown={(e) => {
              e.preventDefault();
              editor.chain().focus().unsetLink().run();
              setLinkOpen(false);
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
