import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-how-the-industrys-leading-ux-ui-agency-can-also-be-a-boutique-ux-studio-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-how-the-industrys-leading-ux-ui-agency-can-also-be-a-boutique-ux-studio | Triolla",
  description: "Learn more about blog-how-the-industrys-leading-ux-ui-agency-can-also-be-a-boutique-ux-studio at Triolla.",
  path: "/blog-how-the-industrys-leading-ux-ui-agency-can-also-be-a-boutique-ux-studio",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="how-the-industrys-leading-ux-ui-agency-can-also-be-a-boutique-ux-studio" deps={deps} />;
}
