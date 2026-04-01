import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { ServicesProductUxUiDesignClient } from "./ServicesProductUxUiDesignClient";

export const metadata: Metadata = generatePageMetadata({
  title: "Product UX/UI Design Services | Triolla",
  description: "Complete UX/UI design for digital products from concept to launch with user-centered approach.",
  path: "/services-product-ux-ui-design",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return <ServicesProductUxUiDesignClient />;
}
