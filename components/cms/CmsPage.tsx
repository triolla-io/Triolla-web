import { notFound } from "next/navigation";
import Script from "next/script";
import type { Metadata } from "next";
import {
  cmsScopeId,
  isValidKind,
  isValidLocale,
  isValidSlug,
  readPage,
  type CmsKind,
  type CmsLocale,
} from "@/lib/cms/contentStore";
import { getEntry } from "@/lib/snapshotRegistry";

export async function loadCmsPage(kind: CmsKind, slug: string, locale: CmsLocale) {
  if (!isValidKind(kind) || !isValidSlug(slug) || !isValidLocale(locale)) return null;
  return readPage(kind, slug, locale);
}

export async function buildCmsMetadata(
  kind: CmsKind,
  slug: string,
  locale: CmsLocale
): Promise<Metadata | null> {
  const page = await loadCmsPage(kind, slug, locale);
  if (!page) return null;
  return {
    title: page.meta.title || undefined,
    description: page.meta.description || undefined,
    openGraph: page.meta.ogImage
      ? { images: [{ url: page.meta.ogImage }] }
      : undefined,
  };
}

export default async function CmsPage({
  kind,
  slug,
  locale,
}: {
  kind: CmsKind;
  slug: string;
  locale: CmsLocale;
}) {
  const page = await loadCmsPage(kind, slug, locale);
  if (!page) notFound();

  const scopeId = cmsScopeId(kind, slug);
  const dir = locale === "he" ? "rtl" : "ltr";

  // When a templateSlug is set, load that entry's CSS/JS so the page
  // looks identical to existing snapshot posts (same header, footer, WP styles).
  const templateEntry = page.meta.templateSlug
    ? getEntry(page.meta.templateSlug, locale) ?? getEntry(page.meta.templateSlug, "en")
    : null;

  return (
    <>
      {/* Template CSS/JS — makes the page look like the chosen snapshot page */}
      {templateEntry?.css.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      {templateEntry?.fontPreloads?.map((href) => (
        <link key={href} rel="preload" href={href} as="font" crossOrigin="anonymous" />
      ))}
      {templateEntry?.inlineScripts
        ?.filter((s) => s.position === 0)
        .map((s, i) => (
          <Script
            key={i}
            id={`cms-inline-${i}-${slug}`}
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: s.code }}
          />
        ))}

      {/* Author-supplied scoped CSS (blank for template-backed pages) */}
      {page.stylesScoped ? (
        <style dangerouslySetInnerHTML={{ __html: page.stylesScoped }} />
      ) : null}

      <div
        id={scopeId}
        dir={dir}
        data-cms-kind={kind}
        data-cms-slug={slug}
        data-cms-locale={locale}
        dangerouslySetInnerHTML={{ __html: page.body }}
      />

      {page.meta.jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(page.meta.jsonLd) }}
        />
      ) : null}

      {/* Template deferred JS — jQuery plugins, animations, etc. */}
      {templateEntry?.js.map((src) => (
        <Script key={src} src={src} strategy="afterInteractive" />
      ))}
    </>
  );
}
