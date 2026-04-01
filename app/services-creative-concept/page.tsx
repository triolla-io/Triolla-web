import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesCreativeConceptClient } from "./ServicesCreativeConceptClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Creative Concept Development | Triolla",
  description: "Innovative creative concept development to bring your ideas to life with strategic and artistic direction.",
  path: "/services-creative-concept",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesCreativeConceptClient />;
}
