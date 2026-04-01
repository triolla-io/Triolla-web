import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-the-3-most-common-pain-points-when-hiring-ui-ux-agency-for-a-saas-product-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-the-3-most-common-pain-points-when-hiring-ui-ux-agency-for-a-saas-product | Triolla",
  description: "Learn more about blog-the-3-most-common-pain-points-when-hiring-ui-ux-agency-for-a-saas-product at Triolla.",
  path: "/blog-the-3-most-common-pain-points-when-hiring-ui-ux-agency-for-a-saas-product",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="the-3-most-common-pain-points-when-hiring-ui-ux-agency-for-a-saas-product" deps={deps} />;
}
