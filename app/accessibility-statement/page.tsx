import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { AccessibilityStatementClient } from "./AccessibilityStatementClient";

const copy = LANG_REDIRECT_PAGE_COPY["/accessibility-statement"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/accessibility-statement",
  lang: "en",
  ogType: "website",
});

export default function AccessibilityStatementPage() {
  return <AccessibilityStatementClient />;
}
