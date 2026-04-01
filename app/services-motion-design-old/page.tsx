import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesMotionDesignOldClient } from "./ServicesMotionDesignOldClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Motion Design (Legacy) | Triolla",
  description: "Professional motion design services for video, web, and interactive applications.",
  path: "/services-motion-design-old",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesMotionDesignOldClient />;
}
