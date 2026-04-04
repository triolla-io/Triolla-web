"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { faqByLocale, faqSectionCopy, type FaqItem } from "@/messages/faq";
import { useLocale } from "@/components/LocaleProvider";

export type { FaqItem };

export default function FaqSection({ questions }: { questions?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const locale = useLocale();
  const faqs = questions ?? faqByLocale[locale];
  const head = faqSectionCopy[locale];

  return (
    <section className="bg-black w-full pt-[80px] sm:pt-[202px] px-5 sm:pl-[50px] sm:pr-0 pb-[120px] sm:pb-[299px]">
      <div className="max-w-[1460px] mx-auto">

        {/* Header */}
        <div className="pb-[40px] sm:pb-[88px] text-center">
          <h3 className="font-[550] text-[36px] sm:text-[clamp(52px,9.5vw,120px)] leading-[1] sm:leading-[clamp(46px,8vw,100px)] tracking-[-0.96px] text-center capitalize text-white m-0 pb-[16px] sm:pb-[29px]">
            {head.title}
          </h3>
          <p className="text-[18px] sm:text-[32px] leading-[1.3] sm:leading-none tracking-[-0.96px] text-center text-white">
            {head.subtitle}
          </p>
        </div>

        {/* FAQ items — matches .port_faq_box */}
        <div>
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={`w-[92%] mx-auto border-t border-b border-[#404040] [border-top:1px_solid_var(--faq-divider)]${i === faqs.length - 1 ? " [border-bottom:1px_solid_var(--faq-divider)]" : ""}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex items-center relative text-[14px] sm:text-[36px] leading-[1.3] sm:leading-none text-start text-white pt-[20px] pe-[32px] pb-[20px] sm:pt-[32px] sm:pe-[40px] sm:pb-[34px] ps-0 w-full bg-transparent border-0 cursor-pointer"
              >
                {/* Profile image */}
                <span className="w-[36px] sm:w-[50px] shrink-0 block">
                  <Image
                    src={faq.img}
                    alt=""
                    width={50}
                    height={50}
                    className="w-[36px] h-[36px] sm:w-[50px] sm:h-[50px] object-cover rounded-full"
                    loading="lazy"
                  />
                </span>
                {/* Question text */}
                <span className="flex-1 block ps-[14px] sm:ps-[61px] pt-[3px] sm:pt-[7px] text-start">
                  {faq.q}
                </span>
                {/* Plus/Minus icon */}
                <Image
                  src={openIndex === i ? "/images/faq_minus.svg" : "/images/faq_plus.svg"}
                  alt=""
                  width={openIndex === i ? 20 : 22}
                  height={openIndex === i ? 3 : 22}
                  className="absolute end-0 top-[50%] -translate-y-1/2 sm:top-[44px] sm:translate-y-0"
                  loading="lazy"
                />
              </button>

              {openIndex === i && (
                <div className="block pt-[4px] pb-[16px] sm:pb-[24px] ps-[50px] sm:ps-[112px] text-[13px] sm:text-[22px] leading-[1.4] sm:leading-none text-[#A9A9A9]">
                  <div className="max-w-[997px]">
                    <p className="m-0 pb-[16px] sm:pb-[20px] text-[13px] sm:text-[22px] leading-[1.4] sm:leading-none text-[#A9A9A9]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
