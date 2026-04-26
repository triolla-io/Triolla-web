/**
 * Make fragment HTML match browser `innerHTML` / parsing so `dangerouslySetInnerHTML`
 * on a client `main` does not trip hydration.
 *
 * - Extra spaces before `class` (e.g. `<div  class=`) are collapsed by the HTML parser.
 * - Uppercase `<Br>` (WordPress) is serialized as `<br>`.
 * - Line endings normalized so SSR and client compare the same bytes.
 */
export function normalizeFragmentHtml(bodyHtml: string): string {
  let s = bodyHtml.replace(/\r\n/g, "\n");
  s = s.replace(/(<[a-zA-Z][\w-]*) +class="/g, "$1 class=\"");
  s = s.replace(/<Br\s*\/?\s*>/gi, "<br>");
  s = s.replace(/<br\s*\/>/gi, "<br>");
  return s;
}
