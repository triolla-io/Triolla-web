import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-ftue-first-time-user-experience-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-ftue-first-time-user-experience | Triolla",
  description: "Learn more about blog-ftue-first-time-user-experience at Triolla.",
  path: "/blog-ftue-first-time-user-experience",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="ftue-first-time-user-experience" deps={deps} />;
}
