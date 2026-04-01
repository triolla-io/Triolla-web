import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-saas-product-tour-trends-how-great-companies-onboard-users-in-2018-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-saas-product-tour-trends-how-great-companies-onboard-users-in-2018 | Triolla",
  description: "Learn more about blog-saas-product-tour-trends-how-great-companies-onboard-users-in-2018 at Triolla.",
  path: "/blog-saas-product-tour-trends-how-great-companies-onboard-users-in-2018",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="saas-product-tour-trends-how-great-companies-onboard-users-in-2018" deps={deps} />;
}
