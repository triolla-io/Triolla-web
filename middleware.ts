import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Phase 1: pass-through. Phase 2 will gate `?edit=1` and `/api/edits` behind Auth.js.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/edits/:path*", "/admin/:path*"],
};
