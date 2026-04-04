import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostClient } from "../../../lib/BlogPostClient";
import {
  BLOG_SLUG_SEGMENT,
  getBlogSlugs,
  hebrewBlogFragmentExists,
  loadBlogDeps,
  loadHeBlogDeps,
  slugToTitle,
} from "../../../lib/blogPostRegistry";
import { TriollaPortfolioSnapshotClient } from "../../../lib/TriollaPortfolioSnapshotClient";

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
  return {
    title: `${title} | Triolla Blog`,
    description: `תובנות עיצוב UX/UI מטריאולה: ${title}`,
  };
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

  const heDeps = loadHeBlogDeps(slug);
  if (heDeps && hebrewBlogFragmentExists(slug)) {
    return (
      <TriollaPortfolioSnapshotClient
        fragmentUrl={`/fragments/he-blog-${slug}-he-body.html`}
        deps={heDeps}
        pageLabel={slug}
        landingSlug={`triolla-io-he-blog-${slug}`}
        assetDir={`he-blog-${slug}-he`}
        lang="he"
        chromeUrl="/fragments/blog-chrome-he.html"
      />
    );
  }

  const enDeps = loadBlogDeps(slug);
  if (!enDeps) {
    notFound();
  }

  return <BlogPostClient slug={slug} deps={enDeps} snapshotLang="he" />;
}
