import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-user-experience-design-in-agritech-products-for-the-agriculture-industry-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-user-experience-design-in-agritech-products-for-the-agriculture-industry | Triolla",
  description: "Learn more about blog-user-experience-design-in-agritech-products-for-the-agriculture-industry at Triolla.",
  path: "/blog-user-experience-design-in-agritech-products-for-the-agriculture-industry",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="user-experience-design-in-agritech-products-for-the-agriculture-industry" deps={deps} />;
}
