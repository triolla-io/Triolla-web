"use client";

import Link from "next/link";

interface PartnerCtaButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export default function PartnerCtaButton({
  href,
  label = "Partner with us",
  className = "",
}: PartnerCtaButtonProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-[50px] border border-white hover:border-black h-[44px] px-5 text-[16px] sm:h-[77px] sm:px-[35px] sm:text-[27px] text-white font-medium no-underline ${className}`}
    >
      <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
        {label}
      </span>
      <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        {label}
      </span>
      <span className="absolute inset-0 bg-[#FED125] rounded-[50px] scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-300" />
    </Link>
  );
}
