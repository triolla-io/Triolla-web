import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-ultimate-product-design-process-the-proven-method-used-by-google-facebook-netflix-and-more-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-ultimate-product-design-process-the-proven-method-used-by-google-facebook-netflix-and-more | Triolla",
  description: "Learn more about blog-the-ultimate-product-design-process-the-proven-method-used-by-google-facebook-netflix-and-more at Triolla.",
  path: "/blog-the-ultimate-product-design-process-the-proven-method-used-by-google-facebook-netflix-and-more",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-ultimate-product-design-process-the-proven-method-used-by-google-facebook-netflix-and-more" deps={deps} />;
}
