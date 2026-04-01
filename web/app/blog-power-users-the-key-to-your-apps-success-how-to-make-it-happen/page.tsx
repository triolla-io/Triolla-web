import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-power-users-the-key-to-your-apps-success-how-to-make-it-happen-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-power-users-the-key-to-your-apps-success-how-to-make-it-happen | Triolla",
  description: "Learn more about blog-power-users-the-key-to-your-apps-success-how-to-make-it-happen at Triolla.",
  path: "/blog-power-users-the-key-to-your-apps-success-how-to-make-it-happen",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="power-users-the-key-to-your-apps-success-how-to-make-it-happen" deps={deps} />;
}
