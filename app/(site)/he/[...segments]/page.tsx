import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SnapshotClient from "@/lib/SnapshotClient";
import { loadSnapshot } from "@/lib/loadSnapshot";
import { snapshotMetadata } from "@/lib/snapshotMetadata";
import { getFilesystemHePagePaths } from "@/lib/heFilesystemExclusions";
import {
  getHeStaticSegmentParams,
  heSegmentsToPathname,
  matchHebrewRegistryPath,
} from "@/lib/snapshotRegistry";
import CmsPage, { buildCmsMetadata } from "@/components/cms/CmsPage";
import { isValidSlug, localeExists, type CmsKind } from "@/lib/cms/contentStore";

type PageProps = { params: Promise<{ segments: string[] }> };

function resolveCms(segments: string[]): { kind: CmsKind; slug: string } | null {
  if (segments.length === 1 && isValidSlug(segments[0])) {
    return { kind: "page", slug: segments[0] };
  }
  if (segments.length === 2 && segments[0] === "blog" && isValidSlug(segments[1])) {
    return { kind: "blog", slug: segments[1] };
  }
  return null;
}

export function generateStaticParams() {
  const claimed = getFilesystemHePagePaths();
  return getHeStaticSegmentParams().filter(
    (p) => !claimed.has(heSegmentsToPathname(p.segments)),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segments } = await params;
  const cms = resolveCms(segments);
  if (cms && (await localeExists(cms.kind, cms.slug, "he"))) {
    return (await buildCmsMetadata(cms.kind, cms.slug, "he")) ?? {};
  }
  const entry = matchHebrewRegistryPath(heSegmentsToPathname(segments));
  if (!entry) return {};
  return snapshotMetadata(entry.slug, entry.locale);
}

export default async function HeCatchAllPage({ params }: PageProps) {
  const { segments } = await params;
  const cms = resolveCms(segments);
  if (cms && (await localeExists(cms.kind, cms.slug, "he"))) {
    return <CmsPage kind={cms.kind} slug={cms.slug} locale="he" />;
  }
  const entry = matchHebrewRegistryPath(heSegmentsToPathname(segments));
  if (!entry) notFound();

  const { bodyHtml, widgetProps } = await loadSnapshot(entry.slug, entry.locale);

  const jsonLdBlocks = [
    ...(entry.head?.jsonLd ?? []),
    ...(entry.head?.jsonLdSynthesized ?? []),
  ];

  return (
    <>
      {jsonLdBlocks.map((block, i) => (
        <Script
          key={i}
          id={`json-ld-${i}-${entry.slug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: block }}
        />
      ))}
      {entry.fontPreloads?.map((href) => (
        <link key={href} rel="preload" href={href} as="font" crossOrigin="anonymous" />
      ))}
      {entry.imagePreloads?.map((preload) => (
        <link
          key={preload.href}
          rel="preload"
          href={preload.href}
          as="image"
          type={preload.type}
          imageSrcSet={preload.imagesrcset}
          fetchPriority="high"
        />
      ))}
      {/* SSR JS preloads — browser starts fetching scripts during HTML parse, not after hydration */}
      {entry.js
        .filter((src) => !/googletagmanager|facebook\.net|hotjar|clarity\.ms|hubspot|hs-scripts|\/\d{7,}\.js/i.test(src))
        .slice(0, 5)
        .map((href) => (
          <link key={href} rel="preload" as="script" href={href} />
        ))}
      {entry.css.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <SnapshotClient entry={entry} bodyHtml={bodyHtml} widgetProps={widgetProps} />
    </>
  );
}

export const dynamic = "force-static";

/** Allow Hebrew paths present only in the registry (not pre-generated under app/he/). */
export const dynamicParams = true;
