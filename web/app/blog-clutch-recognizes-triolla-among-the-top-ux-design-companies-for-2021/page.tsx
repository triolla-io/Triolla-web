import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-clutch-recognizes-triolla-among-the-top-ux-design-companies-for-2021-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-clutch-recognizes-triolla-among-the-top-ux-design-companies-for-2021 | Triolla",
  description: "Learn more about blog-clutch-recognizes-triolla-among-the-top-ux-design-companies-for-2021 at Triolla.",
  path: "/blog-clutch-recognizes-triolla-among-the-top-ux-design-companies-for-2021",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="clutch-recognizes-triolla-among-the-top-ux-design-companies-for-2021" deps={deps} />;
}
