import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-user-experience-ux-design-is-the-design-of-life-itself-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-user-experience-ux-design-is-the-design-of-life-itself | Triolla",
  description: "Learn more about blog-user-experience-ux-design-is-the-design-of-life-itself at Triolla.",
  path: "/blog-user-experience-ux-design-is-the-design-of-life-itself",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="user-experience-ux-design-is-the-design-of-life-itself" deps={deps} />;
}
