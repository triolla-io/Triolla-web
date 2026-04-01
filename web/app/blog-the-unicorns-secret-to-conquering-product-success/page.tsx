import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-unicorns-secret-to-conquering-product-success-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-unicorns-secret-to-conquering-product-success | Triolla",
  description: "Learn more about blog-the-unicorns-secret-to-conquering-product-success at Triolla.",
  path: "/blog-the-unicorns-secret-to-conquering-product-success",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-unicorns-secret-to-conquering-product-success" deps={deps} />;
}
