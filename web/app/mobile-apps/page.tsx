import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { MobileAppsClient } from "./MobileAppsClient";

const copy = LANG_REDIRECT_PAGE_COPY["/mobile-apps"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/mobile-apps",
  lang: "en",
  ogType: "website",
});

export default function MobileAppsPage() {
  return <MobileAppsClient />;
}
