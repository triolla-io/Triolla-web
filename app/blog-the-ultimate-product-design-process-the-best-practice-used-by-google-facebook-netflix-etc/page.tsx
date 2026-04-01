import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-ultimate-product-design-process-the-best-practice-used-by-google-facebook-netflix-etc-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-ultimate-product-design-process-the-best-practice-used-by-google-facebook-netflix-etc | Triolla",
  description: "Learn more about blog-the-ultimate-product-design-process-the-best-practice-used-by-google-facebook-netflix-etc at Triolla.",
  path: "/blog-the-ultimate-product-design-process-the-best-practice-used-by-google-facebook-netflix-etc",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-ultimate-product-design-process-the-best-practice-used-by-google-facebook-netflix-etc" deps={deps} />;
}
