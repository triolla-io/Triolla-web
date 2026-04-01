import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { ServicesClient } from "./ServicesClient";

const copy = LANG_REDIRECT_PAGE_COPY["/services"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/services",
  lang: "en",
  ogType: "website",
});

export default function ServicesPage() {
  return <ServicesClient />;
}
