import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function isAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  if (adminEmails.length === 0) return false;
  return adminEmails.includes(email.toLowerCase());
}

const providers: NextAuthConfig["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.RESEND_API_KEY) {
  providers.push(
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM ?? "no-reply@triolla.io",
    })
  );
}

// Dev-only password login — never active in production.
if (process.env.NODE_ENV !== "production" && process.env.DEV_ADMIN_PASSWORD) {
  providers.push(
    Credentials({
      credentials: { password: { label: "Dev password", type: "password" } },
      authorize(creds) {
        if (creds?.password === process.env.DEV_ADMIN_PASSWORD) {
          // Return the first admin email as the identity.
          return { id: "dev", email: adminEmails[0] ?? "dev@localhost" };
        }
        return null;
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    signIn({ user }) {
      return isAllowed(user.email);
    },
    jwt({ token, user }) {
      if (user?.email) token.email = user.email;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.email) session.user.email = token.email as string;
      return session;
    },
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      // Login page is open. Match with or without trailing slash.
      if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
        return true;
      }
      if (pathname.startsWith("/admin")) {
        return isAllowed(session?.user?.email);
      }
      return true;
    },
  },
  trustHost: true,
});

export function isAdminEmail(email: string | null | undefined): boolean {
  return isAllowed(email);
}
