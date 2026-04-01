import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-best-practices-for-minimalist-design-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-best-practices-for-minimalist-design | Triolla",
  description: "Learn more about blog-best-practices-for-minimalist-design at Triolla.",
  path: "/blog-best-practices-for-minimalist-design",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="best-practices-for-minimalist-design" deps={deps} />;
}
