import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesAiAutomationClient } from "./ServicesAiAutomationClient";

export const metadata: Metadata = generatePageMetadata({
  title: "AI & Automation Services | Triolla",
  description: "AI-powered UX and automation: intelligent analysis, workflows, and product intelligence.",
  path: "/services/ai-automation",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesAiAutomationClient />;
}
