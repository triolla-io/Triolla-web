import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesUiDesignClient } from "./ServicesUiDesignClient";

export const metadata: Metadata = generatePageMetadata({
  title: "UI Design Services | Triolla",
  description: "Beautiful and functional user interface design that users love and engage with.",
  path: "/services-ui-design",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesUiDesignClient />;
}
