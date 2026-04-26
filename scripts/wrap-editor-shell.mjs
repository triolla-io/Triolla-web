import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "app");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p, out);
    else if (name.name === "page.tsx") out.push(p);
  }
  return out;
}

const SNAPSHOT_LINE =
  /^\s*<SnapshotClient entry=\{entry\} bodyHtml=\{bodyHtml\} widgetProps=\{widgetProps\} \/>\s*$/m;

const WRAPPED = `      <EditorShell slug={SLUG} locale={LOCALE} dir={entry.dir}>
        <SnapshotClient entry={entry} bodyHtml={bodyHtml} widgetProps={widgetProps} />
      </EditorShell>`;

const IMPORT_LINE = 'import { EditorShell } from "@/lib/editor/EditorShell";';

let n = 0;
for (const file of walk(root)) {
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes("<SnapshotClient") || s.includes("EditorShell")) continue;
  if (!SNAPSHOT_LINE.test(s)) {
    console.warn("skip (pattern mismatch):", path.relative(root, file));
    continue;
  }
  if (!s.includes(IMPORT_LINE)) {
    const insertAt = s.indexOf('import SnapshotClient from "@/lib/SnapshotClient";');
    if (insertAt === -1) continue;
    const end = s.indexOf("\n", insertAt) + 1;
    s = s.slice(0, end) + IMPORT_LINE + "\n" + s.slice(end);
  }
  s = s.replace(SNAPSHOT_LINE, WRAPPED);
  fs.writeFileSync(file, s);
  n += 1;
}
console.log("wrapped", n, "pages");
