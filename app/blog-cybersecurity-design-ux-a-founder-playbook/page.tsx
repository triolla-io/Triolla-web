import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-cybersecurity-design-ux-a-founder-playbook-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-cybersecurity-design-ux-a-founder-playbook | Triolla",
  description: "Learn more about blog-cybersecurity-design-ux-a-founder-playbook at Triolla.",
  path: "/blog-cybersecurity-design-ux-a-founder-playbook",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="cybersecurity-design-ux-a-founder-playbook" deps={deps} />;
}
