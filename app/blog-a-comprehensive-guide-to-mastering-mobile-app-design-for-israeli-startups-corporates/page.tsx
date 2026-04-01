import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-a-comprehensive-guide-to-mastering-mobile-app-design-for-israeli-startups-corporates-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-a-comprehensive-guide-to-mastering-mobile-app-design-for-israeli-startups-corporates | Triolla",
  description: "Learn more about blog-a-comprehensive-guide-to-mastering-mobile-app-design-for-israeli-startups-corporates at Triolla.",
  path: "/blog-a-comprehensive-guide-to-mastering-mobile-app-design-for-israeli-startups-corporates",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="a-comprehensive-guide-to-mastering-mobile-app-design-for-israeli-startups-corporates" deps={deps} />;
}
