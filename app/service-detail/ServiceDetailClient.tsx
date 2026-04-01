"use client";

import { BilingualSnapshotByRegistryKey } from "../lib/BilingualSnapshotByRegistryKey";
import type { TriollaLangProps } from "../lib/triollaLangProps";

/** English-only fragment today; `lang` kept for `[lang]` / service-detail parity. */
export function ServiceDetailClient({ lang = "en" }: TriollaLangProps) {
  return <BilingualSnapshotByRegistryKey pageKey="service-detail" lang={lang} />;
}
