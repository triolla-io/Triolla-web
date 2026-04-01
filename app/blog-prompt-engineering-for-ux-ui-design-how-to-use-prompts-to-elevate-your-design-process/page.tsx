import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-prompt-engineering-for-ux-ui-design-how-to-use-prompts-to-elevate-your-design-process-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-prompt-engineering-for-ux-ui-design-how-to-use-prompts-to-elevate-your-design-process | Triolla",
  description: "Learn more about blog-prompt-engineering-for-ux-ui-design-how-to-use-prompts-to-elevate-your-design-process at Triolla.",
  path: "/blog-prompt-engineering-for-ux-ui-design-how-to-use-prompts-to-elevate-your-design-process",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="prompt-engineering-for-ux-ui-design-how-to-use-prompts-to-elevate-your-design-process" deps={deps} />;
}
