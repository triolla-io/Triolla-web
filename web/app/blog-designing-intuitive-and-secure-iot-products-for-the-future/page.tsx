import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-designing-intuitive-and-secure-iot-products-for-the-future-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-designing-intuitive-and-secure-iot-products-for-the-future | Triolla",
  description: "Learn more about blog-designing-intuitive-and-secure-iot-products-for-the-future at Triolla.",
  path: "/blog-designing-intuitive-and-secure-iot-products-for-the-future",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="designing-intuitive-and-secure-iot-products-for-the-future" deps={deps} />;
}
