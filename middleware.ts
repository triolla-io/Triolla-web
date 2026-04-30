export { auth as middleware } from "@/auth";

// Only gate /admin pages here. /api/cms/* routes call requireAdmin() server-side
// and return proper 401/403 status codes. /api/edits/* is gated by the
// NEXT_PUBLIC_EDITOR_ENABLED env flag inside its handler.
export const config = {
  matcher: ["/admin/:path*"],
};
