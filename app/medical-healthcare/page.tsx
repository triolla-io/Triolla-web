import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { MedicalHealthcareClient } from "./MedicalHealthcareClient";

const copy = LANG_REDIRECT_PAGE_COPY["/medical-healthcare"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/medical-healthcare",
  lang: "en",
  ogType: "website",
});

export default function MedicalHealthcarePage() {
  return <MedicalHealthcareClient />;
}
