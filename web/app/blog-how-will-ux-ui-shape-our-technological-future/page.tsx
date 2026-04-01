import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-how-will-ux-ui-shape-our-technological-future-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-how-will-ux-ui-shape-our-technological-future | Triolla",
  description: "Learn more about blog-how-will-ux-ui-shape-our-technological-future at Triolla.",
  path: "/blog-how-will-ux-ui-shape-our-technological-future",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="how-will-ux-ui-shape-our-technological-future" deps={deps} />;
}
