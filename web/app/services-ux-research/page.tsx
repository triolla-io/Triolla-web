import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesUxResearchClient } from "./ServicesUxResearchClient";

export const metadata: Metadata = generatePageMetadata({
  title: "UX Research Services | Triolla",
  description: "In-depth user research to inform better product design decisions and understand user needs.",
  path: "/services-ux-research",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesUxResearchClient />;
}
