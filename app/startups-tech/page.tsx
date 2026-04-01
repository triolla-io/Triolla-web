import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { StartupsTechClient } from "./StartupsTechClient";

const copy = LANG_REDIRECT_PAGE_COPY["/startups-tech"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/startups-tech",
  lang: "en",
  ogType: "website",
});

export default function StartupsTechPage() {
  return <StartupsTechClient />;
}
