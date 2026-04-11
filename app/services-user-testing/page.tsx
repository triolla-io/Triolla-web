import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesUserTestingClient } from "./ServicesUserTestingClient";

export const metadata: Metadata = generatePageMetadata({
  title: "User Testing | Triolla",
  description:
    "User testing that reveals real insights, validates design decisions, and drives continuous improvement.",
  path: "/services-user-testing",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesUserTestingClient />;
}
