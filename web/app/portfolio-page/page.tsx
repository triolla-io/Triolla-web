import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { PortfolioPageClient } from "./PortfolioPageClient";

const copy = LANG_REDIRECT_PAGE_COPY["/portfolio-page"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/portfolio-page",
  lang: "en",
  ogType: "website",
});

export default function PortfolioPageRoute() {
  return <PortfolioPageClient />;
}
