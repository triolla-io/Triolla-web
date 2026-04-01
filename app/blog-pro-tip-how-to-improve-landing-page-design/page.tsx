import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-pro-tip-how-to-improve-landing-page-design-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-pro-tip-how-to-improve-landing-page-design | Triolla",
  description: "Learn more about blog-pro-tip-how-to-improve-landing-page-design at Triolla.",
  path: "/blog-pro-tip-how-to-improve-landing-page-design",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="pro-tip-how-to-improve-landing-page-design" deps={deps} />;
}
