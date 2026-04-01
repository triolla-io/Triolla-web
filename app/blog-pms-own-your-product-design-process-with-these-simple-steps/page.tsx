import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-pms-own-your-product-design-process-with-these-simple-steps-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-pms-own-your-product-design-process-with-these-simple-steps | Triolla",
  description: "Learn more about blog-pms-own-your-product-design-process-with-these-simple-steps at Triolla.",
  path: "/blog-pms-own-your-product-design-process-with-these-simple-steps",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="pms-own-your-product-design-process-with-these-simple-steps" deps={deps} />;
}
