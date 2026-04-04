"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/components/LocaleProvider";
import { withLocalePrefix } from "@/lib/i18n";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category?: string;
  large?: boolean;
}

export default function BlogCard({
  slug,
  title,
  excerpt,
  date,
  image,
  category,
  large = false,
}: BlogCardProps) {
  const locale = useLocale();
  const href = withLocalePrefix(`/blog/${slug}/`, locale);
  const formattedDate = new Date(date).toLocaleDateString(locale === "he" ? "he-IL" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article>
      <Link href={href} className="block group">
        <div
          className={`blog-img-wrap mb-5 ${large ? "rounded-[31px]" : "rounded-[22px]"}`}
        >
          <Image
            src={image}
            alt={title}
            width={large ? 800 : 500}
            height={large ? 500 : 320}
            className="w-full object-cover transition-transform duration-400 group-hover:scale-105"
            style={{
              aspectRatio: large ? "16/10" : "3/2",
              objectFit: "cover",
            }}
            loading="lazy"
          />
        </div>

        <div className={`${large ? "px-[76px]" : "px-[47px]"} text-center`}>
          {category && (
            <span className="text-[13px] text-black/50 font-medium uppercase tracking-wider mb-2 block">
              {category}
            </span>
          )}
          <h3
            className={`font-normal text-black leading-tight group-hover:opacity-70 transition-opacity ${
              large ? "text-[28px] lg:text-[32px]" : "text-[20px] lg:text-[26px]"
            }`}
          >
            {title}
          </h3>
          <p className="text-[14px] text-black/50 mt-2">{formattedDate}</p>
        </div>
      </Link>
    </article>
  );
}
