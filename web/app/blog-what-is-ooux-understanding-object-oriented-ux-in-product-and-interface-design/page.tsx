import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-what-is-ooux-understanding-object-oriented-ux-in-product-and-interface-design-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-what-is-ooux-understanding-object-oriented-ux-in-product-and-interface-design | Triolla",
  description: "Learn more about blog-what-is-ooux-understanding-object-oriented-ux-in-product-and-interface-design at Triolla.",
  path: "/blog-what-is-ooux-understanding-object-oriented-ux-in-product-and-interface-design",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="what-is-ooux-understanding-object-oriented-ux-in-product-and-interface-design" deps={deps} />;
}
