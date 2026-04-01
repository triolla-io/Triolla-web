import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-mobile-design-best-practices-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-mobile-design-best-practices | Triolla",
  description: "Learn more about blog-mobile-design-best-practices at Triolla.",
  path: "/blog-mobile-design-best-practices",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="mobile-design-best-practices" deps={deps} />;
}
