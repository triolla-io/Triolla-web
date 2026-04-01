import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-amazon-unveils-a-fresh-modern-design-for-the-prime-video-app-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-amazon-unveils-a-fresh-modern-design-for-the-prime-video-app | Triolla",
  description: "Learn more about blog-amazon-unveils-a-fresh-modern-design-for-the-prime-video-app at Triolla.",
  path: "/blog-amazon-unveils-a-fresh-modern-design-for-the-prime-video-app",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="amazon-unveils-a-fresh-modern-design-for-the-prime-video-app" deps={deps} />;
}
