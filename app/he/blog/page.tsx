import type { Metadata } from "next";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { HeBlogClient } from "./HeBlogClient";
import { generatePageMetadata } from "../../lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "בלוג | Triolla UX/UI Design",
  description:
    "תובנות, טרנדים ומחקרי מקרה בעיצוב UX/UI מצוות טריולה—מחקר משתמשים, אבות טיפוס, מערכות עיצוב ומדריכים מעשיים לצוותי מוצר.",
  path: "/blog",
  lang: "he",
  ogType: "website",
  image: "/og-image.png",
});

export default function HeBlogPage() {
  return (
    <>
      <Breadcrumbs
        ariaLabel="אזור ניווט פירורי לחם"
        items={[
          { name: "בית", href: "/he" },
          { name: "בלוג", href: "/he/blog" },
        ]}
      />
      <HeBlogClient />
    </>
  );
}
