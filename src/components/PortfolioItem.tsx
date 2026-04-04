import Image from "next/image";
import Link from "next/link";

interface PortfolioItemProps {
  logo: string;
  logoAlt: string;
  logoWidth?: number;
  logoHeight?: number;
  title: string;
  text: string;
  image: string;
  /** Optional narrower/taller asset for small screens (matches WP `img.two` mobile art). */
  imageMobile?: string;
  imageMobileWidth?: number;
  imageMobileHeight?: number;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  tags: string[];
  /** Alternates image left / image right on large screens; text column gets asymmetric padding only. */
  even?: boolean;
  galleryHref?: string;
}

export default function PortfolioItem({
  logo,
  logoAlt,
  logoWidth = 160,
  logoHeight = 48,
  title,
  text,
  image,
  imageMobile,
  imageMobileWidth,
  imageMobileHeight,
  imageAlt,
  imageWidth = 1000,
  imageHeight = 980,
  tags,
  even = false,
  galleryHref,
}: PortfolioItemProps) {
  const mobileW = imageMobileWidth ?? imageWidth;
  const mobileH = imageMobileHeight ?? imageHeight;

  /** Extra padding on the text column only (not the image), alternating with `even`. */
  const textColPadding = even
    ? "lg:pl-12 lg:pr-6 xl:pl-16 xl:pr-8 min-[1536px]:pl-24 min-[1536px]:pr-12"
    : "lg:pr-12 lg:pl-6 xl:pr-16 xl:pl-8 min-[1536px]:pr-24 min-[1536px]:pl-12";

  return (
    <article
      className={`flex w-full flex-col items-center lg:min-h-[700px] lg:items-stretch ${
        even ? "lg:flex-row-reverse" : "lg:flex-row"
      }`}
    >
      {/* Image column — stack with flex-col so mobile+desktop sources never sit side-by-side. Breakpoint matches @theme --breakpoint-lg (1200px). */}
      <div className="flex w-full shrink-0 flex-col items-center justify-center max-[1199px]:w-full max-[1199px]:px-4 lg:w-[60%] lg:max-w-none lg:items-center lg:overflow-visible lg:px-0">
        {imageMobile ? (
          <>
            <div className="w-full max-[1199px]:block min-[1200px]:hidden">
              <Image
                src={imageMobile}
                alt={imageAlt}
                width={mobileW}
                height={mobileH}
                className="h-auto w-full max-h-[min(240px,42vh)] object-contain object-center"
                sizes="(max-width: 1199px) calc(100vw - 2rem), 1px"
                loading="lazy"
              />
            </div>
            <div className="hidden w-full min-[1200px]:block">
              <Image
                src={image}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                className="h-auto w-full object-contain"
                sizes="(max-width: 1199px) 1px, 60vw"
                loading="lazy"
              />
            </div>
          </>
        ) : (
          <Image
            src={image}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="h-auto w-full max-h-[min(240px,42vh)] object-contain object-center max-[1199px]:max-w-full min-[1200px]:max-h-none"
            sizes="(max-width: 1199px) calc(100vw - 2rem), 60vw"
            loading="lazy"
          />
        )}
      </div>

      {/* Text column — asymmetric horizontal padding only here */}
      <div
        className={`w-full max-w-[min(1100px,100%)] px-8 sm:px-0 md:py-14 lg:flex lg:w-[40%] lg:max-w-none lg:flex-col lg:justify-center lg:py-16 ${textColPadding}`}
      >
        <div className="mb-6 flex h-[70px] w-full items-center justify-center md:mt-12 lg:mt-0 lg:justify-start">
          <Image
            src={logo}
            alt={logoAlt}
            width={logoWidth}
            height={logoHeight}
            className="h-auto max-h-12 w-auto max-w-[min(200px,85vw)] object-contain sm:max-h-16 lg:max-h-16"
            loading="lazy"
          />
        </div>

        <h3 className="mx-auto mt-8 max-w-[52rem] text-center text-xl font-bold leading-[1.12] tracking-[-0.04em] text-black sm:mt-10 sm:text-2xl sm:leading-[1.08] md:mt-12 md:text-3xl md:leading-[1.06] lg:mx-0 lg:mt-8 lg:text-left lg:text-[42px] lg:leading-[1.05] xl:text-[45px]">
          {title}
        </h3>

        <p className="mx-auto mt-2 max-w-[48rem] text-center font-normal tracking-normal text-black max-[1199px]:text-[14px] max-[1199px]:leading-[1] min-[1200px]:mt-8 min-[1200px]:text-[16px] min-[1200px]:leading-normal md:mt-10 md:text-[20px] md:leading-[1.45] lg:mx-0 lg:text-left lg:leading-[30px]">
          {text}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-x-3 gap-y-2 text-center sm:mt-8 md:mt-10 lg:justify-start lg:text-left">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-sm font-normal text-black/55 sm:text-[13px] sm:text-black"
            >
              {tag}
            </span>
          ))}
        </div>

        {galleryHref ? (
          <Link
            href={galleryHref}
            className="mt-6 inline-flex items-center justify-center gap-2 text-[15px] font-medium text-black/50 transition-colors hover:text-black lg:justify-start"
          >
            <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.6875 12.1875C19.585 12.1875 20.3125 11.46 20.3125 10.5625C20.3125 9.665 19.585 8.9375 18.6875 8.9375C17.79 8.9375 17.0625 9.665 17.0625 10.5625C17.0625 11.46 17.79 12.1875 18.6875 12.1875Z" fill="currentColor"/>
              <path d="M23.5625 18.6875C23.5625 23.5479 23.5536 23.5625 18.6875 23.5625" stroke="currentColor" strokeWidth="1.24" strokeLinecap="round"/>
              <path d="M10.5625 23.5625C5.70213 23.5625 5.6875 23.5536 5.6875 18.6875" stroke="currentColor" strokeWidth="1.24" strokeLinecap="round"/>
              <path d="M5.6875 10.5625C5.6875 5.70213 5.69644 5.6875 10.5625 5.6875" stroke="currentColor" strokeWidth="1.24" strokeLinecap="round"/>
              <path d="M18.6875 5.6875C23.5479 5.6875 23.5625 5.69644 23.5625 10.5625" stroke="currentColor" strokeWidth="1.24" strokeLinecap="round"/>
            </svg>
            Gallery
          </Link>
        ) : null}
      </div>
    </article>
  );
}
