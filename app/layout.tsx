import type { Metadata } from "next";
import { JsonLd } from "./components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "./lib/structured-data";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./triolla-snapshot-mobile-nav.css";
import "../public/assets/_shared/fonts/fonts.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Triolla — UX/UI product design studio",
    template: "%s | Triolla",
  },
  description:
    "Triolla is a product UX/UI design studio building digital experiences for technology brands.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Hebrew UI fonts (globals.css @font-face using SVG format); Latin UI uses next/font Geist above. */}
        <link
          rel="preload"
          href="/assets/_shared/fonts/AlmoniMLv5AAA-Regular.svg"
          as="font"
          type="font/svg"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/_shared/fonts/AlmoniMLv5AAA-Bold.svg"
          as="font"
          type="font/svg"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
      </body>
    </html>
  );
}
