import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-ux-is-life-design-it-for-humans-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-ux-is-life-design-it-for-humans | Triolla",
  description: "Learn more about blog-ux-is-life-design-it-for-humans at Triolla.",
  path: "/blog-ux-is-life-design-it-for-humans",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="ux-is-life-design-it-for-humans" deps={deps} />;
}
