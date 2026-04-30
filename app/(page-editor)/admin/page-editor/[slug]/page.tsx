import Script from "next/script";
import { notFound } from "next/navigation";
import { loadSnapshot } from "@/lib/loadSnapshot";
import { getEntry } from "@/lib/snapshotRegistry";
import PageEditorClient from "./PageEditorClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string; edit?: string }>;
};

export default async function PageEditorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { locale: rawLocale } = await searchParams;
  const locale = rawLocale === "he" ? "he" : "en";

  // Resolve the registry slug: try the raw slug first, then the prefixed form.
  const entry = getEntry(slug, locale) ?? getEntry(`triolla-io-${slug}`, locale);
  if (!entry) notFound();

  const { entry: loaded, bodyHtml, widgetProps } = await loadSnapshot(entry.slug, locale);

  const jsonLdBlocks = [
    ...(loaded.head?.jsonLd ?? []),
    ...(loaded.head?.jsonLdSynthesized ?? []),
  ];

  return (
    <>
      {jsonLdBlocks.map((block, i) => (
        <Script
          key={i}
          id={`json-ld-${i}-${loaded.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: block }}
        />
      ))}
      {loaded.css.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <PageEditorClient
        entry={loaded}
        bodyHtml={bodyHtml}
        widgetProps={widgetProps}
        locale={locale}
      />
    </>
  );
}
