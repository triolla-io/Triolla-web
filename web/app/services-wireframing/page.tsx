import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesWireframingClient } from "./ServicesWireframingClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Wireframing Services | Triolla",
  description: "Professional wireframing to visualize your product structure and user flows before design.",
  path: "/services-wireframing",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesWireframingClient />;
}
