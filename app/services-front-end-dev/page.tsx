import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesFrontEndDevClient } from "./ServicesFrontEndDevClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Front-End Development Services | Triolla",
  description: "Expert front-end development to bring your designs to life with modern technologies and best practices.",
  path: "/services-front-end-dev",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesFrontEndDevClient />;
}
