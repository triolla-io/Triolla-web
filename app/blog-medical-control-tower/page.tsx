import { permanentRedirect } from "next/navigation";

/**
 * This blog post is Hebrew-only on triolla.io.
 * triolla.io/blog/medical-control-tower/ → triolla.io/he/blog/medical-control-tower/
 */
export default function Page() {
  permanentRedirect("/he/blog/medical-control-tower");
}
