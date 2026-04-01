import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-in-house-designers-or-a-ux-ui-agency-everything-you-need-to-know-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-in-house-designers-or-a-ux-ui-agency-everything-you-need-to-know | Triolla",
  description: "Learn more about blog-in-house-designers-or-a-ux-ui-agency-everything-you-need-to-know at Triolla.",
  path: "/blog-in-house-designers-or-a-ux-ui-agency-everything-you-need-to-know",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="in-house-designers-or-a-ux-ui-agency-everything-you-need-to-know" deps={deps} />;
}
