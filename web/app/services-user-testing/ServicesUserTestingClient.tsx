"use client";

import { BilingualSnapshotByRegistryKey } from "../lib/BilingualSnapshotByRegistryKey";
import type { TriollaLangProps } from "../lib/triollaLangProps";

export function ServicesUserTestingClient({ lang = "en" }: TriollaLangProps) {
  return <BilingualSnapshotByRegistryKey pageKey="services-user-testing" lang={lang} />;
}
