import type { Metadata } from "next";
import { ServicesClient } from "@/app/services/ServicesClient";
import { LANG_REDIRECT_PAGE_COPY } from "@/app/lib/langRedirectPageCopy";

const copy = LANG_REDIRECT_PAGE_COPY["/services"];

export const metadata: Metadata = {
  title: copy.title.he,
  description: copy.description.he,
};

export default function HebrewServicesPage() {
  return <ServicesClient lang="he" />;
}
