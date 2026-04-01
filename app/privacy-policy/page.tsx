import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { PrivacyPolicyClient } from "./PrivacyPolicyClient";

const copy = LANG_REDIRECT_PAGE_COPY["/privacy-policy"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/privacy-policy",
  lang: "en",
  ogType: "website",
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
