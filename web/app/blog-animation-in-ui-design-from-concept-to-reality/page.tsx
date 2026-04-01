import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-animation-in-ui-design-from-concept-to-reality-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-animation-in-ui-design-from-concept-to-reality | Triolla",
  description: "Learn more about blog-animation-in-ui-design-from-concept-to-reality at Triolla.",
  path: "/blog-animation-in-ui-design-from-concept-to-reality",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="animation-in-ui-design-from-concept-to-reality" deps={deps} />;
}
