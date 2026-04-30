import { NextResponse } from "next/server";
import { auth, isAdminEmail } from "@/auth";

export type AdminSession = {
  email: string;
  name: string | null;
};

export async function requireAdmin(): Promise<
  | { ok: true; session: AdminSession }
  | { ok: false; response: NextResponse }
> {
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!email) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (!isAdminEmail(email)) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { ok: true, session: { email, name: session?.user?.name ?? null } };
}
