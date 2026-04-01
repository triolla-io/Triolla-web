import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-how-user-experience-design-drives-startup-success-tips-for-building-winning-digital-products-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-how-user-experience-design-drives-startup-success-tips-for-building-winning-digital-products | Triolla",
  description: "Learn more about blog-how-user-experience-design-drives-startup-success-tips-for-building-winning-digital-products at Triolla.",
  path: "/blog-how-user-experience-design-drives-startup-success-tips-for-building-winning-digital-products",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="how-user-experience-design-drives-startup-success-tips-for-building-winning-digital-products" deps={deps} />;
}
