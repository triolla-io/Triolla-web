import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-ux-fintech-expert-what-does-it-mean-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-ux-fintech-expert-what-does-it-mean | Triolla",
  description: "Learn more about blog-ux-fintech-expert-what-does-it-mean at Triolla.",
  path: "/blog-ux-fintech-expert-what-does-it-mean",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="ux-fintech-expert-what-does-it-mean" deps={deps} />;
}
