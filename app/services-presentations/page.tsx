import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesPresentationsClient } from "./ServicesPresentationsClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Presentation Design Services | Triolla",
  description: "Stunning presentation design that communicates your ideas clearly and professionally.",
  path: "/services-presentations",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesPresentationsClient />;
}
