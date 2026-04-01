import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HomeClient } from "../HomeClient";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "he") {
    return {
      title: "טריולה | סטודיו לעיצוב UX/UI למוצרים",
      description: "סטודיו מוביל לעיצוב חוויית משתמש וממשק למוצרים דיגיטליים",
    };
  }
  return {};
}

export default async function LangIndexPage({ params }: Props) {
  const { lang } = await params;
  if (lang === "en") {
    redirect("/");
  }
  if (lang === "he") {
    return <HomeClient />;
  }
  redirect("/");
}
