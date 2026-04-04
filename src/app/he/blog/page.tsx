import type { Metadata } from "next";
import { HeBlogClient } from "@/app/he/blog/HeBlogClient";
import { generatePageMetadata } from "@/app/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "בלוג | Triolla UX/UI Design",
  description: "תובנות, טרנדים ומקרי בוחן בעיצוב UX/UI מצוות Triolla.",
  path: "/he/blog",
  lang: "he",
  ogType: "website",
  image: "/og-image.png",
});

export default function HebrewBlogPage() {
  return <HeBlogClient />;
}
