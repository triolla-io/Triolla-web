import type { Metadata } from "next";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { BlogClient } from "./BlogClient";
import { generatePageMetadata } from "../lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog | Triolla UX/UI Design",
  description: "UX/UI design insights, trends, and case studies from the Triolla team.",
  path: "/blog",
  lang: "en",
  ogType: "website",
  image: "/og-image.png",
});

export default function BlogPage() {
  return (
    <>
      <Breadcrumbs
        ariaLabel="Breadcrumb"
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />
      <BlogClient />
    </>
  );
}
