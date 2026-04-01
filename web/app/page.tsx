import type { Metadata } from "next";
import { generatePageMetadata } from "./lib/metadata";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Triolla - Web Design & App Development",
  description: "Leading web design and app development agency in Israel.",
  path: "/",
  lang: "en",
  ogType: "website",
});

export default function HomePage() {
  return <HomeClient />;
}
