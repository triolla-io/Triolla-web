import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-navigating-the-future-of-ux-design-2-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-navigating-the-future-of-ux-design-2 | Triolla",
  description: "Learn more about blog-navigating-the-future-of-ux-design-2 at Triolla.",
  path: "/blog-navigating-the-future-of-ux-design-2",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="navigating-the-future-of-ux-design-2" deps={deps} />;
}
