import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { LANG_REDIRECT_PAGE_COPY } from "../lib/langRedirectPageCopy";
import { DeviceIotClient } from "./DeviceIotClient";

const copy = LANG_REDIRECT_PAGE_COPY["/device-iot"];

export const metadata: Metadata = generatePageMetadata({
  title: copy.title.en,
  description: copy.description.en,
  path: "/device-iot",
  lang: "en",
  ogType: "website",
});

export default function DeviceIotPage() {
  return <DeviceIotClient />;
}
