import BlogPostPageInner from "@/views/BlogPostPageInner";
import { getPostBySlug } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getAllPosts } = await import("@/lib/posts");
  const posts = getAllPosts("en");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "en");
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | Triolla Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `https://triolla.io/blog/${slug}/`,
      languages: {
        en: `https://triolla.io/blog/${slug}/`,
        he: `https://triolla.io/he/blog/${slug}/`,
      },
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostPageInner slug={slug} locale="en" />;
}
