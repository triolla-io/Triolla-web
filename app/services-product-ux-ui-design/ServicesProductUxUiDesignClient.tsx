"use client";

import { BilingualSnapshotByRegistryKey } from "../lib/BilingualSnapshotByRegistryKey";
import type { TriollaLangProps } from "../lib/triollaLangProps";

export function ServicesProductUxUiDesignClient({ lang = "en" }: TriollaLangProps) {
  return (
    <BilingualSnapshotByRegistryKey pageKey="services-product-ux-ui-design" lang={lang} />
  );
}
