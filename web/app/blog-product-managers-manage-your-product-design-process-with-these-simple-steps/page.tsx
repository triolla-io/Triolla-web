import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-product-managers-manage-your-product-design-process-with-these-simple-steps-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-product-managers-manage-your-product-design-process-with-these-simple-steps | Triolla",
  description: "Learn more about blog-product-managers-manage-your-product-design-process-with-these-simple-steps at Triolla.",
  path: "/blog-product-managers-manage-your-product-design-process-with-these-simple-steps",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="product-managers-manage-your-product-design-process-with-these-simple-steps" deps={deps} />;
}
