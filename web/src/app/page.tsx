"use client";

import Image from "next/image";
import FaqSection from "@/components/FaqSection";
import ClientLogosSection from "@/components/ClientLogosSection";
import PageBottomSection from "@/components/PageBottomSection";
import ScrollReveal from "@/components/ScrollReveal";
import PartnerCtaButton from "@/components/PartnerCtaButton";
import DesignProcessSection from "@/components/DesignProcessSection";
import HeroCollage, { type HeroImage } from "@/components/HeroCollage";
import { motion } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { withLocalePrefix } from "@/lib/i18n";
import { home } from "@/messages/home";

const whyUsImgs = ["Triola_anim_-44444.svg", "Triola_anim_-111111.svg", "Triola_anim_-33333.svg", "Triola_anim_-2222.svg"];

const winnerImgs = [
  { img: "Group-1410103661.png", w: 295, h: 258 },
  { img: "Group-1410103660.png", w: 294, h: 257 },
  { img: "Group-1410103662.png", w: 295, h: 258 },
];

const heroImages: HeroImage[] = [
  { src: "2.png", w: 1124, h: 750, cls: "hometopimage1", delay: 0.1, from: "left" },
  { src: "1.png", w: 419, h: 750, cls: "hometopimage2", delay: 0.25, from: "right" },
  { src: "medicak-ipad.png", w: 951, h: 1234, cls: "hometopimage3", delay: 0.15, from: "up" },
  { src: "3.png", w: 723, h: 979, cls: "hometopimage4", delay: 0.3, from: "right" },
  { src: "final_watch6.svg", w: 406, h: 548, cls: "hometopimage5", delay: 0.2, from: "up", float: true },
  { src: "6.png", w: 1307, h: 964, cls: "hometopimage6", delay: 0.05, from: "left" },
  { src: "Front-cloean-1.png", w: 533, h: 1003, cls: "hometopimage7", delay: 0.35, from: "right" },
  { src: "88.png", w: 548, h: 1025, cls: "hometopimage8", delay: 0.4, from: "up" },
  { src: "White-1.png", w: 830, h: 1192, cls: "hometopimage9", delay: 0.45, from: "up" },
];

