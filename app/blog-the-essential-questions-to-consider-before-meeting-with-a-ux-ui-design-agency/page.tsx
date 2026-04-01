import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-essential-questions-to-consider-before-meeting-with-a-ux-ui-design-agency-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-essential-questions-to-consider-before-meeting-with-a-ux-ui-design-agency | Triolla",
  description: "Learn more about blog-the-essential-questions-to-consider-before-meeting-with-a-ux-ui-design-agency at Triolla.",
  path: "/blog-the-essential-questions-to-consider-before-meeting-with-a-ux-ui-design-agency",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-essential-questions-to-consider-before-meeting-with-a-ux-ui-design-agency" deps={deps} />;
}
