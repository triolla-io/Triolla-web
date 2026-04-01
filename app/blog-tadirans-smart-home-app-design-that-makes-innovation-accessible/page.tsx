import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-tadirans-smart-home-app-design-that-makes-innovation-accessible-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-tadirans-smart-home-app-design-that-makes-innovation-accessible | Triolla",
  description: "Learn more about blog-tadirans-smart-home-app-design-that-makes-innovation-accessible at Triolla.",
  path: "/blog-tadirans-smart-home-app-design-that-makes-innovation-accessible",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="tadirans-smart-home-app-design-that-makes-innovation-accessible" deps={deps} />;
}
