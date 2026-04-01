import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-why-is-a-ux-survey-a-crucial-step-in-product-definition-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-why-is-a-ux-survey-a-crucial-step-in-product-definition | Triolla",
  description: "Learn more about blog-why-is-a-ux-survey-a-crucial-step-in-product-definition at Triolla.",
  path: "/blog-why-is-a-ux-survey-a-crucial-step-in-product-definition",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="why-is-a-ux-survey-a-crucial-step-in-product-definition" deps={deps} />;
}
