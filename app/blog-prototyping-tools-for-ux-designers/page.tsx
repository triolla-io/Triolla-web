import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-prototyping-tools-for-ux-designers-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-prototyping-tools-for-ux-designers | Triolla",
  description: "Learn more about blog-prototyping-tools-for-ux-designers at Triolla.",
  path: "/blog-prototyping-tools-for-ux-designers",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="prototyping-tools-for-ux-designers" deps={deps} />;
}
