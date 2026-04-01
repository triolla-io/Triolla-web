import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesDesignSystemCreationClient } from "./ServicesDesignSystemCreationClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Design System Creation | Triolla",
  description: "Build scalable design systems for consistent and efficient product development across teams.",
  path: "/services-design-system-creation",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesDesignSystemCreationClient />;
}
