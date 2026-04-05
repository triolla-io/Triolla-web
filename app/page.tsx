import type { Metadata } from "next";
import { generatePageMetadata } from "./lib/metadata";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Triolla - Web Design & App Development",
  description:
    "Product UX/UI design studio in Israel: we craft digital experiences, design systems, and interfaces for technology brands, startups, and enterprise teams.",
  path: "/",
  lang: "en",
  ogType: "website",
});

export default function HomePage() {
  return <HomeClient />;
}
