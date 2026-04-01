import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { TermsOfUseClient } from "./TermsOfUseClient";

const copy = LANG_REDIRECT_PAGE_COPY["/terms-of-use"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/terms-of-use",
  lang: "en",
  ogType: "website",
});

export default function TermsOfUsePage() {
  return <TermsOfUseClient />;
}
