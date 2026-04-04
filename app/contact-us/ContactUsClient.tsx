"use client";

import type { TriollaLangProps } from "../lib/triollaLangProps";
import { ModernContactClient } from "./ModernContactClient";

/** React contact page (no WordPress snapshot) — `/assets/contact-us/*` mirrors are not shipped in git. */
export function ContactUsClient({ lang = "en" }: TriollaLangProps) {
  return <ModernContactClient lang={lang} />;
}
