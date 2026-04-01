import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { SaasPlatformsClient } from "./SaasPlatformsClient";

const copy = LANG_REDIRECT_PAGE_COPY["/saas-platforms"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/saas-platforms",
  lang: "en",
  ogType: "website",
});

export default function SaasPlatformsPage() {
  return <SaasPlatformsClient />;
}
