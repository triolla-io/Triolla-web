import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesUserTestingClient } from "./ServicesUserTestingClient";

export const metadata: Metadata = generatePageMetadata({
  title: "User Testing Services | Triolla",
  description: "Comprehensive user testing to validate assumptions and improve your product based on real user feedback.",
  path: "/services-user-testing",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesUserTestingClient />;
}
