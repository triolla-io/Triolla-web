import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-classical-conditioning-and-user-experience-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-classical-conditioning-and-user-experience | Triolla",
  description: "Learn more about blog-classical-conditioning-and-user-experience at Triolla.",
  path: "/blog-classical-conditioning-and-user-experience",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="classical-conditioning-and-user-experience" deps={deps} />;
}
