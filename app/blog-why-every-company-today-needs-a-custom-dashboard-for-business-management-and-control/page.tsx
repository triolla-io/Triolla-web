import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-why-every-company-today-needs-a-custom-dashboard-for-business-management-and-control-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-why-every-company-today-needs-a-custom-dashboard-for-business-management-and-control | Triolla",
  description: "Learn more about blog-why-every-company-today-needs-a-custom-dashboard-for-business-management-and-control at Triolla.",
  path: "/blog-why-every-company-today-needs-a-custom-dashboard-for-business-management-and-control",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="why-every-company-today-needs-a-custom-dashboard-for-business-management-and-control" deps={deps} />;
}
