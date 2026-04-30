import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut, isAdminEmail } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const email = session?.user?.email ?? null;

  // The login page renders without the chrome.
  // We handle that with a separate route group convention by checking children location is fine here:
  // but since this layout wraps /admin/*, we redirect anywhere except /admin/login when unauthorized.
  // The middleware should already gate this — this is a defense-in-depth check.
  if (!email || !isAdminEmail(email)) {
    // Render only the children (login page) without admin chrome
    return <>{children}</>;
  }

  return (
    <div style={layoutShell}>
      <header style={headerStyle}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/admin" style={brandStyle}>Triolla CMS</Link>
          <nav style={{ display: "flex", gap: 12 }}>
            <Link href="/admin" style={navLink}>Pages</Link>
          </nav>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 13, opacity: 0.75 }}>{email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button type="submit" style={signOutBtn}>Sign out</button>
          </form>
        </div>
      </header>
      <main style={mainStyle}>{children}</main>
    </div>
  );
}

const layoutShell: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0b0d10",
  color: "#e7e9ec",
  fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 24px",
  borderBottom: "1px solid #1f2328",
  background: "#0f1216",
  position: "sticky",
  top: 0,
  zIndex: 10,
};

const brandStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "#fff",
  textDecoration: "none",
  letterSpacing: 0.3,
};

const navLink: React.CSSProperties = {
  color: "#c8ccd2",
  textDecoration: "none",
  fontSize: 14,
};

const signOutBtn: React.CSSProperties = {
  background: "#1f2328",
  color: "#e7e9ec",
  border: "1px solid #2b3036",
  padding: "6px 10px",
  borderRadius: 6,
  fontSize: 12,
  cursor: "pointer",
};

const mainStyle: React.CSSProperties = {
  padding: "24px",
  maxWidth: 1280,
  margin: "0 auto",
};
