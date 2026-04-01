import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-designing-an-engaging-and-effective-agritech-app-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-designing-an-engaging-and-effective-agritech-app | Triolla",
  description: "Learn more about blog-designing-an-engaging-and-effective-agritech-app at Triolla.",
  path: "/blog-designing-an-engaging-and-effective-agritech-app",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="designing-an-engaging-and-effective-agritech-app" deps={deps} />;
}
