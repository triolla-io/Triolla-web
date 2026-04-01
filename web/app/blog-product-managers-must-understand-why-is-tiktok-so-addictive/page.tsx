import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-product-managers-must-understand-why-is-tiktok-so-addictive-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-product-managers-must-understand-why-is-tiktok-so-addictive | Triolla",
  description: "Learn more about blog-product-managers-must-understand-why-is-tiktok-so-addictive at Triolla.",
  path: "/blog-product-managers-must-understand-why-is-tiktok-so-addictive",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="product-managers-must-understand-why-is-tiktok-so-addictive" deps={deps} />;
}
