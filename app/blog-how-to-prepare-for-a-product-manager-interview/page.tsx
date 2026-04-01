import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-how-to-prepare-for-a-product-manager-interview-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-how-to-prepare-for-a-product-manager-interview | Triolla",
  description: "Learn more about blog-how-to-prepare-for-a-product-manager-interview at Triolla.",
  path: "/blog-how-to-prepare-for-a-product-manager-interview",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="how-to-prepare-for-a-product-manager-interview" deps={deps} />;
}
