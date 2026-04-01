"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import HeroJumpSvgs from "@/components/HeroJumpSvgs";
import OurServicesSection from "@/components/OurServicesSection";
import ScrollReveal from "@/components/ScrollReveal";
import DesignProcessSection from "@/components/DesignProcessSection";
import LearnExploreGrowSection from "@/components/LearnExploreGrowSection";
import FaqSection from "@/components/FaqSection";
import ClientLogosSection from "@/components/ClientLogosSection";
import PageBottomSection from "@/components/PageBottomSection";

const whyUsItems = [
  {
    img: "/images/One.svg",
    title: <>Design a<br /> new product</>,
    desc: <>Design and develop an<br /> industry leading product</>,
  },
  {
    img: "/images/Two.svg",
    title: "Improve an existing product",
    desc: "Upgrade, redesign and turn your product into a category leader",
  },
  {
    img: "/images/Three.svg",
    title: "First Steps for Start-ups",
    desc: <>Take your vision from<br /> concept to launch</>,
  },
  {
    img: "/images/Four.svg",
    title: "Product consulting",
    desc: <>Accelerate your strategic<br /> planning process</>,
  },
];

const designSteps = [
  "Kickoff \nMeeting",
  "Research & \nCompetitive \nanalysis",
  "User \ninterview",
  "Brain storming \nIdeate phase \nBuild usecase \n+ Flow",
  "Detailed \nWireframes",
  "User \nTesting",
  "Concepts \nDesign",
  "Detailed \nDesign",
];

