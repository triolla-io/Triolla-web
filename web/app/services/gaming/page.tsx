import { permanentRedirect } from "next/navigation";

/** Canonical gaming marketing URL is /gaming, not /services/gaming. */
export default function ServicesGamingRedirectPage() {
  permanentRedirect("/gaming");
}
