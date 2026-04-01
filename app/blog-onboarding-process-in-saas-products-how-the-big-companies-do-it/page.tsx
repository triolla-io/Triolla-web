import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-onboarding-process-in-saas-products-how-the-big-companies-do-it-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-onboarding-process-in-saas-products-how-the-big-companies-do-it | Triolla",
  description: "Learn more about blog-onboarding-process-in-saas-products-how-the-big-companies-do-it at Triolla.",
  path: "/blog-onboarding-process-in-saas-products-how-the-big-companies-do-it",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="onboarding-process-in-saas-products-how-the-big-companies-do-it" deps={deps} />;
}
