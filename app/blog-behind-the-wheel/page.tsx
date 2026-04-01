import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-behind-the-wheel-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-behind-the-wheel | Triolla",
  description: "Learn more about blog-behind-the-wheel at Triolla.",
  path: "/blog-behind-the-wheel",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="behind-the-wheel" deps={deps} />;
}
