import { redirect } from "next/navigation";
import { auth, signIn, isAdminEmail } from "@/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user?.email && isAdminEmail(session.user.email)) {
    redirect("/admin");
  }

  const { error, callbackUrl } = await searchParams;
  const hasGoogle = !!process.env.GOOGLE_CLIENT_ID;
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasDevPassword =
    process.env.NODE_ENV !== "production" && !!process.env.DEV_ADMIN_PASSWORD;

  return (
    <div style={wrapper}>
      <div style={card}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Triolla CMS</h1>
        <p style={{ marginTop: 8, marginBottom: 24, opacity: 0.7, fontSize: 13 }}>
          Sign in to continue.
        </p>

        {error ? (
          <div style={errorBox}>
            {error === "AccessDenied"
              ? "This email isn't on the admin allow-list."
              : "Sign-in failed. Try again."}
          </div>
        ) : null}

        {hasGoogle ? (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl ?? "/admin" });
            }}
          >
            <button type="submit" style={primaryBtn}>Sign in with Google</button>
          </form>
        ) : null}

        {hasResend ? (
          <form
            action={async (formData: FormData) => {
              "use server";
              const email = String(formData.get("email") ?? "");
              await signIn("resend", { email, redirectTo: callbackUrl ?? "/admin" });
            }}
            style={{ marginTop: 16 }}
          >
            <label style={label}>Email magic link</label>
            <input
              required
              type="email"
              name="email"
              placeholder="you@triolla.io"
              style={input}
            />
            <button type="submit" style={secondaryBtn}>Send magic link</button>
          </form>
        ) : null}

        {hasDevPassword ? (
          <form
            action={async (formData: FormData) => {
              "use server";
              const password = String(formData.get("password") ?? "");
              await signIn("credentials", { password, redirectTo: callbackUrl ?? "/admin" });
            }}
            style={{ marginTop: hasGoogle || hasResend ? 20 : 0 }}
          >
            <div style={{ borderTop: hasGoogle || hasResend ? "1px solid #1f2328" : undefined, paddingTop: hasGoogle || hasResend ? 16 : 0 }}>
              <label style={{ ...label, color: "#fbbf24" }}>⚙ Dev mode — password</label>
              <input required type="password" name="password" placeholder="dev password" style={input} />
              <button type="submit" style={{ ...secondaryBtn, borderColor: "#78350f" }}>Sign in (dev)</button>
            </div>
          </form>
        ) : null}

        {!hasGoogle && !hasResend && !hasDevPassword ? (
          <div style={errorBox}>
            No auth providers configured. Set GOOGLE_CLIENT_ID/SECRET, RESEND_API_KEY, or DEV_ADMIN_PASSWORD.
          </div>
        ) : null}
      </div>
    </div>
  );
}

const wrapper: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#0b0d10",
  color: "#e7e9ec",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
};

const card: React.CSSProperties = {
  width: 360,
  background: "#11151a",
  border: "1px solid #1f2328",
  padding: 24,
  borderRadius: 10,
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "#3b82f6",
  color: "#fff",
  border: 0,
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "#1f2328",
  color: "#e7e9ec",
  border: "1px solid #2b3036",
  borderRadius: 6,
  fontWeight: 500,
  cursor: "pointer",
  marginTop: 8,
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  opacity: 0.7,
  marginBottom: 6,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "9px 10px",
  background: "#0b0d10",
  color: "#e7e9ec",
  border: "1px solid #2b3036",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
};

const errorBox: React.CSSProperties = {
  marginBottom: 16,
  padding: "10px 12px",
  background: "#3a1a1a",
  border: "1px solid #5a2727",
  color: "#f5b5b5",
  borderRadius: 6,
  fontSize: 13,
};
