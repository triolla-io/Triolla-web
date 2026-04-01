import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { DashboardDesignClient } from "./DashboardDesignClient";

const copy = LANG_REDIRECT_PAGE_COPY["/dashboard-design"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/dashboard-design",
  lang: "en",
  ogType: "website",
});

export default function DashboardDesignPage() {
  return <DashboardDesignClient />;
}
