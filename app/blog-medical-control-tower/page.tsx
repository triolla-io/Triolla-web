import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { BlogMedicalControlTowerClient } from "./BlogMedicalControlTowerClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog: Medical Control Tower | Triolla",
  description: "Blog: Medical Control Tower - Professional services by Triolla",
  path: "/blog/medical-control-tower",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <BlogMedicalControlTowerClient />;
}
