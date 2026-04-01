import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-unleash-the-power-of-your-mvp-to-accelerate-your-growth-ux-design-for-startups-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-unleash-the-power-of-your-mvp-to-accelerate-your-growth-ux-design-for-startups | Triolla",
  description: "Learn more about blog-unleash-the-power-of-your-mvp-to-accelerate-your-growth-ux-design-for-startups at Triolla.",
  path: "/blog-unleash-the-power-of-your-mvp-to-accelerate-your-growth-ux-design-for-startups",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="unleash-the-power-of-your-mvp-to-accelerate-your-growth-ux-design-for-startups" deps={deps} />;
}
