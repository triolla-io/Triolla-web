import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-beyond-graphics-deep-user-experience-design-for-tomorrows-gaming-apps-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-beyond-graphics-deep-user-experience-design-for-tomorrows-gaming-apps | Triolla",
  description: "Learn more about blog-beyond-graphics-deep-user-experience-design-for-tomorrows-gaming-apps at Triolla.",
  path: "/blog-beyond-graphics-deep-user-experience-design-for-tomorrows-gaming-apps",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="beyond-graphics-deep-user-experience-design-for-tomorrows-gaming-apps" deps={deps} />;
}
