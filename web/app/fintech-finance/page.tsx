import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { FintechFinanceClient } from "./FintechFinanceClient";

const copy = LANG_REDIRECT_PAGE_COPY["/fintech-finance"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/fintech-finance",
  lang: "en",
  ogType: "website",
});

export default function FintechFinancePage() {
  return <FintechFinanceClient />;
}
