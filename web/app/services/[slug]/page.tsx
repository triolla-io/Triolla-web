import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  return <Client lang="en" />;
}
