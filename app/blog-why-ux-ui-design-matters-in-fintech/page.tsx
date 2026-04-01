import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-why-ux-ui-design-matters-in-fintech-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-why-ux-ui-design-matters-in-fintech | Triolla",
  description: "Learn more about blog-why-ux-ui-design-matters-in-fintech at Triolla.",
  path: "/blog-why-ux-ui-design-matters-in-fintech",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="why-ux-ui-design-matters-in-fintech" deps={deps} />;
}
