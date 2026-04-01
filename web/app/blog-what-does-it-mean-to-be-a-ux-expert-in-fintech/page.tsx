import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-what-does-it-mean-to-be-a-ux-expert-in-fintech-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-what-does-it-mean-to-be-a-ux-expert-in-fintech | Triolla",
  description: "Learn more about blog-what-does-it-mean-to-be-a-ux-expert-in-fintech at Triolla.",
  path: "/blog-what-does-it-mean-to-be-a-ux-expert-in-fintech",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="what-does-it-mean-to-be-a-ux-expert-in-fintech" deps={deps} />;
}
