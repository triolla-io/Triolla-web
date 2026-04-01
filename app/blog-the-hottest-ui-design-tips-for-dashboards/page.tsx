import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-hottest-ui-design-tips-for-dashboards-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-hottest-ui-design-tips-for-dashboards | Triolla",
  description: "Learn more about blog-the-hottest-ui-design-tips-for-dashboards at Triolla.",
  path: "/blog-the-hottest-ui-design-tips-for-dashboards",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-hottest-ui-design-tips-for-dashboards" deps={deps} />;
}
