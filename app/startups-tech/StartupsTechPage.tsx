"use client";

import { StartupsTechClient } from "./StartupsTechClient";

/** English-only entry; routes use {@link StartupsTechClient} with `lang`. */
export function StartupsTechPage() {
  return <StartupsTechClient lang="en" />;
}