export default function AboutUsPage() {
  const [moreText, setMoreText] = useState(false);
  return (
    <div>
      {/* ── HERO BANNER ── */}
      <section className="relative bg-[#FED125] pt-[100px] sm:pt-[170px] lg:pt-[266px] pb-5 sm:pb-[100px] lg:pb-[52px]">
        {/* Background grid — overflow-hidden scoped to avoid clipping jump SVGs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image src="/images/banner_grid.svg" alt="" fill className="object-cover" priority />
        </div>

        {/* Content + jump SVGs outside overflow-hidden */}
        <div className="relative max-w-[1214px] mx-auto px-5 sm:px-[30px] lg:px-[150px]">
          <HeroJumpSvgs />

          <div className="relative text-center">
            <motion.h1
              className="font-bold text-[44px] xs:text-[77px] sm:text-[96px] md:text-[138px] lg:text-[180px] xl:text-[260px] leading-[0.85] text-black m-0 pb-[25px] sm:pb-[40px] lg:pb-[70px] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              About Triolla
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="font-bold text-[16px] sm:text-[22px] lg:text-[32px] leading-none sm:leading-[1.3] lg:leading-[37px] tracking-[-0.96px] text-center text-black">
                From Concept Design to Product Launch
              </div>
              <p className="font-light text-[16px] sm:text-[22px] lg:text-[32px] leading-none sm:leading-[1.3] lg:leading-[37px] tracking-[-0.96px] text-center text-black mt-2">
                Your dream team for product UX/UI, AI Partner, front &amp; back-end dev brains.
                {!moreText && (
                  <>
                    <span className="inline-block align-top">...</span>
                    <button
                      className="inline-block pl-2.5 bg-transparent border-0 cursor-pointer align-middle leading-none"
                      onClick={() => setMoreText(true)}
                      aria-label="Show more"
                    >
                      <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.25749 8.24168L1.25749 2.24168C0.847439 1.83163 0.847439 1.16681 1.25749 0.756757C1.66754 0.346706 2.33236 0.346706 2.74241 0.756757L7.99995 6.01429L13.2575 0.756757C13.6675 0.346706 14.3324 0.346706 14.7424 0.756757C15.1525 1.16681 15.1525 1.83163 14.7424 2.24168L8.74241 8.24168C8.33236 8.65173 7.66754 8.65173 7.25749 8.24168Z" fill="black" />
                      </svg>
                    </button>
                  </>
                )}
              </p>
              {moreText && (
                <div className="block">
                  <p className="font-light text-[16px] sm:text-[22px] lg:text-[32px] leading-none sm:leading-[1.3] lg:leading-[37px] tracking-[-0.96px] text-center text-black">
                    Our elite Product design team together with Technology Department is the engine behind some of the most innovative digital products in Israel and beyond.{" "}
                    <br /><br />
                    We partner with unicorns, high-growth startups, and industry leaders to turn ambitious ideas into scalable, secure, and high-performing solutions.
                    <button
                      className="inline-block pl-2.5 bg-transparent border-0 cursor-pointer align-middle leading-none"
                      onClick={() => setMoreText(false)}
                      aria-label="Show less"
                    >
                      <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-180">
                        <path d="M7.25749 8.24168L1.25749 2.24168C0.847439 1.83163 0.847439 1.16681 1.25749 0.756757C1.66754 0.346706 2.33236 0.346706 2.74241 0.756757L7.99995 6.01429L13.2575 0.756757C13.6675 0.346706 14.3324 0.346706 14.7424 0.756757C15.1525 1.16681 15.1525 1.83163 14.7424 2.24168L8.74241 8.24168C8.33236 8.65173 7.66754 8.65173 7.25749 8.24168Z" fill="black" />
                      </svg>
                    </button>
                  </p>
                </div>
              )}
            </motion.div>

            {/* Decorative vertical line */}
            <div className="h-[64px] sm:h-[104px] w-px bg-black mx-auto mt-[27px] sm:mt-[59px]" />
          </div>
        </div>
      </section>

      {/* ── ABOUT ONE ── */}
      <section className="bg-black pt-[36px] pb-0 px-6 sm:pt-[100px] sm:pb-[70px] sm:px-5 md:pt-[200px] md:pb-[124px]">
        <div className="mx-auto flex max-w-full flex-col items-start md:flex-row md:items-start gap-x-[42px] gap-y-10 xl:gap-x-16 2xl:gap-x-24 sm:max-w-[88%] 2xl:max-w-[1628px]">
          {/* Desktop image column — matches triolla.io: two photos stacked (no ab1 hero strip) */}
          <motion.div
            className="hidden w-full shrink-0 sm:block md:w-[45%] xl:w-[756px] xl:max-w-[756px] xl:pl-5 2xl:pl-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="flex w-full flex-col gap-7 md:gap-9">
              <Image
                src="/images/ab2.png"
                alt=""
                width={383}
                height={382}
                sizes="(min-width: 1280px) 756px, (min-width: 768px) 40vw, 90vw"
                className="block h-auto w-full max-w-full rounded-[70px]"
              />
              <Image
                src="/images/ab3.png"
                alt=""
                width={231}
                height={236}
                sizes="(min-width: 1280px) 756px, (min-width: 768px) 40vw, 90vw"
                className="block h-auto w-full max-w-full rounded-[70px]"
              />
            </div>
          </motion.div>

          {/* Right text column */}
          <div className="w-full min-w-0 md:w-[51%] md:flex-none xl:flex-1 sm:pt-[40px] md:pt-[35px] xl:pt-2 xl:pl-2 2xl:pl-4">
            <ScrollReveal direction="up">
              <div className="mb-[44px] sm:mb-[35px]">
                <h3 className="text-[36px] leading-[38px] xs:text-[44px] xs:leading-[44px] md:text-[58px] md:leading-[60px] lg:text-[62px] lg:leading-[64px] xl:text-[72px] xl:leading-[72px] 2xl:text-[78px] 2xl:leading-[69px] text-white font-semibold tracking-[-0.79px] mb-[15px] md:mb-[22px]">
                  Triolla: Crafting digital products through design and technology excellence
                </h3>
                <p className="text-[15px] leading-[19px] xs:text-[17px] xs:leading-[20px] md:text-[28px] md:leading-[32px] xl:text-[39px] xl:leading-[41px] text-white tracking-[-0.79px] font-normal">
                  Over 65+ design experts &amp; full stack dev teams, over a decade of experience, we craft high-impact apps and platforms for top global brands.
                </p>
              </div>
            </ScrollReveal>
            <div>
              <ScrollReveal direction="up" delay={0.1}>
                <div className="mb-[45px] sm:mb-[34px]">
                  <div className="mb-[19px]">
                    <span className="text-[16px] leading-none block text-white font-medium opacity-50 xs:text-[20px] xs:leading-[27px] pb-[5px] xs:pb-0">Part of</span>
                    <Image src="/images/ablogo1.svg" alt="" width={200} height={60} className="block" />
                  </div>
                  <p className="text-[14px] leading-[18px] xs:text-[16px] xs:leading-[20px] md:text-[18px] md:leading-[24px] xl:text-[24px] xl:leading-[30px] text-white tracking-[-0.79px] font-normal">
                    Triolla has been acquired by SQLink, one of Israel&apos;s Big Five integrators with over 2,800 employees—giving us a powerful backbone and the confidence to scale bigger, bolder, and smarter.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={0.2}>
                <div>
                  <div className="mb-[19px]">
                    <span className="block text-white font-medium opacity-50">&nbsp;</span>
                    <Image src="/images/ablogo2.png" alt="" width={200} height={60} className="block" />
                  </div>
                  <p className="text-[14px] leading-[18px] xs:text-[16px] xs:leading-[20px] md:text-[18px] md:leading-[24px] xl:text-[24px] xl:leading-[30px] text-white tracking-[-0.79px] font-normal">
                    We also run Triolla Academy, training the next generation of product designers, product and project managers.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Mobile — same two-photo stack as production */}
          <motion.div
            className="mt-[70px] xs:mt-[150px] flex w-full flex-col gap-4 pt-[31px] sm:hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true, margin: "-40px" }}
          >
            <Image
              src="/images/ab2.png"
              alt=""
              width={383}
              height={382}
              sizes="100vw"
              className="block h-auto w-full rounded-[20px]"
            />
            <Image
              src="/images/ab3.png"
              alt=""
              width={231}
              height={236}
              sizes="100vw"
              className="block h-auto w-full rounded-[20px]"
            />
          </motion.div>

        </div>
      </section>

      <OurServicesSection />

      {/* ── WHY US ── */}
      <section className="bg-[#080808] py-[38px] px-0 sm:py-[70px] md:py-[140px] md:px-5">
        <div className="mx-auto max-w-full lg:max-w-[88%] 2xl:max-w-[1650px]">
          <div className="max-w-[1214px] mx-auto text-center pb-0 px-[18px] mb-[44px] sm:pb-[114px] sm:px-0 sm:mb-0">
            <motion.h3
              className="text-[46px] leading-[46px] mb-[24px] sm:text-[80px] sm:leading-[80px] sm:mb-[43px] md:text-[100px] md:leading-[1.1] lg:text-[80px] lg:leading-[80px] 2xl:text-[120px] 2xl:leading-[113px] font-bold text-white tracking-[-0.96px]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
            >
              Why startups<br /> &amp; global high-tech partner with us...
            </motion.h3>
            <motion.p
              className="text-[16px] leading-[20px] sm:text-[32px] sm:leading-[37px] text-white font-normal"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: "-80px" }}
            >
              Companies choose triolla for our deep expertise, extensive experience, and the industry&#8217;s most talented people. We offer specialized departments in Cyber, Fintech, Medical, and Gaming, ensuring top-tier solutions for complex platforms.
            </motion.p>
          </div>

          <div className="px-[18px] sm:px-0">
            <motion.ul
              className="list-none p-0 m-0 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            >
              {whyUsItems.map((item, i) => (
                <motion.li
                  key={i}
                  className="flex flex-col sm:flex-none sm:flex-[0_0_calc(50%-12px)] sm:max-w-[calc(50%-12px)] lg:flex-[0_0_calc(25%-18px)] lg:max-w-none"
                  variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-col h-full rounded-[30px] sm:rounded-[49px] border border-[#D5D5D5]">
                    <div className="flex flex-col flex-1 px-5 pt-[26px] pb-[37px]">
                      <div className="flex items-center justify-center w-full mb-[22px] h-[154px]">
                        <Image src={item.img} alt="" width={154} height={154} style={{ maxHeight: 154, width: "auto" }} />
                      </div>
                      <div className="text-center">
                        <h5 className="text-[23px] leading-[25px] min-h-[75px] sm:text-[38px] sm:leading-[42px] sm:min-h-[126px] text-[#E7EBF0] font-bold mb-[5px] capitalize">
                          {item.title}
                        </h5>
                        <p className="text-[14px] leading-[13px] tracking-[-0.36px] sm:text-[19px] sm:leading-[22px] sm:tracking-[-0.59px] text-white font-normal m-0">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <ScrollReveal direction="up" delay={0.1}>
            <div className="text-center mt-[33px] md:mt-[100px] 2xl:mt-[244px]">
              <Link
                href="/contact-us/"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-[42px] border border-white hover:border-black h-[44px] px-5 text-[16px] sm:h-[77px] sm:px-[35px] sm:text-[27px] text-white font-medium no-underline"
              >
                <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-0">Partner with us</span>
                <span className="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">Partner with us</span>
                <span className="absolute inset-0 bg-[#FED125] rounded-[42px] scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left transition-transform duration-300" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── UNIQUE DESIGN PROCESS ── */}
      <DesignProcessSection
        title={<>Our unique <br /><span>Design</span> Process</>}
        description="Our unique design process blends deep user insight with creative strategy to craft digital experiences that truly stand out."
        steps={designSteps}
      />

      <LearnExploreGrowSection />

      {/* ── OUR CLIENTS ── */}
      <ClientLogosSection />

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── BOTTOM GRID + CONTACT ── */}
      <PageBottomSection />
    </div>
  );
}
