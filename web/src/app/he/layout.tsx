import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    languages: {
      en: "/",
      he: "/he/",
    },
  },
};

export default function HebrewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section dir="rtl">{children}</section>;
}
