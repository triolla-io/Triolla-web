import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { JsonLd } from "../../components/JsonLd";
import { metadataDescription, metadataTitle } from "../../lib/metadataText";
import { absoluteUrl, serviceJsonLd } from "../../lib/structured-data";
import {
  SERVICE_DETAIL_SLUGS,
  getServiceDetail,
} from "../serviceDetailRegistry";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_DETAIL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = getServiceDetail(slug);
  if (!d) return {};
  return d.metaEn;
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const d = getServiceDetail(slug);
  if (!d) notFound();
  const { Client } = d;
  const meta = d.metaEn;
  const title = metadataTitle(meta) || "Service | Triolla";
  const description = metadataDescription(meta);
  const path = `/services/${slug}`;
  const shortName = title.replace(/\s*\|\s*Triolla\s*$/i, "").trim() || slug;

  return (
    <>
      <Breadcrumbs
        ariaLabel="Breadcrumb"
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
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
      <Client lang="en" />
    </>
  );
}
