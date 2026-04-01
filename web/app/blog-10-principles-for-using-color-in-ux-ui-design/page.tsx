import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-10-principles-for-using-color-in-ux-ui-design-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-10-principles-for-using-color-in-ux-ui-design | Triolla",
  description: "Learn more about blog-10-principles-for-using-color-in-ux-ui-design at Triolla.",
  path: "/blog-10-principles-for-using-color-in-ux-ui-design",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="10-principles-for-using-color-in-ux-ui-design" deps={deps} />;
}
