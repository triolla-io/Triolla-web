"use client";

import { BilingualSnapshotByRegistryKey } from "../lib/BilingualSnapshotByRegistryKey";
import type { TriollaLangProps } from "../lib/triollaLangProps";

export function DevClient({ lang = "en" }: TriollaLangProps) {
  return <BilingualSnapshotByRegistryKey pageKey="dev" lang={lang} />;
}
