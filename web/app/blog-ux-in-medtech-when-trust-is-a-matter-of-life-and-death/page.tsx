import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-ux-in-medtech-when-trust-is-a-matter-of-life-and-death-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-ux-in-medtech-when-trust-is-a-matter-of-life-and-death | Triolla",
  description: "Learn more about blog-ux-in-medtech-when-trust-is-a-matter-of-life-and-death at Triolla.",
  path: "/blog-ux-in-medtech-when-trust-is-a-matter-of-life-and-death",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="ux-in-medtech-when-trust-is-a-matter-of-life-and-death" deps={deps} />;
}
