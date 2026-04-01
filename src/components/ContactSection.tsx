"use client";

import ContactForm from "./ContactForm";
import Image from "next/image";
import { useLocale } from "@/components/LocaleProvider";
import { contactSectionCopy } from "@/messages/contact";

const trustedLogos = [
  { src: "/images/trusted1.svg", alt: "Trusted partner 1" },
  { src: "/images/trusted2.svg", alt: "Trusted partner 2" },
  { src: "/images/trusted3.svg", alt: "Trusted partner 3" },
  { src: "/images/trusted4.svg", alt: "Trusted partner 4" },
];

export default function ContactSection() {
  const locale = useLocale();
  const c = contactSectionCopy[locale];

  return (
    <section
      id="contactus"
      className="py-[60px] px-6 lg:px-[20px] bg-white relative"
      style={{
        backgroundImage:
          "image-set(url(/images/portfolio_grid_bg-old.jpg) type('image/jpeg') 1x, url(/images/portfolio_grid_bg-old.png) type('image/png') 1x)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundSize: "contain",
      }}
    >
      <div className="max-w-[1485px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="lg:w-[44%] pt-[42px]">
            <h3 className="text-[40px] sm:text-[48px] lg:text-[64px] font-black leading-[0.95] mb-6 sm:mb-8 tracking-tight">
              {c.title}
            </h3>

            <div className="mb-6">
              <h4 className="text-[18px] lg:text-[20px] font-bold mb-2">{c.callUs}</h4>
              <p className="text-[18px] lg:text-[20px]">
                {c.tlv}{" "}
                <a href="tel:073-7443322" className="hover:text-[#FED125] transition-colors">
                  073-7443322
                </a>
              </p>
            </div>

            <div className="mb-6">
              <h4 className="text-[18px] lg:text-[20px] font-bold mb-2">{c.email}</h4>
              <p className="text-[18px] lg:text-[20px]">
                <a href="mailto:studio@triolla.io" className="hover:text-[#FED125] transition-colors">
                  studio@triolla.io
                </a>
              </p>
              <p className="text-[18px] lg:text-[20px] mt-1">
                <strong>{locale === "he" ? "משרד:" : "Office:"}</strong>{" "}
                {locale === "he" ? "רעננה, זרחין 2 — קומה 6" : "Raanana, Zarchin 2 - 6th floor"}
              </p>
            </div>

            <div className="mt-10">
              <h5 className="text-[18px] lg:text-[20px] font-medium mb-4">{c.trusted}</h5>
              <ul className="flex flex-wrap gap-6 items-center">
                {trustedLogos.map((logo, i) => (
                  <li key={i}>
                    <div className="flex items-center justify-center h-[45px]">
                      <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={80}
                        height={40}
                        className="max-h-[40px] w-auto object-contain"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:w-[42%] bg-[#FED125] rounded-[16px] lg:rounded-[20px] px-5 sm:px-6 md:px-8 lg:px-12 xl:px-[56px] py-7 sm:py-9 lg:py-12">
            <ContactForm dark showPhone />
          </div>
        </div>
      </div>
    </section>
  );
}
