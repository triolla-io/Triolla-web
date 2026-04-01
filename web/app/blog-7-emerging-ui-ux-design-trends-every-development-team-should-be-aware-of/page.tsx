import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-7-emerging-ui-ux-design-trends-every-development-team-should-be-aware-of-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-7-emerging-ui-ux-design-trends-every-development-team-should-be-aware-of | Triolla",
  description: "Learn more about blog-7-emerging-ui-ux-design-trends-every-development-team-should-be-aware-of at Triolla.",
  path: "/blog-7-emerging-ui-ux-design-trends-every-development-team-should-be-aware-of",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="7-emerging-ui-ux-design-trends-every-development-team-should-be-aware-of" deps={deps} />;
}
