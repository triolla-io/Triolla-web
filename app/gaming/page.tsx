import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { GamingClient } from "./GamingClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Gaming App UX/UI Design | Triolla",
  description: "Immersive and engaging UX/UI design for gaming applications.",
  path: "/gaming",
  lang: "en",
  ogType: "website",
});

export default function GamingPage() {
  return <GamingClient />;
}
