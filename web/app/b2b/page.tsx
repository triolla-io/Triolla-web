import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { B2bClient } from "./B2bClient";

const copy = LANG_REDIRECT_PAGE_COPY["/b2b"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/b2b",
  lang: "en",
  ogType: "website",
});

export default function B2bPage() {
  return <B2bClient />;
}
