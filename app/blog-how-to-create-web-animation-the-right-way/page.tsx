import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-how-to-create-web-animation-the-right-way-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-how-to-create-web-animation-the-right-way | Triolla",
  description: "Learn more about blog-how-to-create-web-animation-the-right-way at Triolla.",
  path: "/blog-how-to-create-web-animation-the-right-way",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="how-to-create-web-animation-the-right-way" deps={deps} />;
}
