import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-level-up-your-gaming-app-with-triollas-expert-ux-tips-boost-user-engagement-and-retention-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-level-up-your-gaming-app-with-triollas-expert-ux-tips-boost-user-engagement-and-retention | Triolla",
  description: "Learn more about blog-level-up-your-gaming-app-with-triollas-expert-ux-tips-boost-user-engagement-and-retention at Triolla.",
  path: "/blog-level-up-your-gaming-app-with-triollas-expert-ux-tips-boost-user-engagement-and-retention",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="level-up-your-gaming-app-with-triollas-expert-ux-tips-boost-user-engagement-and-retention" deps={deps} />;
}
