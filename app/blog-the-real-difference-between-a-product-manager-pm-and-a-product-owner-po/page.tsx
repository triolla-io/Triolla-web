import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-real-difference-between-a-product-manager-pm-and-a-product-owner-po-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-real-difference-between-a-product-manager-pm-and-a-product-owner-po | Triolla",
  description: "Learn more about blog-the-real-difference-between-a-product-manager-pm-and-a-product-owner-po at Triolla.",
  path: "/blog-the-real-difference-between-a-product-manager-pm-and-a-product-owner-po",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-real-difference-between-a-product-manager-pm-and-a-product-owner-po" deps={deps} />;
}
