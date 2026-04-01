import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-ux-ui-design-the-real-way-to-motivate-your-users-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-ux-ui-design-the-real-way-to-motivate-your-users | Triolla",
  description: "Learn more about blog-ux-ui-design-the-real-way-to-motivate-your-users at Triolla.",
  path: "/blog-ux-ui-design-the-real-way-to-motivate-your-users",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="ux-ui-design-the-real-way-to-motivate-your-users" deps={deps} />;
}
