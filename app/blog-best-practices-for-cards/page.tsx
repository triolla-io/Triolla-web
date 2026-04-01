import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-best-practices-for-cards-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-best-practices-for-cards | Triolla",
  description: "Learn more about blog-best-practices-for-cards at Triolla.",
  path: "/blog-best-practices-for-cards",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="best-practices-for-cards" deps={deps} />;
}
