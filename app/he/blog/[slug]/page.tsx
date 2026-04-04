import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { JsonLd } from "../../../components/JsonLd";
import { BlogPostClient } from "../../../lib/BlogPostClient";
import {
  BLOG_SLUG_SEGMENT,
  getBlogSlugs,
  hebrewBlogFragmentExists,
  loadBlogDeps,
  loadHeBlogDeps,
  slugToTitle,
} from "../../../lib/blogPostRegistry";
import { generateHebrewBlogPostMetadata } from "../../../lib/metadata";
import { TriollaPortfolioSnapshotClient } from "../../../lib/TriollaPortfolioSnapshotClient";
import { absoluteUrl, blogPostingJsonLd } from "../../../lib/structured-data";

type Params = { slug: string };

export async function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slugToTitle(slug);
  const path = `/blog/${slug}`;
  return generateHebrewBlogPostMetadata({
    title: `${title} | בלוג טריולה`,
    description: `תובנות עיצוב UX/UI מטריאולה: ${title}.`,
    path,
    image: "/og-image.png",
  });
}

export default async function HeBlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  if (!BLOG_SLUG_SEGMENT.test(slug) || !getBlogSlugs().includes(slug)) {
    notFound();
  }

  const title = slugToTitle(slug);
  const path = `/he/blog/${slug}`;
  const headline = `${title} | בלוג טריולה`;
  const description = `תובנות עיצוב UX/UI מטריאולה: ${title}.`;

  const heDeps = loadHeBlogDeps(slug);
  const snapshot =
    heDeps && hebrewBlogFragmentExists(slug) ? (
      <TriollaPortfolioSnapshotClient
        fragmentUrl={`/fragments/he-blog-${slug}-he-body.html`}
        deps={heDeps}
        pageLabel={slug}
        landingSlug={`triolla-io-he-blog-${slug}`}
        assetDir={`he-blog-${slug}-he`}
        lang="he"
        chromeUrl="/fragments/blog-chrome-he.html"
      />
    ) : null;

  const enDeps = loadBlogDeps(slug);
  const fallback =
    !snapshot && enDeps ? <BlogPostClient slug={slug} deps={enDeps} snapshotLang="he" /> : null;

  if (!snapshot && !enDeps) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs
        ariaLabel="אזור ניווט פירורי לחם"
        items={[
          { name: "בית", href: "/he" },
          { name: "בלוג", href: "/he/blog" },
          { name: title, href: path },
        ]}
      />
      <JsonLd
        data={blogPostingJsonLd({
          headline,
          description,
          url: absoluteUrl(path),
          image: absoluteUrl("/og-image.png"),
          inLanguage: "he",
        })}
      />
      {snapshot ?? fallback}
    </>
  );
}
