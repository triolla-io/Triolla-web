import type { Metadata } from "next";
import { AboutUsClient } from "./AboutUsClient";
import { generatePageMetadata } from "../lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "About Triolla | Leading UX/UI Design Agency",
  description:
    "Leading UX/UI design agency with 65+ experts and over a decade of experience delivering research, UI design, prototyping, and design systems for technology brands worldwide.",
  path: "/about-us",
  lang: "en",
  image: "/og-image.png",
});

export default function AboutUsPage() {
  return <AboutUsClient />;
}
