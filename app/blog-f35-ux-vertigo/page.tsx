import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-f35-ux-vertigo-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-f35-ux-vertigo | Triolla",
  description: "Learn more about blog-f35-ux-vertigo at Triolla.",
  path: "/blog-f35-ux-vertigo",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="f35-ux-vertigo" deps={deps} />;
}
