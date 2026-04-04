import type { Metadata } from "next";

export function metadataTitle(meta: Metadata): string {
  const t = meta.title;
  if (typeof t === "string") return t;
  if (t && typeof t === "object" && t !== null && "default" in t) {
    const d = (t as { default?: unknown }).default;
    if (typeof d === "string") return d;
  }
  return "";
}

export function metadataDescription(meta: Metadata): string {
  const d = meta.description;
  return typeof d === "string" ? d : "";
}
