import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-triolla-an-industry-leader-is-actually-a-boutique-ux-studio-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-triolla-an-industry-leader-is-actually-a-boutique-ux-studio | Triolla",
  description: "Learn more about blog-triolla-an-industry-leader-is-actually-a-boutique-ux-studio at Triolla.",
  path: "/blog-triolla-an-industry-leader-is-actually-a-boutique-ux-studio",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="triolla-an-industry-leader-is-actually-a-boutique-ux-studio" deps={deps} />;
}
