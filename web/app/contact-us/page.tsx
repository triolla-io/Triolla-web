import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { ContactUsClient } from "./ContactUsClient";

const copy = LANG_REDIRECT_PAGE_COPY["/contact-us"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/contact-us",
  lang: "en",
  ogType: "website",
});

export default function ContactUsPage() {
  return <ContactUsClient />;
}
