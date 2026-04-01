import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-how-to-sync-with-your-product-designer-pros-best-practices-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-how-to-sync-with-your-product-designer-pros-best-practices | Triolla",
  description: "Learn more about blog-how-to-sync-with-your-product-designer-pros-best-practices at Triolla.",
  path: "/blog-how-to-sync-with-your-product-designer-pros-best-practices",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="how-to-sync-with-your-product-designer-pros-best-practices" deps={deps} />;
}
