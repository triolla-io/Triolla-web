import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-5-examples-of-web-animation-done-right-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-5-examples-of-web-animation-done-right | Triolla",
  description: "Learn more about blog-5-examples-of-web-animation-done-right at Triolla.",
  path: "/blog-5-examples-of-web-animation-done-right",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="5-examples-of-web-animation-done-right" deps={deps} />;
}
