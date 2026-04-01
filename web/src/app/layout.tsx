import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentLangDir from "@/components/DocumentLangDir";
import { LocaleProvider } from "@/components/LocaleProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://triolla.io"),
  title: "Triolla — Product UX/UI Design & Development",
  description:
    "Triolla is a leading product UX/UI design and development studio. We design and build digital products for SaaS, fintech, cyber security, healthcare, gaming and more.",
  keywords: "UX/UI design, product design, web development, SaaS design, fintech UX, cyber security design",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      he: "/he/",
    },
  },
  openGraph: {
    title: "Triolla — Product UX/UI Design & Development",
    description:
      "Partner with Triolla — a leading product design studio for SaaS, fintech, cyber, healthcare, and more.",
    url: "https://triolla.io",
    siteName: "Triolla",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <DocumentLangDir />
        <LocaleProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
