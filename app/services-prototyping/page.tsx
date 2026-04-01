import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesPrototypingClient } from "./ServicesPrototypingClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Prototyping Services | Triolla",
  description: "Interactive prototypes to validate design concepts before development and get stakeholder buy-in.",
  path: "/services-prototyping",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesPrototypingClient />;
}
