import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-triollas-mobile-app-ux-mastery-will-make-your-app-a-sensation-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-triollas-mobile-app-ux-mastery-will-make-your-app-a-sensation | Triolla",
  description: "Learn more about blog-triollas-mobile-app-ux-mastery-will-make-your-app-a-sensation at Triolla.",
  path: "/blog-triollas-mobile-app-ux-mastery-will-make-your-app-a-sensation",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="triollas-mobile-app-ux-mastery-will-make-your-app-a-sensation" deps={deps} />;
}
