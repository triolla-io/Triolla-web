import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-how-to-use-animation-to-improve-ux-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-how-to-use-animation-to-improve-ux | Triolla",
  description: "Learn more about blog-how-to-use-animation-to-improve-ux at Triolla.",
  path: "/blog-how-to-use-animation-to-improve-ux",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="how-to-use-animation-to-improve-ux" deps={deps} />;
}
