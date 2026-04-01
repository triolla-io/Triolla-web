import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-can-design-be-too-user-friendly-exploring-the-limits-of-ux-ui-in-product-design-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-can-design-be-too-user-friendly-exploring-the-limits-of-ux-ui-in-product-design | Triolla",
  description: "Learn more about blog-can-design-be-too-user-friendly-exploring-the-limits-of-ux-ui-in-product-design at Triolla.",
  path: "/blog-can-design-be-too-user-friendly-exploring-the-limits-of-ux-ui-in-product-design",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="can-design-be-too-user-friendly-exploring-the-limits-of-ux-ui-in-product-design" deps={deps} />;
}
