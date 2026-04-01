import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-user-journey-how-to-do-it-right-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-user-journey-how-to-do-it-right | Triolla",
  description: "Learn more about blog-user-journey-how-to-do-it-right at Triolla.",
  path: "/blog-user-journey-how-to-do-it-right",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="user-journey-how-to-do-it-right" deps={deps} />;
}
