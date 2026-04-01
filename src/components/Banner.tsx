import Image from "next/image";
import Link from "next/link";

interface BannerProps {
  subText?: string;
  title: string;
  boldText?: string;
  shortText?: string;
  buttonText?: string;
  buttonHref?: string;
  bgColor?: string;
  showGrid?: boolean;
  children?: React.ReactNode;
}

export default function Banner({
  subText,
  title,
  boldText,
  shortText,
  buttonText,
  buttonHref = "#contactus",
  bgColor = "#FED125",
  showGrid = true,
  children,
}: BannerProps) {
  return (
    <section
      className="relative min-h-[520px] lg:min-h-[620px] flex items-end overflow-hidden"
      style={{ background: bgColor }}
    >
      {/* Grid overlay decoration */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-50">
            <Image
              src="/images/banner_grid.svg"
              alt=""
              fill
              className="object-cover object-top"
              priority
            />
          </div>
          <div className="absolute top-0 right-0 h-full w-auto max-w-[600px]">
            <Image
              src="/images/portolio_layer.svg"
              alt=""
              width={600}
              height={600}
              className="h-full w-auto object-contain object-right"
              priority
            />
          </div>
        </div>
      )}

      <div className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-[60px] pb-[60px] pt-[160px] lg:pt-[220px]">
        {/* Sub text */}
        {subText && (
          <h4 className="text-[16px] lg:text-[20px] font-normal text-black mb-2 opacity-80">
            {subText}
          </h4>
        )}

        {/* Main title */}
        <h1 className="text-[56px] lg:text-[80px] xl:text-[100px] font-black text-black leading-[0.95] mb-8 tracking-tight">
          {title}
        </h1>

        {/* Content block */}
        {(boldText || shortText) && (
          <div className="max-w-[720px]">
            {boldText && (
              <p className="text-[20px] lg:text-[24px] font-bold text-black mb-3 leading-tight">
                {boldText}
              </p>
            )}
            {shortText && (
              <p className="text-[16px] lg:text-[18px] font-normal text-black/80 leading-relaxed">
                {shortText}
              </p>
            )}
          </div>
        )}

        {/* CTA Button */}
        {buttonText && (
          <div className="mt-8">
            <Link
              href={buttonHref}
              className="pill-btn px-8 py-3 text-[18px] lg:text-[20px] font-medium text-black inline-flex"
            >
              <span className="default-text">{buttonText}</span>
              <span className="hover-text">{buttonText}</span>
              <span className="btn-overlay" />
            </Link>
          </div>
        )}

        {children}

        {/* Decorative line */}
        <div className="mt-16 w-px h-[80px] bg-black mx-0 opacity-40" />
      </div>
    </section>
  );
}
