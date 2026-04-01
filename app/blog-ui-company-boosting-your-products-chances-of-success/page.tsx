import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-ui-company-boosting-your-products-chances-of-success-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-ui-company-boosting-your-products-chances-of-success | Triolla",
  description: "Learn more about blog-ui-company-boosting-your-products-chances-of-success at Triolla.",
  path: "/blog-ui-company-boosting-your-products-chances-of-success",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="ui-company-boosting-your-products-chances-of-success" deps={deps} />;
}
