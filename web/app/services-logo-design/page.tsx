import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesLogoDesignClient } from "./ServicesLogoDesignClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Logo Design Services | Triolla",
  description: "Custom logo design that captures your brand identity and makes you stand out from competitors.",
  path: "/services-logo-design",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesLogoDesignClient />;
}
