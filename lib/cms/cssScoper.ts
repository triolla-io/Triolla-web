import "server-only";
import postcss from "postcss";
import prefixer from "postcss-prefix-selector";

const SKIP_PREFIXING = new Set(["html", "body", ":root"]);

export async function scopeCss(css: string, scopeId: string): Promise<string> {
  if (!css.trim()) return "";
  const prefix = `#${scopeId}`;
  const result = await postcss([
    prefixer({
      prefix,
      transform(_pfx, selector, prefixed) {
        const trimmed = selector.trim();
        if (SKIP_PREFIXING.has(trimmed)) return prefix;
        // Replace `:root`, `html`, `body` references at start with the scope.
        return prefixed;
      },
    }),
  ]).process(css, { from: undefined });
  return result.css;
}
