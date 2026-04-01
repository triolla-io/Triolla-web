import { redirect } from "next/navigation";

type Props = { params: Promise<{ lang: string }> };

/** Triolla uses /about-us; /he/about is a common shorthand. */
export default async function AboutAliasLangPage({ params }: Props) {
  const { lang } = await params;
  if (lang === "he") {
    redirect("/he/about-us");
  }
  if (lang === "en") {
    redirect("/about-us");
  }
  redirect("/about-us");
}
