import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-if-ux-is-life-itself-it-must-be-designed-for-people-everywhere-and-always-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-if-ux-is-life-itself-it-must-be-designed-for-people-everywhere-and-always | Triolla",
  description: "Learn more about blog-if-ux-is-life-itself-it-must-be-designed-for-people-everywhere-and-always at Triolla.",
  path: "/blog-if-ux-is-life-itself-it-must-be-designed-for-people-everywhere-and-always",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="if-ux-is-life-itself-it-must-be-designed-for-people-everywhere-and-always" deps={deps} />;
}
