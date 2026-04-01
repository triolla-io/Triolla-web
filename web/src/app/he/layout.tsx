import type { Metadata } from "next";
import { HebrewNavigation } from "@/components/HebrewNavigation";
import "@/app/hebrew-navigation.css";

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
  return (
    <section dir="rtl">
      <HebrewNavigation />
      {children}
    </section>
  );
}
