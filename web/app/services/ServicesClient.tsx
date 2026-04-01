"use client";

import { BilingualSnapshotByRegistryKey } from "../lib/BilingualSnapshotByRegistryKey";
import type { TriollaLangProps } from "../lib/triollaLangProps";

export function ServicesClient({ lang = "en" }: TriollaLangProps) {
  return <BilingualSnapshotByRegistryKey pageKey="services" lang={lang} />;
}
