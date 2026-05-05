import { notFound } from "next/navigation";
import EditorWorkspace from "@/components/admin/EditorWorkspace";
import { isValidKind, isValidSlug } from "@/lib/cms/contentStore";

export const dynamic = "force-dynamic";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ kind: string; slug: string }>;
}) {
  const { kind, slug } = await params;
  if (!isValidKind(kind)) notFound();
  const isNew = slug === "__new__";
  if (!isNew && !isValidSlug(slug)) notFound();

  return <EditorWorkspace kind={kind} initialSlug={slug} isNew={isNew} />;
}
