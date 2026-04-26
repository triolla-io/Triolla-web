import createDOMPurify from "isomorphic-dompurify";

let hooksInstalled = false;

const ALLOWED_TAGS = [
  "strong",
  "em",
  "u",
  "s",
  "a",
  "br",
  "span",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "blockquote",
];

const ALLOWED_ATTR = ["href", "target", "rel", "style", "class"];

const ALLOWED_CSS_PROPS = new Set([
  "color",
  "background-color",
  "font-size",
  "font-weight",
  "font-style",
  "text-decoration",
  "text-align",
]);

function sanitizeStyleValue(style: string): string {
  const parts = style.split(";").map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  for (const part of parts) {
    const idx = part.indexOf(":");
    if (idx === -1) continue;
    const name = part.slice(0, idx).trim().toLowerCase();
    let value = part.slice(idx + 1).trim();
    if (!ALLOWED_CSS_PROPS.has(name)) continue;
    value = value.replace(/[<>"'`]/g, "");
    if (/expression|javascript|import|url\s*\(\s*["']?\s*javascript/i.test(value)) continue;
    out.push(`${name}: ${value}`);
  }
  return out.join("; ");
}

const purify = createDOMPurify();

function ensureHooks() {
  if (hooksInstalled) return;
  hooksInstalled = true;
  purify.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName !== "style") return;
    const clean = sanitizeStyleValue(data.attrValue);
    if (!clean) {
      data.keepAttr = false;
      return;
    }
    data.attrValue = clean;
  });
  purify.addHook("afterSanitizeAttributes", (node) => {
    if (String(node.tagName).toLowerCase() === "a") {
      const href = (node as { getAttribute?: (n: string) => string | null }).getAttribute?.("href");
      if (href && /^\s*javascript:/i.test(href)) {
        (node as { removeAttribute?: (n: string) => void }).removeAttribute?.("href");
      }
    }
  });
}

export function sanitizeEditorHtml(dirty: string): string {
  ensureHooks();
  return purify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    KEEP_CONTENT: false,
    RETURN_TRUSTED_TYPE: false,
  });
}
