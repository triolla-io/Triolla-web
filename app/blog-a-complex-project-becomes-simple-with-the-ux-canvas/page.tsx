import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-a-complex-project-becomes-simple-with-the-ux-canvas-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-a-complex-project-becomes-simple-with-the-ux-canvas | Triolla",
  description: "Learn more about blog-a-complex-project-becomes-simple-with-the-ux-canvas at Triolla.",
  path: "/blog-a-complex-project-becomes-simple-with-the-ux-canvas",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="a-complex-project-becomes-simple-with-the-ux-canvas" deps={deps} />;
}
