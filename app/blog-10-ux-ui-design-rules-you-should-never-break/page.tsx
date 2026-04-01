import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-10-ux-ui-design-rules-you-should-never-break-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-10-ux-ui-design-rules-you-should-never-break | Triolla",
  description: "Learn more about blog-10-ux-ui-design-rules-you-should-never-break at Triolla.",
  path: "/blog-10-ux-ui-design-rules-you-should-never-break",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="10-ux-ui-design-rules-you-should-never-break" deps={deps} />;
}
