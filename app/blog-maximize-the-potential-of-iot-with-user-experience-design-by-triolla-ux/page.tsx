import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-maximize-the-potential-of-iot-with-user-experience-design-by-triolla-ux-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-maximize-the-potential-of-iot-with-user-experience-design-by-triolla-ux | Triolla",
  description: "Learn more about blog-maximize-the-potential-of-iot-with-user-experience-design-by-triolla-ux at Triolla.",
  path: "/blog-maximize-the-potential-of-iot-with-user-experience-design-by-triolla-ux",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="maximize-the-potential-of-iot-with-user-experience-design-by-triolla-ux" deps={deps} />;
}
