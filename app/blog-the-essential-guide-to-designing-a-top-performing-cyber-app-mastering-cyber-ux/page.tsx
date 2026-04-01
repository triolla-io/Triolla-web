import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-essential-guide-to-designing-a-top-performing-cyber-app-mastering-cyber-ux-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-essential-guide-to-designing-a-top-performing-cyber-app-mastering-cyber-ux | Triolla",
  description: "Learn more about blog-the-essential-guide-to-designing-a-top-performing-cyber-app-mastering-cyber-ux at Triolla.",
  path: "/blog-the-essential-guide-to-designing-a-top-performing-cyber-app-mastering-cyber-ux",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-essential-guide-to-designing-a-top-performing-cyber-app-mastering-cyber-ux" deps={deps} />;
}
