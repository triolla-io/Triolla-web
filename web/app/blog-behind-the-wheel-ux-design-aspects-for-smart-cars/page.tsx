import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-behind-the-wheel-ux-design-aspects-for-smart-cars-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-behind-the-wheel-ux-design-aspects-for-smart-cars | Triolla",
  description: "Learn more about blog-behind-the-wheel-ux-design-aspects-for-smart-cars at Triolla.",
  path: "/blog-behind-the-wheel-ux-design-aspects-for-smart-cars",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="behind-the-wheel-ux-design-aspects-for-smart-cars" deps={deps} />;
}
