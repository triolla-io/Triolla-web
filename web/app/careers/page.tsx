import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { CareersClient } from "./CareersClient";

const copy = LANG_REDIRECT_PAGE_COPY["/careers"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/careers",
  lang: "en",
  ogType: "website",
});

export default function CareersPage() {
  return <CareersClient />;
}
