import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { BrandingStudioClient } from "./BrandingStudioClient";

const copy = LANG_REDIRECT_PAGE_COPY["/branding-studio"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/branding-studio",
  lang: "en",
  ogType: "website",
});

export default function BrandingStudioPage() {
  return <BrandingStudioClient />;
}
