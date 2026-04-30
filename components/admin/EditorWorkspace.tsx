"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { CmsKind, CmsLocale } from "@/lib/cms/contentStore";

type TemplateEntry = { slug: string; title: string; ogImage?: string; locale: string };

const Monaco = dynamic(() => import("@monaco-editor/react"), { ssr: false });

type Tab = "html" | "css" | "meta";
type DeviceWidth = 375 | 768 | 1440;

type LocaleState = {
  body: string;
  styles: string;
  meta: {
    title: string;
    description: string;
    ogImage?: string;
    status: "draft" | "published";
  };
  loaded: boolean;
  exists: boolean;
  dirty: boolean;
};

const EMPTY_LOCALE: LocaleState = {
  body: "",
  styles: "",
  meta: { title: "", description: "", ogImage: "", status: "draft" },
  loaded: false,
  exists: false,
  dirty: false,
};

export default function EditorWorkspace({
  kind,
  initialSlug,
  isNew,
}: {
  kind: CmsKind;
  initialSlug: string;
  isNew: boolean;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(initialSlug);
  const [creating, setCreating] = useState(isNew);
  const [createStep, setCreateStep] = useState<"template" | "slug">(isNew ? "template" : "slug");
  const [templates, setTemplates] = useState<TemplateEntry[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateEntry | null>(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [locale, setLocale] = useState<CmsLocale>("en");
  const [states, setStates] = useState<Record<CmsLocale, LocaleState>>({
    en: { ...EMPTY_LOCALE },
    he: { ...EMPTY_LOCALE },
  });
  const [tab, setTab] = useState<Tab>("html");
  const [device, setDevice] = useState<DeviceWidth>(1440);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const current = states[locale];

  // Load existing content for both locales when slug is known.
  useEffect(() => {
    if (creating) return;
    let alive = true;
    (async () => {
      for (const l of ["en", "he"] as CmsLocale[]) {
        const res = await fetch(
          `/api/cms/page?kind=${kind}&slug=${encodeURIComponent(slug)}&locale=${l}`,
          { cache: "no-store" }
        );
        if (!alive) return;
        if (res.ok) {
          const { page } = await res.json();
          setStates((s) => ({
            ...s,
            [l]: {
              body: page.body,
              styles: page.styles,
              meta: {
                title: page.meta.title ?? "",
                description: page.meta.description ?? "",
                ogImage: page.meta.ogImage ?? "",
                status: page.meta.status ?? "draft",
              },
              loaded: true,
              exists: true,
              dirty: false,
            },
          }));
        } else {
          setStates((s) => ({ ...s, [l]: { ...EMPTY_LOCALE, loaded: true } }));
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [kind, slug, creating]);

  const update = useCallback(
    (patch: Partial<LocaleState>) => {
      setStates((s) => ({
        ...s,
        [locale]: { ...s[locale], ...patch, dirty: true, loaded: true, exists: true },
      }));
    },
    [locale]
  );

  // Load templates when entering the template-picker step.
  useEffect(() => {
    if (!creating || createStep !== "template") return;
    let alive = true;
    setLoadingTemplates(true);
    fetch(`/api/cms/templates/?kind=${kind}&locale=en`)
      .then((r) => r.json())
      .then((d: { templates?: TemplateEntry[] }) => {
        if (alive) setTemplates(d.templates ?? []);
      })
      .catch(() => {})
      .finally(() => { if (alive) setLoadingTemplates(false); });
    return () => { alive = false; };
  }, [creating, createStep, kind]);

  const handleCreate = async () => {
    const newSlug = slug.trim().toLowerCase();
    if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(newSlug)) {
      setToast("Slug must be lowercase letters, numbers, and hyphens.");
      return;
    }
    setBusy(true);
    try {
      const body: Record<string, unknown> = { kind, slug: newSlug, locale };
      if (selectedTemplate) body.fromSnapshotTemplate = selectedTemplate.slug;
      const res = await fetch("/api/cms/create/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setToast(`Create failed: ${j.error ?? res.status}`);
        return;
      }
      setCreating(false);
      router.replace(`/admin/editor/${kind}/${encodeURIComponent(newSlug)}`);
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/cms/save/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind,
          slug,
          locale,
          body: current.body,
          styles: current.styles,
          meta: current.meta,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setToast(`Save failed: ${JSON.stringify(j.error ?? res.status)}`);
        return;
      }
      setStates((s) => ({ ...s, [locale]: { ...s[locale], dirty: false, exists: true } }));
      setToast("Saved.");
    } finally {
      setBusy(false);
    }
  };

  const handlePublish = async () => {
    if (current.dirty) {
      await handleSave();
    }
    setBusy(true);
    try {
      const res = await fetch("/api/cms/publish/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: `CMS: edit ${kind}/${slug} [${locale}]` }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setToast(`Publish failed: ${j.error ?? res.status}`);
        return;
      }
      setToast(`Published: ${j.sha ?? "ok"}`);
    } finally {
      setBusy(false);
    }
  };

  const handleRedeploy = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/cms/redeploy/", { method: "POST" });
      const j = await res.json().catch(() => ({}));
      setToast(res.ok ? "Coolify redeploy triggered." : `Redeploy failed: ${j.error ?? res.status}`);
    } finally {
      setBusy(false);
    }
  };

  const switchLocale = (next: CmsLocale) => {
    if (next === locale) return;
    if (current.dirty && !confirm("Unsaved changes in this locale. Switch anyway?")) return;
    setLocale(next);
  };

  if (creating) {
    // Step 1 — template picker
    if (createStep === "template") {
      return (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>
              New {kind === "page" ? "Page" : "Blog Post"} — Pick a template
            </h2>
            <button onClick={() => router.push("/admin")} style={btnSecondary}>Cancel</button>
          </div>
          <p style={{ opacity: 0.6, fontSize: 13, marginBottom: 20 }}>
            Choose an existing {kind === "blog" ? "blog post" : "page"} as a visual template.
            Your new {kind === "blog" ? "post" : "page"} will inherit the same layout and styles.
          </p>

          {/* Blank option */}
          <div
            onClick={() => { setSelectedTemplate(null); setCreateStep("slug"); }}
            style={templateCard(false)}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
            <strong style={{ fontSize: 14 }}>Blank page</strong>
            <p style={{ fontSize: 12, opacity: 0.6, margin: "4px 0 0" }}>Start from scratch with your own HTML & CSS</p>
          </div>

          {loadingTemplates && <p style={{ opacity: 0.5, fontSize: 13 }}>Loading templates…</p>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 16 }}>
            {templates.map((t) => (
              <div
                key={t.slug}
                onClick={() => { setSelectedTemplate(t); setCreateStep("slug"); }}
                style={templateCard(selectedTemplate?.slug === t.slug)}
              >
                {t.ogImage && (
                  <img
                    src={t.ogImage}
                    alt=""
                    style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 4, marginBottom: 8 }}
                  />
                )}
                <strong style={{ fontSize: 13, display: "block" }}>{t.title || t.slug}</strong>
                <p style={{ fontSize: 11, opacity: 0.5, margin: "4px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  /{t.slug.replace(/^triolla-io-/, "")}
                </p>
              </div>
            ))}
          </div>
          {toast ? <div style={toastBox}>{toast}</div> : null}
        </div>
      );
    }

    // Step 2 — slug + locale
    return (
      <div style={{ maxWidth: 480 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setCreateStep("template")} style={btnSecondary}>← Back</button>
          <h2 style={{ margin: 0, fontSize: 18 }}>New {kind === "page" ? "Page" : "Blog Post"}</h2>
        </div>

        {selectedTemplate && (
          <div style={{ background: "#0f1a0f", border: "1px solid #14532d", borderRadius: 6, padding: "10px 12px", marginBottom: 16, fontSize: 13 }}>
            ✓ Template: <strong>{selectedTemplate.title || selectedTemplate.slug}</strong>
            <button
              onClick={() => setSelectedTemplate(null)}
              style={{ marginLeft: 8, background: "none", border: 0, color: "#9ca3af", cursor: "pointer", fontSize: 12 }}
            >
              ✕ Remove
            </button>
          </div>
        )}

        <label style={lbl}>URL Slug</label>
        <input
          autoFocus
          value={slug === "__new__" ? "" : slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder={kind === "blog" ? "my-new-blog-post" : "my-new-page"}
          style={inp}
        />
        <p style={{ fontSize: 11, opacity: 0.5, margin: "4px 0 12px" }}>
          Lowercase letters, numbers, and hyphens only. e.g. <code>great-ux-tips</code>
        </p>

        <label style={lbl}>Language</label>
        <select value={locale} onChange={(e) => setLocale(e.target.value as CmsLocale)} style={inp}>
          <option value="en">English</option>
          <option value="he">Hebrew</option>
        </select>

        <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
          <button disabled={busy} onClick={handleCreate} style={btnPrimary}>
            {busy ? "Creating…" : "Create & Open Editor"}
          </button>
          <button onClick={() => router.push("/admin")} style={btnSecondary}>Cancel</button>
        </div>
        {toast ? <div style={toastBox}>{toast}</div> : null}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 480px", gap: 16, height: "calc(100vh - 130px)" }}>
      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, border: "1px solid #1f2328", borderRadius: 8, overflow: "hidden" }}>
        <div style={topBar}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <strong style={{ fontSize: 13 }}>{kind}/{slug}</strong>
            <select value={locale} onChange={(e) => switchLocale(e.target.value as CmsLocale)} style={selectMini}>
              <option value="en">EN</option>
              <option value="he">HE</option>
            </select>
            {current.dirty ? <span style={dirty}>● unsaved</span> : null}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button disabled={busy || !current.dirty} onClick={handleSave} style={btnPrimary}>Save</button>
            <button disabled={busy} onClick={handlePublish} style={btnPublish}>Publish</button>
            <button disabled={busy} onClick={handleRedeploy} style={btnSecondary} title="Force Coolify redeploy">↻</button>
          </div>
        </div>
        <div style={tabBar}>
          {(["html", "css", "meta"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={t === tab ? tabActive : tabInactive}>
              {t === "html" ? "body.html" : t === "css" ? "styles.css" : "meta.json"}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          {tab === "html" ? (
            <Monaco
              height="100%"
              defaultLanguage="html"
              theme="vs-dark"
              path={`${slug}-${locale}.html`}
              value={current.body}
              onChange={(v) => update({ body: v ?? "" })}
              options={{ minimap: { enabled: false }, wordWrap: "on", fontSize: 13 }}
            />
          ) : tab === "css" ? (
            <Monaco
              height="100%"
              defaultLanguage="css"
              theme="vs-dark"
              path={`${slug}-${locale}.css`}
              value={current.styles}
              onChange={(v) => update({ styles: v ?? "" })}
              options={{ minimap: { enabled: false }, wordWrap: "on", fontSize: 13 }}
            />
          ) : (
            <MetaForm
              meta={current.meta}
              onChange={(meta) => update({ meta })}
            />
          )}
        </div>
      </div>

      <Preview kind={kind} slug={slug} locale={locale} body={current.body} styles={current.styles} device={device} setDevice={setDevice} />
      {toast ? <div style={toastBox} onClick={() => setToast(null)}>{toast}</div> : null}
    </div>
  );
}

function MetaForm({
  meta,
  onChange,
}: {
  meta: { title: string; description: string; ogImage?: string; status: "draft" | "published" };
  onChange: (m: { title: string; description: string; ogImage?: string; status: "draft" | "published" }) => void;
}) {
  return (
    <div style={{ padding: 16, overflow: "auto", height: "100%" }}>
      <label style={lbl}>Title</label>
      <input style={inp} value={meta.title} onChange={(e) => onChange({ ...meta, title: e.target.value })} />
      <label style={lbl}>Description</label>
      <textarea
        style={{ ...inp, minHeight: 80, resize: "vertical" }}
        value={meta.description}
        onChange={(e) => onChange({ ...meta, description: e.target.value })}
      />
      <label style={lbl}>OG image URL</label>
      <input
        style={inp}
        value={meta.ogImage ?? ""}
        onChange={(e) => onChange({ ...meta, ogImage: e.target.value })}
        placeholder="/uploads/..."
      />
      <label style={lbl}>Status</label>
      <select
        style={inp}
        value={meta.status}
        onChange={(e) => onChange({ ...meta, status: e.target.value as "draft" | "published" })}
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>
    </div>
  );
}

function Preview({
  kind,
  slug,
  locale,
  body,
  styles,
  device,
  setDevice,
}: {
  kind: CmsKind;
  slug: string;
  locale: CmsLocale;
  body: string;
  styles: string;
  device: DeviceWidth;
  setDevice: (d: DeviceWidth) => void;
}) {
  const [debounced, setDebounced] = useState({ body, styles });
  useEffect(() => {
    const id = setTimeout(() => setDebounced({ body, styles }), 300);
    return () => clearTimeout(id);
  }, [body, styles]);

  const srcDoc = useMemo(() => {
    const scopeId = `cms-${kind}-${slug}`;
    const dir = locale === "he" ? "rtl" : "ltr";
    return `<!doctype html><html dir="${dir}"><head><meta charset="utf-8"><style>${debounced.styles
      .replace(/<\//g, "<\\/")}</style></head><body><div id="${scopeId}">${debounced.body}</div></body></html>`;
  }, [debounced, kind, slug, locale]);

  return (
    <div style={{ display: "flex", flexDirection: "column", border: "1px solid #1f2328", borderRadius: 8, overflow: "hidden" }}>
      <div style={topBar}>
        <strong style={{ fontSize: 13 }}>Preview</strong>
        <div style={{ display: "flex", gap: 6 }}>
          {[375, 768, 1440].map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d as DeviceWidth)}
              style={d === device ? tabActive : tabInactive}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, background: "#fff", display: "grid", placeItems: "start center", overflow: "auto", padding: 12 }}>
        <iframe
          title="preview"
          srcDoc={srcDoc}
          style={{ width: device, maxWidth: "100%", height: "100%", minHeight: 480, border: "1px solid #2b3036", background: "#fff" }}
        />
      </div>
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 12, opacity: 0.7, marginTop: 12, marginBottom: 6 };
const inp: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  background: "#0b0d10",
  color: "#e7e9ec",
  border: "1px solid #2b3036",
  borderRadius: 6,
  fontSize: 13,
  boxSizing: "border-box",
};
const btnPrimary: React.CSSProperties = {
  background: "#3b82f6",
  color: "#fff",
  border: 0,
  padding: "6px 12px",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
const btnPublish: React.CSSProperties = { ...btnPrimary, background: "#16a34a" };
const btnSecondary: React.CSSProperties = {
  background: "#1f2328",
  color: "#e7e9ec",
  border: "1px solid #2b3036",
  padding: "6px 12px",
  borderRadius: 6,
  fontSize: 13,
  cursor: "pointer",
};
const topBar: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 12px",
  background: "#0f1216",
  borderBottom: "1px solid #1f2328",
};
const tabBar: React.CSSProperties = { display: "flex", background: "#0b0d10", borderBottom: "1px solid #1f2328" };
const tabActive: React.CSSProperties = {
  background: "#1f2328",
  color: "#fff",
  border: 0,
  borderBottom: "2px solid #3b82f6",
  padding: "8px 14px",
  fontSize: 12,
  cursor: "pointer",
};
const tabInactive: React.CSSProperties = {
  background: "transparent",
  color: "#c8ccd2",
  border: 0,
  borderBottom: "2px solid transparent",
  padding: "8px 14px",
  fontSize: 12,
  cursor: "pointer",
};
const selectMini: React.CSSProperties = {
  background: "#0b0d10",
  color: "#e7e9ec",
  border: "1px solid #2b3036",
  borderRadius: 4,
  padding: "2px 6px",
  fontSize: 12,
};
const dirty: React.CSSProperties = { color: "#fbbf24", fontSize: 12 };
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
  maxWidth: 360,
};
function templateCard(selected: boolean): React.CSSProperties {
  return {
    border: selected ? "2px solid #3b82f6" : "1px solid #2b3036",
    borderRadius: 8,
    padding: 12,
    cursor: "pointer",
    background: selected ? "#0d1b2e" : "#11151a",
    transition: "border-color 0.15s",
    maxWidth: 220,
    marginBottom: 12,
  };
}
