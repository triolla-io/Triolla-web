import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-nine-examples-of-mobile-ux-innovation-in-2019-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-nine-examples-of-mobile-ux-innovation-in-2019 | Triolla",
  description: "Learn more about blog-nine-examples-of-mobile-ux-innovation-in-2019 at Triolla.",
  path: "/blog-nine-examples-of-mobile-ux-innovation-in-2019",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="nine-examples-of-mobile-ux-innovation-in-2019" deps={deps} />;
}
