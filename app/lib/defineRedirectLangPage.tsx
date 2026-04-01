import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ComponentType } from "react";

export type RedirectLangPageI18n = {
  title: { en: string; he: string };
  description: { en: string; he: string };
};

type PageParams = { params: Promise<{ lang: string }> };

type BilingualClientProps = { lang?: "en" | "he" };

/**
 * Factory for `[lang]/…/page.tsx` routes that redirect `en` to a canonical path
 * and render a bilingual client for `he` only (same pattern as most marketing pages).
 */
export function defineRedirectLangPage(opts: {
  canonicalPath: `/${string}`;
  i18n: RedirectLangPageI18n;
  Client: ComponentType<BilingualClientProps>;
}) {
  async function generateMetadata({ params }: PageParams): Promise<Metadata> {
    const { lang } = await params;
    return {
      title: lang === "he" ? opts.i18n.title.he : opts.i18n.title.en,
      description: lang === "he" ? opts.i18n.description.he : opts.i18n.description.en,
    };
  }

  async function Page({ params }: PageParams) {
    const { lang } = await params;
    const Client = opts.Client;
    if (lang === "en") redirect(opts.canonicalPath);
    if (lang === "he") return <Client lang="he" />;
    redirect(opts.canonicalPath);
  }

  return { generateMetadata, Page };
}
