import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-enhancing-customer-satisfaction-through-positive-user-experience-and-user-delight-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-enhancing-customer-satisfaction-through-positive-user-experience-and-user-delight | Triolla",
  description: "Learn more about blog-enhancing-customer-satisfaction-through-positive-user-experience-and-user-delight at Triolla.",
  path: "/blog-enhancing-customer-satisfaction-through-positive-user-experience-and-user-delight",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="enhancing-customer-satisfaction-through-positive-user-experience-and-user-delight" deps={deps} />;
}
