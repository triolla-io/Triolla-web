import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-nlp-ux-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-nlp-ux | Triolla",
  description: "Learn more about blog-nlp-ux at Triolla.",
  path: "/blog-nlp-ux",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="nlp-ux" deps={deps} />;
}
