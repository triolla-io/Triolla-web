import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesProductStarsClient } from "./ServicesProductStarsClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Product Stars Service | Triolla",
  description: "Innovative product optimization service to make your digital product shine and succeed in the market.",
  path: "/services-product-stars",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesProductStarsClient />;
}
