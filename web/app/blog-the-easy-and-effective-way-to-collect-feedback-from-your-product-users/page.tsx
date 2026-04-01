import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-easy-and-effective-way-to-collect-feedback-from-your-product-users-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-easy-and-effective-way-to-collect-feedback-from-your-product-users | Triolla",
  description: "Learn more about blog-the-easy-and-effective-way-to-collect-feedback-from-your-product-users at Triolla.",
  path: "/blog-the-easy-and-effective-way-to-collect-feedback-from-your-product-users",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-easy-and-effective-way-to-collect-feedback-from-your-product-users" deps={deps} />;
}
