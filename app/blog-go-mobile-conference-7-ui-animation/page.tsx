import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-go-mobile-conference-7-ui-animation-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-go-mobile-conference-7-ui-animation | Triolla",
  description: "Learn more about blog-go-mobile-conference-7-ui-animation at Triolla.",
  path: "/blog-go-mobile-conference-7-ui-animation",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="go-mobile-conference-7-ui-animation" deps={deps} />;
}
