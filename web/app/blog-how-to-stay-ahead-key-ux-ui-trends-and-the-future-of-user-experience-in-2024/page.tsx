import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-how-to-stay-ahead-key-ux-ui-trends-and-the-future-of-user-experience-in-2024-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-how-to-stay-ahead-key-ux-ui-trends-and-the-future-of-user-experience-in-2024 | Triolla",
  description: "Learn more about blog-how-to-stay-ahead-key-ux-ui-trends-and-the-future-of-user-experience-in-2024 at Triolla.",
  path: "/blog-how-to-stay-ahead-key-ux-ui-trends-and-the-future-of-user-experience-in-2024",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="how-to-stay-ahead-key-ux-ui-trends-and-the-future-of-user-experience-in-2024" deps={deps} />;
}
