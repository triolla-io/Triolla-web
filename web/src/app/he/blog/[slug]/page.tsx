import BlogPostPageInner from "@/views/BlogPostPageInner";
import { getPostBySlug } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getAllPosts } = await import("@/lib/posts");
  const posts = getAllPosts("he");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "he");
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} | בלוג טריולה`,
    description: post.excerpt,
    alternates: {
      canonical: `https://triolla.io/he/blog/${slug}/`,
      languages: {
        en: `https://triolla.io/blog/${slug}/`,
        he: `https://triolla.io/he/blog/${slug}/`,
      },
    },
  };
}

export default async function HebrewBlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogPostPageInner slug={slug} locale="he" />;
}
