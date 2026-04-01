import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-product-user-fit-comes-before-product-market-fit-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-product-user-fit-comes-before-product-market-fit | Triolla",
  description: "Learn more about blog-product-user-fit-comes-before-product-market-fit at Triolla.",
  path: "/blog-product-user-fit-comes-before-product-market-fit",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="product-user-fit-comes-before-product-market-fit" deps={deps} />;
}
