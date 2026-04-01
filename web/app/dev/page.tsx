import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { DevClient } from "./DevClient";

const copy = LANG_REDIRECT_PAGE_COPY["/dev"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/dev",
  lang: "en",
  ogType: "website",
});

export default function DevPage() {
  return <DevClient />;
}
