import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-globs-best-agency-in-israel-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-globs-best-agency-in-israel | Triolla",
  description: "Learn more about blog-globs-best-agency-in-israel at Triolla.",
  path: "/blog-globs-best-agency-in-israel",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="globs-best-agency-in-israel" deps={deps} />;
}
