import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";
import { HeBlogClient } from "./HeBlogClient";

export const metadata: Metadata = generatePageMetadata({
  title: "בלוג | Triolla UX/UI Design",
  description: "תובנות, טרנדים ומקרי בוחן בעיצוב UX/UI מצוות Triolla.",
  path: "/he/blog",
  lang: "he",
  ogType: "website",
  image: "/og-image.png",
});

export default function HeBlogPage() {
  return <HeBlogClient />;
}
