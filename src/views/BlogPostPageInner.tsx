import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import type { Locale } from "@/lib/i18n";
import { withLocalePrefix } from "@/lib/i18n";
import { blogPostUICopy } from "@/messages/blog";

interface Props {
  slug: string;
  locale: Locale;
}

export default function BlogPostPageInner({ slug, locale }: Props) {
  const post = getPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts(locale);
  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2);
  const ui = blogPostUICopy[locale];

  const formattedDate = new Date(post.date).toLocaleDateString(locale === "he" ? "he-IL" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const blogBase = withLocalePrefix("/blog/", locale);

  return (
    <>
      <section className="relative bg-[#FED125] pt-[160px] lg:pt-[200px] pb-0 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <Image src="/images/banner_grid.svg" alt="" fill className="object-cover object-top" />
        </div>

        <div className="relative max-w-[950px] mx-auto px-6 lg:px-8 text-center pb-[60px]">
          {post.category && (
            <Link
              href={blogBase}
              className="inline-block text-[14px] font-medium text-black/60 uppercase tracking-wider mb-4 hover:text-black transition-colors"
            >
              {ui.backToCategory} {post.category}
            </Link>
          )}
          <h1 className="text-[36px] md:text-[52px] lg:text-[64px] font-black text-black leading-tight mb-6">
            {post.title}
          </h1>
          <p className="text-[16px] text-black/50">{formattedDate}</p>
        </div>

        <div className="max-w-[1278px] mx-auto px-6 lg:px-8">
          <div className="rounded-[20px] lg:rounded-[31px] overflow-hidden shadow-2xl">
            <Image
              src={post.image}
              alt={post.title}
              width={1278}
              height={720}
              className="w-full h-auto object-cover"
              style={{ aspectRatio: "16/9", objectFit: "cover" }}
              priority
            />
          </div>
        </div>
      </section>

      <article className="py-[60px] lg:py-[80px] px-6 lg:px-8">
        <div className="max-w-[799px] mx-auto mb-10">
          <p className="text-[24px] lg:text-[32px] font-bold text-black leading-tight">{post.excerpt}</p>
        </div>

        <div
          className="max-w-[799px] mx-auto prose prose-lg prose-black"
          style={{
            fontSize: "20px",
            lineHeight: "1.6",
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="max-w-[799px] mx-auto mt-16">
          <div className="bg-[#FED125] rounded-[30px] px-[40px] lg:px-[52px] py-[50px] lg:py-[63px]">
            <ContactForm dark heading={ui.formHeading} showPhone />
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-[60px] lg:py-[80px] px-6 lg:px-[60px] bg-black">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[32px] lg:text-[36px] font-bold text-white">{ui.moreArticles}</h2>
              <Link
                href={blogBase}
                className="text-[18px] font-bold text-white hover:text-[#FED125] transition-colors flex items-center gap-2"
              >
                {ui.browseAll}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={locale === "he" ? "rotate-180" : ""}>
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedPosts.map((related) => (
                <article key={related.slug}>
                  <Link href={withLocalePrefix(`/blog/${related.slug}/`, locale)} className="block group">
                    <div className="blog-img-wrap rounded-[20px] overflow-hidden mb-4">
                      <Image
                        src={related.image}
                        alt={related.title}
                        width={600}
                        height={380}
                        className="w-full object-cover transition-transform duration-400 group-hover:scale-105"
                        style={{ aspectRatio: "3/2", objectFit: "cover" }}
                      />
                    </div>
                    <p className="text-[22px] lg:text-[28px] font-normal text-white leading-tight px-8 text-center group-hover:opacity-70 transition-opacity">
                      {related.title}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
