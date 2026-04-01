import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { ServiceDetailClient } from "./ServiceDetailClient";

const copy = LANG_REDIRECT_PAGE_COPY["/service-detail"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/service-detail",
  lang: "en",
  ogType: "website",
});

export default function ServiceDetailPage() {
  return <ServiceDetailClient />;
}
