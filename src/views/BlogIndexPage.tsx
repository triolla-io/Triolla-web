import Banner from "@/components/Banner";
import BlogCard from "@/components/BlogCard";
import ContactSection from "@/components/ContactSection";
import { getAllPosts } from "@/lib/posts";
import { blogIndexCopy } from "@/messages/blog";
import type { Locale } from "@/lib/i18n";

export default function BlogIndexPage({ locale }: { locale: Locale }) {
  const posts = getAllPosts(locale);
  const topPosts = posts.slice(0, 2);
  const restPosts = posts.slice(2);
  const copy = blogIndexCopy[locale];

  return (
    <>
      <Banner title={copy.title} boldText={copy.boldText} shortText={copy.shortText} bgColor="#FED125" />

      <section className="py-[80px] lg:py-[125px] px-6 lg:px-[100px] bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-[50px] mb-[80px] lg:mb-[88px]">
          {topPosts.map((post) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              image={post.image}
              category={post.category}
              large
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[44px]">
          {restPosts.map((post) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              image={post.image}
              category={post.category}
            />
          ))}
        </div>
      </section>

      <ContactSection />
    </>
  );
}
