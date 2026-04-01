import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesMotionDesignClient } from "./ServicesMotionDesignClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Motion Design & Animation Services | Triolla",
  description: "Engaging motion design and animations to enhance user experience and capture attention.",
  path: "/services-motion-design",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesMotionDesignClient />;
}
