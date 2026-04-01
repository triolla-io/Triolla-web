import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-iso-27001-2025-2026-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-iso-27001-2025-2026 | Triolla",
  description: "Learn more about blog-iso-27001-2025-2026 at Triolla.",
  path: "/blog-iso-27001-2025-2026",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="iso-27001-2025-2026" deps={deps} />;
}
