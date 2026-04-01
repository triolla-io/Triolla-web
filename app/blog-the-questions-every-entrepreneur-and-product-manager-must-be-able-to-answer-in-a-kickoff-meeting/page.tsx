import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-questions-every-entrepreneur-and-product-manager-must-be-able-to-answer-in-a-kickoff-meeting-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-questions-every-entrepreneur-and-product-manager-must-be-able-to-answer-in-a-kickoff-meeting | Triolla",
  description: "Learn more about blog-the-questions-every-entrepreneur-and-product-manager-must-be-able-to-answer-in-a-kickoff-meeting at Triolla.",
  path: "/blog-the-questions-every-entrepreneur-and-product-manager-must-be-able-to-answer-in-a-kickoff-meeting",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-questions-every-entrepreneur-and-product-manager-must-be-able-to-answer-in-a-kickoff-meeting" deps={deps} />;
}
