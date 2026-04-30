import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsPage, { buildCmsMetadata } from "@/components/cms/CmsPage";
import {
  isValidSlug,
  type CmsKind,
} from "@/lib/cms/contentStore";

type PageProps = { params: Promise<{ slug: string[] }> };

function resolveCms(segments: string[]): { kind: CmsKind; slug: string } | null {
  if (segments.length === 1 && isValidSlug(segments[0])) {
    return { kind: "page", slug: segments[0] };
  }
  if (segments.length === 2 && segments[0] === "blog" && isValidSlug(segments[1])) {
    return { kind: "blog", slug: segments[1] };
  }
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const r = resolveCms(slug);
  if (!r) return {};
  return (await buildCmsMetadata(r.kind, r.slug, "en")) ?? {};
}

export default async function CmsCatchAllEn({ params }: PageProps) {
  const { slug } = await params;
  const r = resolveCms(slug);
  if (!r) notFound();
  return <CmsPage kind={r.kind} slug={r.slug} locale="en" />;
}

export const dynamic = "force-static";
export const dynamicParams = true;
