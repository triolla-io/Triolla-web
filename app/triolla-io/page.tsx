import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import { TriollaPortfolioSnapshotClient } from "../lib/TriollaPortfolioSnapshotClient";
import deps from "./triolla-io-deps.json";

export const metadata: Metadata = generatePageMetadata({
  title: "Triolla Io | Triolla",
  description: "View Triolla Io at Triolla",
  path: "/triolla-io",
  lang: "en",
  ogType: "website",
});

export default function Page() {
  return (
    <TriollaPortfolioSnapshotClient
      fragmentUrl="/fragments/triolla-io-body.html"
      deps={deps}
      pageLabel="triolla-io"
      landingSlug="triolla-io-triolla-io"
      assetDir="triolla-io"
      lang="en"
    />
  );
}
