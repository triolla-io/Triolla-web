import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogPostClient } from "../../lib/BlogPostClient";
import {
  BLOG_SLUG_SEGMENT,
  getBlogSlugs,
  loadBlogDeps,
  slugToTitle,
} from "../../lib/blogPostRegistry";

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
    description: `Triolla UX/UI design insights: ${title}`,
  };
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

  return <BlogPostClient slug={slug} deps={deps} snapshotLang="en" />;
}
