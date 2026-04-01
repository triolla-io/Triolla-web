"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface WhyCard {
  title: string;
  body?: string;
  text?: string;
}

interface WhyChooseUsSectionProps {
  heading: React.ReactNode;
  cards: WhyCard[];
  variant?: "dark" | "light";
}

/** One card tile — shared between mobile carousel and desktop grid */
function DarkWhyCard({ card }: { card: WhyCard }) {
  return (
    <div className="group h-full rounded-[26px] px-[12px] pb-[28px] pt-[28px] text-center transition-[background-color] duration-300 group-hover:bg-[#FED125] sm:px-[23px] sm:pb-[40px] sm:pt-[40px] lg:rounded-[44px] lg:border-[0.88px] lg:border-[#D5D5D5] lg:px-5 lg:pb-[57px] lg:pt-[66px] lg:group-hover:border-black">
      <h4 className="mb-[10px] whitespace-pre-line text-[15px] font-bold leading-tight text-white transition-colors duration-300 group-hover:text-black sm:mb-[16px] sm:text-[23px] sm:leading-[22px] md:max-lg:mb-[30px] md:max-lg:text-[30px] md:max-lg:leading-none lg:mb-[44px] lg:text-[39.34px] lg:leading-[38px]">
        {card.title}
      </h4>
      <p className="m-0 text-[11px] leading-[1.3] text-white transition-colors duration-300 group-hover:text-black sm:text-[13px] sm:leading-[16px] md:max-lg:px-2.5 md:max-lg:text-[20px] md:max-lg:leading-none lg:px-9 lg:text-[22px] lg:leading-[21.88px]">
        {card.body ?? card.text}
      </p>
    </div>
  );
}

export default function WhyChooseUsSection({
  heading,
  cards,
  variant = "dark",
}: WhyChooseUsSectionProps) {
  if (variant === "light") {
    return (
      <section className="bg-[#e7eaef] px-6 py-[80px] lg:px-[60px] lg:py-[120px]">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="mb-8 sm:mb-12 text-center text-[28px] sm:text-[42px] font-black text-black lg:text-[60px]">
            {heading}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, i) => (
              <div key={i} className="rounded-[24px] bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FED125] text-[18px] font-black">
                  {i + 1}
                </div>
                <h4 className="mb-3 text-[22px] font-bold leading-tight text-black sm:text-[24px] lg:text-[26px]">
                  {card.title}
                </h4>
                <p className="text-[15px] leading-relaxed text-black/60 sm:text-[16px]">
                  {card.body ?? card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ── dark variant ─────────────────────────────────────── */

  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const scrollToSlide = useCallback((index: number) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const containerLeft = el.getBoundingClientRect().left;
      let closest = 0;
      let minDist = Infinity;
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const dist = Math.abs(card.getBoundingClientRect().left - containerLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActive(closest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="bg-black pt-[60px] pb-[70px] sm:py-[100px] lg:py-[120px] xl:pt-[157px] xl:pb-[129px]">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-5 md:px-8 lg:px-10">

        {/* Heading — slides up + fades in (matches WP: bottom:-30 → 0, opacity:0 → 1, 1s) */}
        <motion.h3
          className="m-0 pb-9 text-center text-[30px] font-bold leading-[96%] text-white 2xs:text-[40px] sm:text-[68px] md:text-[100px] xl:text-[120px] 2xl:text-[160px]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {heading}
        </motion.h3>

        {/* ── Carousel below lg ── */}
        <motion.div
          className="lg:hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {Array.from({ length: Math.ceil(cards.length / 2) }, (_, si) => (
                <div
                  key={si}
                  ref={(el) => { cardRefs.current[si] = el; }}
                  className="flex w-full min-w-full shrink-0 snap-start gap-3"
                >
                  {cards.slice(si * 2, si * 2 + 2).map((card, ii) => (
                    <div key={ii} className="flex-1 min-w-0">
                      <DarkWhyCard card={card} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div
            className="mt-[25px] flex justify-center gap-[10px]"
            role="tablist"
            aria-label="Why us slides"
          >
            {Array.from({ length: Math.ceil(cards.length / 2) }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Slide ${i + 1} of ${Math.ceil(cards.length / 2)}`}
                onClick={() => scrollToSlide(i)}
                className="h-[4px] w-[19px] shrink-0 touch-manipulation rounded-full transition-colors"
                style={{ background: active === i ? "#FED932" : "#fff" }}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Desktop: 4-column grid with stagger (matches `pdesktp`) ── */}
        <motion.div
          className="hidden grid-cols-4 lg:mx-[-32px] lg:grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="group px-8 py-8"
            >
              <DarkWhyCard card={card} />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
