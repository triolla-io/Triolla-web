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
        {/* Almoni loads via ../public/assets/_shared/fonts/fonts.css @font-face (no rel=preload: as=font + SVG is invalid in browsers). */}
      </head>
      <body>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
      </body>
    </html>
  );
}
