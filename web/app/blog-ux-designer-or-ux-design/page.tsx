import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-ux-designer-or-ux-design-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-ux-designer-or-ux-design | Triolla",
  description: "Learn more about blog-ux-designer-or-ux-design at Triolla.",
  path: "/blog-ux-designer-or-ux-design",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="ux-designer-or-ux-design" deps={deps} />;
}
