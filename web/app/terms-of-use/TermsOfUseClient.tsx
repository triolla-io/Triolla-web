"use client";

import { BilingualSnapshotByRegistryKey } from "../lib/BilingualSnapshotByRegistryKey";
import type { TriollaLangProps } from "../lib/triollaLangProps";

export function TermsOfUseClient({ lang = "en" }: TriollaLangProps) {
  return <BilingualSnapshotByRegistryKey pageKey="terms-of-use" lang={lang} />;
}
