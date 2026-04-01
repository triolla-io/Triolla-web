"use client";

import { BilingualSnapshotByRegistryKey } from "../lib/BilingualSnapshotByRegistryKey";
import type { TriollaLangProps } from "../lib/triollaLangProps";

export function ServicesFrontEndDevClient({ lang = "en" }: TriollaLangProps) {
  return <BilingualSnapshotByRegistryKey pageKey="services-front-end-dev" lang={lang} />;
}
