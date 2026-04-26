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

type PageProps = { params: Promise<{ segments: string[] }> };

export function generateStaticParams() {
  const claimed = getFilesystemHePagePaths();
  return getHeStaticSegmentParams().filter(
    (p) => !claimed.has(heSegmentsToPathname(p.segments)),
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segments } = await params;
  const entry = matchHebrewRegistryPath(heSegmentsToPathname(segments));
  if (!entry) return {};
  return snapshotMetadata(entry.slug, entry.locale);
}

export default async function HeCatchAllPage({ params }: PageProps) {
  const { segments } = await params;
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
