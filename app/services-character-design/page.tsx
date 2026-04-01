import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesCharacterDesignClient } from "./ServicesCharacterDesignClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Character Design Services | Triolla",
  description: "Professional character design services for games, apps, and digital media. Create memorable characters.",
  path: "/services-character-design",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesCharacterDesignClient />;
}
