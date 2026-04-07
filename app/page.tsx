import type { Metadata } from "next";
import { generatePageMetadata } from "./lib/metadata";
import { HomeClient } from "./HomeClient";
import { PublishButton } from "./components/PublishButton";
import { getContent } from "./agents/utils/content";

export const metadata: Metadata = generatePageMetadata({
  title: "Triolla - Web Design & App Development",
  description:
    "Product UX/UI design studio in Israel: we craft digital experiences, design systems, and interfaces for technology brands, startups, and enterprise teams.",
  path: "/",
  lang: "en",
  ogType: "website",
});

export default async function HomePage() {
  const { version, updatedAt } = await getContent("metadata");
  return (
    <>
      <PublishButton initialVersion={version} initialUpdatedAt={updatedAt} /> {/* TODO: remove this button */}
      <HomeClient />
    </>
  );
}
