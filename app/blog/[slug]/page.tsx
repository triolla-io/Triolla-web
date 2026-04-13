import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "../../components/Breadcrumbs";
import { JsonLd } from "../../components/JsonLd";
import { BlogPostClient } from "../../lib/BlogPostClient";
import {
  BLOG_SLUG_SEGMENT,
  englishBlogFragmentExists,
  getBlogSlugs,
  hebrewBlogFragmentExists,
  loadBlogDeps,
  slugToTitle,
} from "../../lib/blogPostRegistry";
import { generateArticleMetadata } from "../../lib/metadata";
import { absoluteUrl, blogPostingJsonLd } from "../../lib/structured-data";

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
  return generateArticleMetadata({
    title: `${title} | Triolla Blog`,
    description: `Triolla UX/UI design insights: ${title}.`,
    path,
    lang: "en",
    ogType: "article",
    image: "/og-image.png",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  if (!BLOG_SLUG_SEGMENT.test(slug) || !getBlogSlugs().includes(slug)) {
    notFound();
  }

  const deps = loadBlogDeps(slug);
  if (!deps) {
    notFound();
  }

  // If no English fragment exists but a Hebrew one does, redirect (Hebrew-only post).
  if (!englishBlogFragmentExists(slug) && hebrewBlogFragmentExists(slug)) {
    permanentRedirect(`/he/blog/${slug}`);
  }

  const title = slugToTitle(slug);
  const path = `/blog/${slug}`;
  const headline = `${title} | Triolla Blog`;
  const description = `Triolla UX/UI design insights: ${title}.`;

  return (
    <>
      <Breadcrumbs
        ariaLabel="Breadcrumb"
        items={[
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: title, href: path },
        ]}
      />
      <JsonLd
        data={blogPostingJsonLd({
          headline,
          description,
          url: absoluteUrl(path),
          image: absoluteUrl("/og-image.png"),
          inLanguage: "en",
        })}
      />
      <BlogPostClient slug={slug} deps={deps} snapshotLang="en" />
    </>
  );
}
