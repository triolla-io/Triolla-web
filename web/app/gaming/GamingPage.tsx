"use client";

import { GamingClient } from "./GamingClient";

/** English-only entry; routes use {@link GamingClient} with `lang`. */
export function GamingPage() {
  return <GamingClient lang="en" />;
}
