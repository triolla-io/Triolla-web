import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { CyberSecurityClient } from "./CyberSecurityClient";

const copy = LANG_REDIRECT_PAGE_COPY["/cyber-security"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/cyber-security",
  lang: "en",
  ogType: "website",
});

export default function CyberSecurityPage() {
  return <CyberSecurityClient />;
}
