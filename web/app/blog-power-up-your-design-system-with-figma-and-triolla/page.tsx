import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-power-up-your-design-system-with-figma-and-triolla-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-power-up-your-design-system-with-figma-and-triolla | Triolla",
  description: "Learn more about blog-power-up-your-design-system-with-figma-and-triolla at Triolla.",
  path: "/blog-power-up-your-design-system-with-figma-and-triolla",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="power-up-your-design-system-with-figma-and-triolla" deps={deps} />;
}
