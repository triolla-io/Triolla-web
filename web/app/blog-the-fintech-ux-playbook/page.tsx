import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-fintech-ux-playbook-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-fintech-ux-playbook | Triolla",
  description: "Learn more about blog-the-fintech-ux-playbook at Triolla.",
  path: "/blog-the-fintech-ux-playbook",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-fintech-ux-playbook" deps={deps} />;
}
