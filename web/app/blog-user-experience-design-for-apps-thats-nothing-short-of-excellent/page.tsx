import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-user-experience-design-for-apps-thats-nothing-short-of-excellent-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-user-experience-design-for-apps-thats-nothing-short-of-excellent | Triolla",
  description: "Learn more about blog-user-experience-design-for-apps-thats-nothing-short-of-excellent at Triolla.",
  path: "/blog-user-experience-design-for-apps-thats-nothing-short-of-excellent",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="user-experience-design-for-apps-thats-nothing-short-of-excellent" deps={deps} />;
}
