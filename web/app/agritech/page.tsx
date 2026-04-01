import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { AgritechClient } from "./AgritechClient";

const copy = LANG_REDIRECT_PAGE_COPY["/agritech"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/agritech",
  lang: "en",
  ogType: "website",
});

export default function AgritechPage() {
  return <AgritechClient />;
}
