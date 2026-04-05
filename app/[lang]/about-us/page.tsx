import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";
import { AboutUsClient } from "./AboutUsClient";

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isHe = lang === "he";
  return generatePageMetadata({
    title: isHe
      ? "אודות טריולה | חברת עיצוב ממשק משתמש מובילה"
      : "About Triolla | Leading UX/UI Design Agency",
    description: isHe
      ? "חברת עיצוב ממשק משתמש מובילה עם למעלה מ-65 מומחי עיצוב ויותר מעשור ניסיון."
      : "Leading UX/UI design agency with 65+ design experts and over a decade of experience.",
    path: "/about-us",
    lang: isHe ? "he" : "en",
    image: "/og-image.png",
  });
}

export default async function AboutUsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <AboutUsClient lang={lang} />;
}
