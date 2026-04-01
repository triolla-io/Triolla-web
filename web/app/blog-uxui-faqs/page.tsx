import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-uxui-faqs-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-uxui-faqs | Triolla",
  description: "Learn more about blog-uxui-faqs at Triolla.",
  path: "/blog-uxui-faqs",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="uxui-faqs" deps={deps} />;
}
