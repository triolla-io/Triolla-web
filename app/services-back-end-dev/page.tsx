import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesBackEndDevClient } from "./ServicesBackEndDevClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Back-End Development Services | Triolla",
  description: "Expert back-end development services to build scalable, robust APIs and server-side solutions for your products.",
  path: "/services-back-end-dev",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesBackEndDevClient />;
}
