import { redirect } from "next/navigation";

/** Common mistaken URL; canonical Hebrew page is `/he/technology`. */
export default function TechnologyHeMisplacedSegmentRedirect() {
  redirect("/he/technology");
}
