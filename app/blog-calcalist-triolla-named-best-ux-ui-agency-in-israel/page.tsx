import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-calcalist-triolla-named-best-ux-ui-agency-in-israel-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-calcalist-triolla-named-best-ux-ui-agency-in-israel | Triolla",
  description: "Learn more about blog-calcalist-triolla-named-best-ux-ui-agency-in-israel at Triolla.",
  path: "/blog-calcalist-triolla-named-best-ux-ui-agency-in-israel",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="calcalist-triolla-named-best-ux-ui-agency-in-israel" deps={deps} />;
}
