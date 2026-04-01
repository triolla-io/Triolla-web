import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-guide-product-roadmap-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-guide-product-roadmap | Triolla",
  description: "Learn more about blog-the-guide-product-roadmap at Triolla.",
  path: "/blog-the-guide-product-roadmap",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-guide-product-roadmap" deps={deps} />;
}
