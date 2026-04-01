import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { loadPageMetadata } from "../lib/metadataLoader";
import { TechnologyClient } from "./TechnologyClient";

const pageMetadata = loadPageMetadata("technology", "en");

export const metadata: Metadata = generatePageMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  path: "/technology",
  lang: "en",
  ogType: pageMetadata.og_type,
  image: pageMetadata.og_image,
});

export default function TechnologyPage() {
  return <TechnologyClient />;
}
