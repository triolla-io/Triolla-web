import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-wisdom-hub-invite-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-wisdom-hub-invite | Triolla",
  description: "Learn more about blog-wisdom-hub-invite at Triolla.",
  path: "/blog-wisdom-hub-invite",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="wisdom-hub-invite" deps={deps} />;
}
