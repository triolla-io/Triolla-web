import Link from "next/link";
import { listAllPages } from "@/lib/cms/contentStore";
import { getAllSlugs, getEntry } from "@/lib/snapshotRegistry";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const pages = await listAllPages();

  // Build a deduplicated list of snapshot pages for the "Existing pages" section.
  // Group by slug, collect locales. Limit to 200 to keep the page fast.
  const allSlugs = getAllSlugs();
  const snapshotMap = new Map<string, { slug: string; locales: string[]; title: string }>();
  for (const { slug, locale } of allSlugs) {
    if (!snapshotMap.has(slug)) {
      const entry = getEntry(slug, locale);
      snapshotMap.set(slug, {
        slug,
        locales: [],
        title: entry?.head?.title?.replace(/ [-|].*$/, "").trim() ?? slug,
      });
    }
    snapshotMap.get(slug)!.locales.push(locale);
  }
  const snapshotPages = [...snapshotMap.values()].slice(0, 200);

  return (
    <div>
      {/* ── CMS Pages ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>CMS Pages</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <NewLink kind="page" />
          <NewLink kind="blog" />
        </div>
      </div>

      {pages.length === 0 ? (
        <div style={empty}>
          No CMS pages yet. Create your first page or blog post above.
        </div>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <Th>Slug</Th>
              <Th>Kind</Th>
              <Th>Title</Th>
              <Th>Locales</Th>
              <Th>Updated</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr key={`${p.kind}/${p.slug}`}>
                <Td><code>{p.slug}</code></Td>
                <Td>{p.kind}</Td>
                <Td>{p.title || <em style={{ opacity: 0.5 }}>untitled</em>}</Td>
                <Td>{p.locales.map((l) => <span key={l} style={chip}>{l}</span>)}</Td>
                <Td>{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "—"}</Td>
                <Td>
                  <Link href={`/admin/editor/${p.kind}/${encodeURIComponent(p.slug)}`} style={editLink}>
                    Edit
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── Existing Snapshot Pages ── */}
      <div style={{ marginTop: 48 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Existing Pages</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.6 }}>
            Click "Edit text" to change text and images on any live page. No coding needed.
          </p>
        </div>
        <table style={table}>
          <thead>
            <tr>
              <Th>Page</Th>
              <Th>Title</Th>
              <Th>Locales</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {snapshotPages.map((p) => (
              <tr key={p.slug}>
                <Td><code style={{ fontSize: 12 }}>{p.slug.replace(/^triolla-io-/, "/")}</code></Td>
                <Td style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.title}
                </Td>
                <Td>
                  {p.locales.map((l) => <span key={l} style={chip}>{l}</span>)}
                </Td>
                <Td>
                  <div style={{ display: "flex", gap: 8 }}>
                    {p.locales.map((l) => (
                      <Link
                        key={l}
                        href={`/admin/page-editor/${encodeURIComponent(p.slug)}?locale=${l}&edit=1`}
                        style={editTextLink}
                      >
                        Edit text {p.locales.length > 1 ? `(${l.toUpperCase()})` : ""}
                      </Link>
                    ))}
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewLink({ kind }: { kind: "page" | "blog" }) {
  return (
    <Link href={`/admin/editor/${kind}/__new__`} style={primaryBtn}>
      + New {kind === "page" ? "Page" : "Blog Post"}
    </Link>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th style={th}>{children}</th>;
}
function Td({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ ...td, ...style }}>{children}</td>;
}

const empty: React.CSSProperties = {
  padding: "48px 24px",
  textAlign: "center",
  border: "1px dashed #2b3036",
  borderRadius: 8,
  opacity: 0.7,
};

const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "1px solid #1f2328",
  fontWeight: 600,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.5,
  opacity: 0.6,
};

const td: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #1f2328",
  verticalAlign: "middle",
};

const chip: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 8px",
  marginRight: 4,
  borderRadius: 999,
  background: "#1f2328",
  border: "1px solid #2b3036",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const editLink: React.CSSProperties = { color: "#60a5fa", textDecoration: "none", fontSize: 13 };
const editTextLink: React.CSSProperties = { color: "#34d399", textDecoration: "none", fontSize: 13 };

const primaryBtn: React.CSSProperties = {
  background: "#3b82f6",
  color: "#fff",
  padding: "8px 12px",
  borderRadius: 6,
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 600,
};
