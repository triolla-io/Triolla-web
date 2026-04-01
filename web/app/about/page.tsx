import { redirect } from "next/navigation";

/** Marketing canonical path is `/about-us` (see `about-us/page.tsx`). */
export default function AboutAliasPage() {
  redirect("/about-us");
}
