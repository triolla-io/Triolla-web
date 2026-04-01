type PartnerBtnProps = {
  href?: string;
  label?: string;
  className?: string;
  /** Smaller pill + type for CTAs under portfolio sections, etc. */
  size?: "default" | "compact";
};

export default function PartnerBtn({
  href = "#contactus",
  label = "Partner with us",
  className = "",
  size = "default",
}: PartnerBtnProps) {
  const sizeClass =
    size === "compact"
      ? "h-8 min-h-[32px] px-3 text-[13px] font-normal"
      : "h-9 min-h-[36px] px-4 text-[14px] font-normal min-[1024px]:h-[54px] min-[1024px]:min-h-[54px] min-[1024px]:px-10 min-[1024px]:text-[22px]";

  return (
    <a
      href={href}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-[50px] border border-black bg-black text-white cursor-pointer transition duration-300 ${sizeClass} ${className}`}
    >
      <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">
        {label}
      </span>
      <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
        {label}
      </span>
      <span className="absolute inset-0 bg-[#FED125] rounded-full scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-300" />
    </a>
  );
}
