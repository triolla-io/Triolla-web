import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-revolutionizing-healthcare-with-ux-design-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-revolutionizing-healthcare-with-ux-design | Triolla",
  description: "Learn more about blog-revolutionizing-healthcare-with-ux-design at Triolla.",
  path: "/blog-revolutionizing-healthcare-with-ux-design",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="revolutionizing-healthcare-with-ux-design" deps={deps} />;
}
