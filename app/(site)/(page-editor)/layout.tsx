// Route group layout for the page editor.
// Intentionally minimal — renders children with no admin chrome, no padding,
// no dark background. The page editor is full-screen and manages its own bars.
// Auth is handled by the middleware (matcher: /admin/:path*).
export default function PageEditorGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