export default function HomePage() {
  const locale = useLocale();
  const m = home[locale];
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const CARD_W = 224;
  const CARD_GAP = 12;
  const CARD_SLOT = CARD_W + CARD_GAP;
  const SET_W = m.whyCards.length * CARD_SLOT;

  useEffect(() => {
    if (carouselRef.current) carouselRef.current.scrollLeft = SET_W;
  }, [SET_W]);

  const onCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    // Infinite loop: silently jump when near edges
    if (el.scrollLeft < CARD_SLOT / 2) {
      el.scrollLeft += SET_W;
    } else if (el.scrollLeft >= SET_W * 2 - CARD_SLOT / 2) {
      el.scrollLeft -= SET_W;
    }
    const index = Math.round(el.scrollLeft / CARD_SLOT) % m.whyCards.length;
    setActiveCard(index);
  }, [CARD_SLOT, SET_W, m.whyCards.length]);

  return (
    <>
      <section className="pt-[130px] sm:pt-[140px] lg:pt-[262px]" style={{ background: "#FED125", position: "relative", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", top: "12%", right: 0, maxWidth: 1785, pointerEvents: "none", zIndex: 0 }}>
          <Image src="/images/homeecla1.svg" alt="" width={1785} height={2118} className="w-full" />
        </div>
        <div style={{ position: "absolute", bottom: "3%", left: "-4%", maxWidth: 1807, pointerEvents: "none", zIndex: 0 }}>
          <Image src="/images/homeecla2.svg" alt="" width={1807} height={2302} className="w-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: 1550, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1, padding: "0 20px" }}
        >
          <div className="homeinmobtop">{m.heroEyebrow}</div>
          <h1
            className="hero-h1"
            dir={locale === "he" ? "rtl" : "ltr"}
            style={{
              letterSpacing: 0,
              textAlign: "center",
              color: "#000",
              padding: 0,
              margin: "0 0 43px 0",
            }}
          >
            {m.heroH1Line1}
            <br />
            {m.heroH1Line2}
          </h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <p className="hero-h2" style={{ textAlign: "center", color: "#000", margin: 0 }}>
              {m.heroSub}
            </p>
          </motion.div>
        </motion.div>

        <HeroCollage images={heroImages} />
      </section>

      <section className="bg-[#080808] py-[48px] px-0 sm:py-[80px] lg:py-[140px] md:px-5">
        <div className="mx-auto max-w-full lg:max-w-[88%] 2xl:max-w-[1650px]">
          <ScrollReveal direction="up">
            <div className="max-w-[1214px] mx-auto text-center px-[18px] mb-[40px] sm:px-0 sm:mb-[60px] lg:mb-[114px]">
              <h3 className="text-[40px] leading-[1.1] mb-[20px] sm:text-[64px] sm:leading-[1.1] sm:mb-[32px] lg:text-[85px] lg:leading-[85px] lg:mb-[43px] font-bold text-white tracking-[-0.96px] whitespace-pre-line">
                {m.whyTitle}
              </h3>
              <p className="text-[18px] leading-[1.4] sm:text-[24px] sm:leading-[1.4] lg:text-[32px] lg:leading-[37px] text-white font-normal">{m.whySub}</p>
            </div>
          </ScrollReveal>

          {/* Mobile carousel — infinite loop via tripled cards */}
          <div
            ref={carouselRef}
            onScroll={onCarouselScroll}
            className="overflow-x-auto -mx-[18px] px-[18px] sm:mx-0 sm:px-0 sm:overflow-x-visible sm:hidden"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          >
            <ul className="list-none p-0 m-0 flex flex-row gap-3">
              {[...m.whyCards, ...m.whyCards, ...m.whyCards].map((card, i) => (
                <li key={i} className="flex flex-col flex-shrink-0 w-[224px] h-[333px]">
                  <div className="flex flex-col h-full rounded-[24px] border border-[#D5D5D5]">
                    <div className="flex flex-col flex-1 px-4 pt-[18px] pb-[24px]">
                      <div className="flex items-center justify-center w-full mb-[14px] h-[100px]">
                        <Image src={`/images/${whyUsImgs[i % m.whyCards.length]}`} alt={card.title} width={100} height={100} style={{ maxHeight: 100, width: "auto" }} />
                      </div>
                      <div className="text-center">
                        <h5 className="text-[20px] leading-[1.2] text-[#E7EBF0] font-bold mb-[6px] capitalize">{card.title}</h5>
                        <p className="text-[13px] leading-[1.4] text-white font-normal m-0">{card.text}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Desktop/tablet grid — sm+ */}
          <div className="hidden sm:block px-0">
            <ul className="list-none p-0 m-0 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {m.whyCards.map((card, i) => (
                <ScrollReveal key={i} delay={i * 0.1} as="li" className="flex flex-col">
                  <div className="flex flex-col h-full rounded-[49px] border border-[#D5D5D5]">
                    <div className="flex flex-col flex-1 px-5 pt-[26px] pb-[37px]">
                      <div className="flex items-center justify-center w-full mb-[22px] h-[154px]">
                        <Image src={`/images/${whyUsImgs[i]}`} alt={card.title} width={130} height={130} style={{ maxHeight: 154, width: "auto" }} />
                      </div>
                      <div className="text-center">
                        <h5 className="text-[30px] leading-[1.2] lg:text-[38px] lg:leading-[42px] text-[#E7EBF0] font-bold mb-[8px] capitalize">{card.title}</h5>
                        <p className="text-[16px] leading-[1.5] lg:text-[19px] lg:leading-[22px] lg:tracking-[-0.59px] text-white font-normal m-0">{card.text}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </ul>
          </div>
          {/* 2-line indicator — mobile only */}
          <div className="flex justify-center gap-[6px] mt-3 sm:hidden">
            <span className={`block h-[3px] w-[22px] rounded-[360px] transition-all duration-300 ${activeCard < 2 ? "bg-[#FED125]" : "bg-[#FED125]/30"}`} />
            <span className={`block h-[3px] w-[22px] rounded-[360px] transition-all duration-300 ${activeCard >= 2 ? "bg-[#FED125]" : "bg-[#FED125]/30"}`} />
          </div>

          <ScrollReveal delay={0.2} className="text-center mt-[40px] sm:mt-[60px] lg:mt-[100px]">
            <PartnerCtaButton
              href={withLocalePrefix("/contact-us/", locale)}
              label={locale === "he" ? "שותפו איתנו" : "Partner with us"}
            />
          </ScrollReveal>
        </div>
      </section>

      <div id="winners-section">
        <div className="winners-content">
          <ScrollReveal>
            <h3 className="winners-title">{m.winnersTitle}</h3>
            <div className="winners-subtitle">{m.winnersSubtitle}</div>
          </ScrollReveal>
          <div className="winner-boxes">
            {winnerImgs.map((box, i) => (
              <ScrollReveal key={i} delay={i * 0.15} className="wbox-item">
                <div className="wbox-img">
                  <Image src={`/images/${box.img}`} alt={m.winnerBoxes[i].title} width={box.w} height={box.h} />
                </div>
                <div className="wbox-title">{m.winnerBoxes[i].title}</div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <ClientLogosSection />

      <DesignProcessSection title={m.designTitle} description={m.designDescription} steps={m.designSteps} />

      <FaqSection />

      <PageBottomSection />
    </>
  );
}
