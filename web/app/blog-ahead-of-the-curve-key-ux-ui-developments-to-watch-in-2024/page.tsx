import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-ahead-of-the-curve-key-ux-ui-developments-to-watch-in-2024-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-ahead-of-the-curve-key-ux-ui-developments-to-watch-in-2024 | Triolla",
  description: "Learn more about blog-ahead-of-the-curve-key-ux-ui-developments-to-watch-in-2024 at Triolla.",
  path: "/blog-ahead-of-the-curve-key-ux-ui-developments-to-watch-in-2024",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="ahead-of-the-curve-key-ux-ui-developments-to-watch-in-2024" deps={deps} />;
}
