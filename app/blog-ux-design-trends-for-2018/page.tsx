import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-ux-design-trends-for-2018-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-ux-design-trends-for-2018 | Triolla",
  description: "Learn more about blog-ux-design-trends-for-2018 at Triolla.",
  path: "/blog-ux-design-trends-for-2018",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="ux-design-trends-for-2018" deps={deps} />;
}
