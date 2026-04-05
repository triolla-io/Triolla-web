import type { Metadata } from "next";
import { HebrewLayoutStyles } from "../lib/HebrewLayoutStyles";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://triolla.io";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isHebrew = lang === "he";

  return {
    title: isHebrew ? "טריולה | סטודיו עיצוב UX/UI" : "Triolla | Product UX/UI Design Studio",
    description: isHebrew
      ? "#1 סטודיו עיצוב UX/UI בישראל"
      : "#1 Product UX/UI design studio in Israel",
    alternates: {
      languages: {
        "en-US": `${BASE_URL}/`,
        he: `${BASE_URL}/he/`,
        "x-default": `${BASE_URL}/`,
      },
    },
    openGraph: {
      type: "website",
      url: isHebrew ? `${BASE_URL}/he/` : `${BASE_URL}/`,
      title: isHebrew ? "טריולה | סטודיו עיצוב UX/UI" : "Triolla | Product UX/UI Design Studio",
      description: isHebrew
        ? "#1 סטודיו עיצוב UX/UI בישראל"
        : "#1 Product UX/UI design studio in Israel",
      locale: isHebrew ? "he_IL" : "en_US",
      alternateLocale: isHebrew ? "en_US" : "he_IL",
      siteName: "Triolla",
    },
  };
}

/**
 * Do not nest <html>/<body> under the root layout — that breaks hydration and
 * confuses React. `lang`/`dir` for /he/* are applied on `<html>` via `HtmlAndDirSync`.
 */
export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <>
      {lang === "he" ? <HebrewLayoutStyles /> : null}
      {children}
    </>
  );
}
