"use client";

import { B2cClient } from "./B2cClient";

/** English-only entry; routes use {@link B2cClient} with `lang`. */
export function B2cPage() {
  return <B2cClient lang="en" />;
}
