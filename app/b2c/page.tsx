import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { B2cClient } from "./B2cClient";

const copy = LANG_REDIRECT_PAGE_COPY["/b2c"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/b2c",
  lang: "en",
  ogType: "website",
});

export default function B2cPage() {
  return <B2cClient />;
}
