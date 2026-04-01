import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogPostClient } from "./BlogPostClient";
import deps from "./blog-custom-ux-ui-design-for-power-bi-tableau-qlik-sap-oracle-bi-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "blog-custom-ux-ui-design-for-power-bi-tableau-qlik-sap-oracle-bi | Triolla",
  description: "Learn more about blog-custom-ux-ui-design-for-power-bi-tableau-qlik-sap-oracle-bi at Triolla.",
  path: "/blog-custom-ux-ui-design-for-power-bi-tableau-qlik-sap-oracle-bi",
  lang: "en",
  ogType: "website",
});

export default function BlogPostPage() {
  return <BlogPostClient slug="custom-ux-ui-design-for-power-bi-tableau-qlik-sap-oracle-bi" deps={deps} />;
}
