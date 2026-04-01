import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-why-is-ux-ui-created-as-a-team-effort-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-why-is-ux-ui-created-as-a-team-effort | Triolla",
  description: "Learn more about blog-why-is-ux-ui-created-as-a-team-effort at Triolla.",
  path: "/blog-why-is-ux-ui-created-as-a-team-effort",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="why-is-ux-ui-created-as-a-team-effort" deps={deps} />;
}
