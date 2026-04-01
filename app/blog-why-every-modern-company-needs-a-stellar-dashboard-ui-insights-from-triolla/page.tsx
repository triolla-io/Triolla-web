import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-why-every-modern-company-needs-a-stellar-dashboard-ui-insights-from-triolla-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-why-every-modern-company-needs-a-stellar-dashboard-ui-insights-from-triolla | Triolla",
  description: "Learn more about blog-why-every-modern-company-needs-a-stellar-dashboard-ui-insights-from-triolla at Triolla.",
  path: "/blog-why-every-modern-company-needs-a-stellar-dashboard-ui-insights-from-triolla",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="why-every-modern-company-needs-a-stellar-dashboard-ui-insights-from-triolla" deps={deps} />;
}
