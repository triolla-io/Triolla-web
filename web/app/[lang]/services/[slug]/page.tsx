import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  SERVICE_DETAIL_SLUGS,
  getServiceDetail,
} from "../../../services/serviceDetailRegistry";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return SERVICE_DETAIL_SLUGS.map((slug) => ({ lang: "he", slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const d = getServiceDetail(slug);
  if (!d) return {};
  if (lang === "he" && d.metaHe) return d.metaHe;
  return d.metaEn;
}

export default async function ServiceDetailLangPage({ params }: Props) {
  const { lang, slug } = await params;
  if (lang === "en") {
    permanentRedirect(`/services/${slug}`);
  }
  if (lang !== "he") {
    permanentRedirect(`/services/${slug}`);
  }
  const d = getServiceDetail(slug);
  if (!d) notFound();
  if (!d.hasHebrew) notFound();
  return <d.Client lang="he" />;
}
