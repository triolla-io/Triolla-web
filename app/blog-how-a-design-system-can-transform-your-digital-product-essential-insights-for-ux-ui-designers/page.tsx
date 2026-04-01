import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-how-a-design-system-can-transform-your-digital-product-essential-insights-for-ux-ui-designers-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-how-a-design-system-can-transform-your-digital-product-essential-insights-for-ux-ui-designers | Triolla",
  description: "Learn more about blog-how-a-design-system-can-transform-your-digital-product-essential-insights-for-ux-ui-designers at Triolla.",
  path: "/blog-how-a-design-system-can-transform-your-digital-product-essential-insights-for-ux-ui-designers",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="how-a-design-system-can-transform-your-digital-product-essential-insights-for-ux-ui-designers" deps={deps} />;
}
