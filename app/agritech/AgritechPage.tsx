"use client";

import { AgritechClient } from "./AgritechClient";

/** English-only entry (e.g. demos); routes use {@link AgritechClient} with `lang`. */
export function AgritechPage() {
  return <AgritechClient lang="en" />;
}
