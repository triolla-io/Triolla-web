"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface PageMetadata {
  slug: string;
  title_en: string;
  title_he: string;
  description_en: string;
  description_he: string;
  og_image?: string;
  og_type: "website" | "article";
  keywords_en?: string;
  keywords_he?: string;
  section: "main" | "service" | "blog";
}

interface PageListItem {
  slug: string;
  title_en: string;
  title_he: string;
  section: string;
}

export default function MetadataEditorPage() {
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<PageMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load list of pages on mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await fetch("/api/metadata");
        const data = await res.json();
        setPages(data.pages);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load pages" });
        console.error(error);
      }
    };
    fetchPages();
  }, []);

  // Load metadata when a page is selected
  useEffect(() => {
    if (!selectedSlug) return;

    const fetchMetadata = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/metadata/${selectedSlug}`);
        if (!res.ok) throw new Error("Failed to load metadata");
        const data = await res.json();
        setMetadata(data);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load metadata" });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [selectedSlug]);

  const handleSave = async () => {
    if (!metadata) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/metadata/${metadata.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save");
      }

      setMessage({ type: "success", text: "Metadata saved successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: `Error: ${error instanceof Error ? error.message : "Unknown error"}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: "2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "2rem" }}>Metadata Editor</h1>
          <p style={{ color: "#666", margin: 0 }}>Update page titles, descriptions, and SEO fields</p>
          <div style={{ marginTop: "1rem" }}>
            <Link href="/" style={{ color: "#0066cc", textDecoration: "none" }}>
              ← Back to site
            </Link>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem" }}>
          {/* Page List Sidebar */}
          <div style={{ background: "white", borderRadius: "8px", padding: "1.5rem", height: "fit-content" }}>
            <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>Pages</h2>
            {pages.length === 0 ? (
              <p style={{ color: "#999" }}>No pages found</p>
            ) : (
              <div>
                {pages.map((page) => (
                  <button
                    key={page.slug}
                    onClick={() => setSelectedSlug(page.slug)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      marginBottom: "0.5rem",
                      border: selectedSlug === page.slug ? "2px solid #0066cc" : "1px solid #ddd",
                      background: selectedSlug === page.slug ? "#f0f7ff" : "white",
                      borderRadius: "4px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 200ms",
                    }}
                  >
                    <div style={{ fontWeight: "500", fontSize: "0.95rem" }}>{page.slug}</div>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>📌 {page.section}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Editor Panel */}
          <div style={{ background: "white", borderRadius: "8px", padding: "2rem" }}>
            {!selectedSlug ? (
              <div style={{ color: "#999", textAlign: "center", padding: "2rem" }}>
                <p>Select a page from the list to edit</p>
              </div>
            ) : loading ? (
              <div style={{ color: "#999", textAlign: "center", padding: "2rem" }}>
                <p>Loading...</p>
              </div>
            ) : metadata ? (
              <>
                {/* Messages */}
                {message && (
                  <div
                    style={{
                      padding: "1rem",
                      marginBottom: "1.5rem",
                      borderRadius: "4px",
                      background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
                      color: message.type === "success" ? "#166534" : "#991b1b",
                      border: `1px solid ${message.type === "success" ? "#86efac" : "#fca5a5"}`,
                    }}
                  >
                    {message.text}
                  </div>
                )}

                {/* Form */}
                <div>
                  <div style={{ marginBottom: "2rem" }}>
                    <h3 style={{ marginTop: 0, fontSize: "1.1rem" }}>{metadata.slug}</h3>
                    <p style={{ color: "#666", fontSize: "0.9rem" }}>Section: {metadata.section}</p>
                  </div>

                  {/* Bilingual Editor */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                    {/* English */}
                    <div>
                      <h4 style={{ marginTop: 0 }}>English</h4>

                      <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                          Title
                        </label>
                        <input
                          type="text"
                          value={metadata.title_en}
                          onChange={(e) => setMetadata({ ...metadata, title_en: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "0.95rem",
                            boxSizing: "border-box",
                          }}
                        />
                        <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.25rem" }}>
                          {metadata.title_en.length} / 80 characters
                        </div>
                      </div>

                      <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                          Description
                        </label>
                        <textarea
                          value={metadata.description_en}
                          onChange={(e) => setMetadata({ ...metadata, description_en: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "0.95rem",
                            boxSizing: "border-box",
                            minHeight: "80px",
                            fontFamily: "monospace",
                          }}
                        />
                        <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.25rem" }}>
                          {metadata.description_en.length} / 160 characters
                        </div>
                      </div>

                      <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                          Keywords (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={metadata.keywords_en || ""}
                          onChange={(e) => setMetadata({ ...metadata, keywords_en: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "0.95rem",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>

                    {/* Hebrew */}
                    <div>
                      <h4 style={{ marginTop: 0 }}>עברית</h4>

                      <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                          Title
                        </label>
                        <input
                          type="text"
                          value={metadata.title_he}
                          onChange={(e) => setMetadata({ ...metadata, title_he: e.target.value })}
                          dir="rtl"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "0.95rem",
                            boxSizing: "border-box",
                          }}
                        />
                        <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.25rem" }}>
                          {metadata.title_he.length} / 80 characters
                        </div>
                      </div>

                      <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                          Description
                        </label>
                        <textarea
                          value={metadata.description_he}
                          onChange={(e) => setMetadata({ ...metadata, description_he: e.target.value })}
                          dir="rtl"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "0.95rem",
                            boxSizing: "border-box",
                            minHeight: "80px",
                            fontFamily: "monospace",
                          }}
                        />
                        <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.25rem" }}>
                          {metadata.description_he.length} / 160 characters
                        </div>
                      </div>

                      <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                          Keywords (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={metadata.keywords_he || ""}
                          onChange={(e) => setMetadata({ ...metadata, keywords_he: e.target.value })}
                          dir="rtl"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            fontSize: "0.95rem",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* OG Image & Type */}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                        OG Image URL
                      </label>
                      <input
                        type="text"
                        value={metadata.og_image || ""}
                        onChange={(e) => setMetadata({ ...metadata, og_image: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "0.95rem",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
                        OG Type
                      </label>
                      <select
                        value={metadata.og_type}
                        onChange={(e) => setMetadata({ ...metadata, og_type: e.target.value as any })}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "0.95rem",
                          boxSizing: "border-box",
                        }}
                      >
                        <option value="website">Website</option>
                        <option value="article">Article</option>
                      </select>
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      padding: "0.75rem 1.5rem",
                      background: "#0066cc",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      fontWeight: "500",
                      cursor: saving ? "not-allowed" : "pointer",
                      opacity: saving ? 0.6 : 1,
                      fontSize: "0.95rem",
                    }}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
