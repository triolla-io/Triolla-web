export default function GradientBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="relative inline-flex items-center justify-center overflow-hidden rounded-full group text-white no-underline"
    >
      <span className="relative z-10 flex items-center justify-center px-5 lg:px-9 leading-[38px] lg:leading-[77px] text-[15px] lg:text-[27px] font-normal bg-gradient-to-r from-[#E7604D] to-[#5843DA] w-full transition-opacity duration-300 group-hover:opacity-0">
        {children}
      </span>
      <span className="absolute inset-0 flex items-center justify-center px-5 lg:px-9 text-[15px] lg:text-[27px] font-normal bg-gradient-to-r from-[#5843DA] to-[#E7604D] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {children}
      </span>
    </a>
  );
}
