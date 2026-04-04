import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { JsonLd } from "../../../components/JsonLd";
import { metadataDescription, metadataTitle } from "../../../lib/metadataText";
import { absoluteUrl, serviceJsonLd } from "../../../lib/structured-data";
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
  const { Client } = d;

  const meta = d.metaHe ?? d.metaEn;
  const title = metadataTitle(meta) || "שירות | טריולה";
  const description = metadataDescription(meta);
  const path = `/he/services/${slug}`;
  const shortName = title.replace(/\s*\|\s*טריולה\s*$/i, "").trim() || slug;

  return (
    <>
      <Breadcrumbs
        ariaLabel="אזור ניווט פירורי לחם"
        items={[
          { name: "בית", href: "/he" },
          { name: "שירותים", href: "/he/services" },
          { name: shortName, href: path },
        ]}
      />
      <JsonLd
        data={serviceJsonLd({
          name: title,
          description,
          url: absoluteUrl(path),
        })}
      />
      <Client lang="he" />
    </>
  );
}
