import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-everything-you-need-to-know-about-wireframes-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-everything-you-need-to-know-about-wireframes | Triolla",
  description: "Learn more about blog-everything-you-need-to-know-about-wireframes at Triolla.",
  path: "/blog-everything-you-need-to-know-about-wireframes",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="everything-you-need-to-know-about-wireframes" deps={deps} />;
}
