import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-six-things-you-need-to-check-before-hiring-a-ux-ui-agency-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-six-things-you-need-to-check-before-hiring-a-ux-ui-agency | Triolla",
  description: "Learn more about blog-six-things-you-need-to-check-before-hiring-a-ux-ui-agency at Triolla.",
  path: "/blog-six-things-you-need-to-check-before-hiring-a-ux-ui-agency",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="six-things-you-need-to-check-before-hiring-a-ux-ui-agency" deps={deps} />;
}
