"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import HeroJumpSvgs from "@/components/HeroJumpSvgs";
import FaqSection from "@/components/FaqSection";
import ClientLogosSection from "@/components/ClientLogosSection";
import PageBottomSection from "@/components/PageBottomSection";

const productDesignLinks = [
  { href: "/services/product-ux-ui-design/", label: "Product UX/UI Design" },
  { href: "/services/ux-research/", label: "UX Research" },
  { href: "/services/ui-design/", label: "UI Design" },
  { href: "/services/wireframing/", label: "Wireframing" },
  { href: "/services/prototyping/", label: "Prototyping" },
  { href: "/services/user-testing/", label: "User Testing" },
  { href: "/services/design-system-creation/", label: "Design System Creation" },
  { href: "/services/product-stars/", label: "Product Stars" },
];

const brandingLinks = [
  { href: "/services/creative-concept/", label: "Creative concept" },
  { href: "/services/logo-design/", label: "Logo Design" },
  { href: "/services/character-design/", label: "Character Design" },
  { href: "/services/presentations/", label: "Presentations" },
  { href: "/services/motion-design/", label: "Motion Design" },
];

export default function ServicesPage() {
  const [moreText, setMoreText] = useState(false);

  return (
    <div>

      {/* ── S1: HERO BANNER ─────────────────────────────────── */}
      <section className="relative bg-[#FED125] pt-[140px] lg:pt-[229px] pb-[37px] sm:pb-[45px] overflow-visible z-[1]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image src="/images/banner_grid.svg" alt="" fill className="object-cover object-top opacity-60" priority />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/portolio_layer.svg" alt="" style={{ position: "absolute", top: 0, right: 0, height: "100%", width: "auto" }} />
        </div>

        <div className="relative max-w-[1214px] mx-auto px-5 sm:px-[30px] md:px-[80px] lg:px-[150px]">
          <HeroJumpSvgs />

          <div className="text-center">
            <motion.p
              className="text-[20px] font-normal text-black text-center m-0 mb-[10px]"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            >
              Product UX/UI design for
            </motion.p>

            <motion.h1
              className="font-bold max-[399px]:text-[60px] text-[77px] min-[1024px]:text-[138px] lg:text-[180px] min-[1440px]:text-[260px] leading-[0.85] text-black text-center m-0"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            >
              Our Services
            </motion.h1>

            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
            >
              <p className="font-bold text-[22px] md:text-[32px] leading-[1.15] tracking-[-0.96px] text-black m-0">
                Design it. Build it. Launch it.
              </p>
              <p className="font-light text-[16px] md:text-[22px] lg:text-[32px] leading-[1.15] tracking-[-0.96px] text-black mt-2">
                We&apos;re your dream team for UX/UI, front-end magic, and back-end brains.
                {!moreText && (
                  <>
                    <span>...</span>
                    <button
                      onClick={() => setMoreText(true)}
                      aria-label="Show more"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-black/30 ml-2 align-middle hover:bg-black/10 transition-colors"
                    >
                      <svg width="12" height="7" viewBox="0 0 16 9" fill="none"><path d="M7.25749 8.24168L1.25749 2.24168C0.847439 1.83163 0.847439 1.16681 1.25749 0.756757C1.66754 0.346706 2.33236 0.346706 2.74241 0.756757L7.99995 6.01429L13.2575 0.756757C13.6675 0.346706 14.3324 0.346706 14.7424 0.756757C15.1525 1.16681 15.1525 1.83163 14.7424 2.24168L8.74241 8.24168C8.33236 8.65173 7.66754 8.65173 7.25749 8.24168Z" fill="black" /></svg>
                    </button>
                  </>
                )}
              </p>
              {moreText && (
                <p className="font-light text-[16px] md:text-[22px] lg:text-[32px] leading-[1.15] tracking-[-0.96px] text-black mt-2">
                  At Triolla, we deliver end-to-end product design, UX/UI, branding, and development services across multiple verticals&mdash;including cybersecurity, gaming, medical, IoT, and B2B platforms. Our multidisciplinary team specializes in crafting intuitive user experiences, innovative interfaces, and strong brand identities for complex digital products&mdash;ranging from SOC dashboards and red team tools, to medical devices, smart IoT solutions, enterprise SaaS, and interactive gaming platforms.
                  <button
                    onClick={() => setMoreText(false)}
                    aria-label="Show less"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-black/30 ml-2 align-middle rotate-180 hover:bg-black/10 transition-colors"
                  >
                    <svg width="12" height="7" viewBox="0 0 16 9" fill="none"><path d="M7.25749 8.24168L1.25749 2.24168C0.847439 1.83163 0.847439 1.16681 1.25749 0.756757C1.66754 0.346706 2.33236 0.346706 2.74241 0.756757L7.99995 6.01429L13.2575 0.756757C13.6675 0.346706 14.3324 0.346706 14.7424 0.756757C15.1525 1.16681 15.1525 1.83163 14.7424 2.24168L8.74241 8.24168C8.33236 8.65173 7.66754 8.65173 7.25749 8.24168Z" fill="black" /></svg>
                  </button>
                </p>
              )}
            </motion.div>

            {/* Horizontal rule */}
            <div className="w-[1px] h-[103px] bg-black rounded-full mx-auto mt-[27px]" />
          </div>
        </div>
      </section>

      {/* ── S2: PRODUCT DESIGN ──────────────────────────────── */}
      <section className="py-[140px] px-5 bg-black max-[767px]:pt-[51px] max-[767px]:pb-[90px]">
        <ScrollReveal direction="up">
          <div className="text-center max-w-[1214px] mx-auto pb-[70px] max-[767px]:pb-[22px] max-[767px]:px-[30px]">
            <h3 className="text-[42px] sm:text-[46px] md:text-[100px] lg:text-[120px] font-bold text-white leading-none sm:leading-[48px] md:leading-[90px] lg:leading-[100px] m-0 mb-5 md:mb-[33px]">
              <a href="" className="text-white no-underline">Product Design</a>
            </h3>
            <p className="text-[16px] md:text-[32px] font-light leading-[20px] md:leading-[37px] tracking-[-0.96px] text-white m-0">
              Whether you need a complete redesign or are starting from scratch, we can help you create a digital experience that will delight your users and drive business success.
            </p>
          </div>
        </ScrollReveal>

        {/* Body: images left + links right */}
        <div className="max-w-[1640px] mx-auto flex flex-col lg:flex-row items-start">

          {/* Links (mobile: top, desktop: right) */}
          <div className="lg:hidden w-full px-[40px] text-center mb-[25px]">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 m-0 p-0 list-none">
              {productDesignLinks.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-[16px] text-white leading-[22px] no-underline hover:underline">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Image grid */}
          <div className="flex-1 max-w-[1060px] pt-[50px] max-lg:w-full max-[767px]:relative max-[767px]:min-h-[430px] max-[767px]:pt-0 max-[767px]:overflow-visible">

            {/* Row 1: natural size, centered */}
            <div className="max-[767px]:absolute max-[767px]:top-0 max-[767px]:right-[3px] max-[767px]:w-[155px]">
              <Image src="/images/proddes1.png" alt="" width={330} height={170}
                className="h-auto block mx-auto shadow-[0px_3.76px_7.52px_0px_#00000040]" />
            </div>

            {/* Row 2: two images side by side */}
            <div className="flex items-start gap-4 pl-[136px] pr-[35px] mt-4
              max-[767px]:pl-0 max-[767px]:pr-0 max-[767px]:block">
              <div className="max-[767px]:absolute max-[767px]:w-[195px] max-[767px]:top-[100px] max-[767px]:left-[20px]">
                <Image src="/images/proddes2.png" alt="" width={413} height={292} className="h-auto block" />
              </div>
              <div className="mt-5 max-[767px]:absolute max-[767px]:w-[225px] max-[767px]:top-[113px] max-[767px]:right-[-153px] max-[767px]:mt-0">
                <Image src="/images/proddes3.png" alt="" width={424} height={312} className="h-auto block" />
              </div>
            </div>

            {/* Row 3: three images */}
            <div className="flex items-start gap-[30px] mt-4 max-[767px]:block">
              <div className="max-[767px]:absolute max-[767px]:top-[278px] max-[767px]:left-[-67px] max-[767px]:w-[176px]">
                <Image src="/images/proddes4.png" alt="" width={282} height={107} className="h-auto block" />
              </div>
              <div className="mt-[30px] max-[767px]:absolute max-[767px]:top-[299px] max-[767px]:left-[119px] max-[767px]:w-[138px] max-[767px]:mt-0">
                <Image src="/images/proddes5.png" alt="" width={293} height={246} className="h-auto block" />
              </div>
              <div className="mt-[54px] max-[767px]:absolute max-[767px]:right-[-185px] max-[767px]:top-[317px] max-[767px]:w-[236px] max-[767px]:mt-0">
                <Image src="/images/proddes6.png" alt="" width={409} height={155} className="h-auto block" />
              </div>
            </div>

            {/* Row 4: three small icons, right-aligned */}
            <div className="flex items-start justify-end gap-[18px] pr-[70px] -mt-[30px]
              max-[767px]:block max-[767px]:pr-0 max-[767px]:mt-0">
              <div className="max-[767px]:hidden">
                <Image src="/images/proddes7.png" alt="" width={101} height={101} className="h-auto block" />
              </div>
              <div className="max-[767px]:absolute max-[767px]:top-[12px] max-[767px]:left-[10px] max-[767px]:w-[65px]">
                <Image src="/images/proddes8.png" alt="" width={100} height={101} className="h-auto block" />
              </div>
              <div className="max-[767px]:absolute max-[767px]:top-[12px] max-[767px]:left-[86px] max-[767px]:w-[65px]">
                <Image src="/images/proddes9.png" alt="" width={101} height={101} className="h-auto block" />
              </div>
            </div>
          </div>

          {/* Links sidebar (desktop only) */}
          <ScrollReveal direction="up" delay={0.16} className="hidden lg:block w-[340px] shrink-0 pt-[154px] pl-8">
            <ul className="m-0 p-0 list-none">
              {productDesignLinks.map((item) => (
                <li key={item.href} className="mb-[10px]">
                  <a
                    href={item.href}
                    className="relative inline-block pl-[27px] text-[32px] text-white leading-[1] tracking-[-0.96px] no-underline hover:underline
                      before:absolute before:left-0 before:top-[16px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-white before:content-['']"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* ── S3: BRANDING & STUDIO ───────────────────────────── */}
      <section
        className="py-[115px] px-5 max-[767px]:pt-[39px] max-[767px]:pb-0"
        style={{ background: "#e7eaef url(/images/service_braning.png) top left" }}
      >
        <ScrollReveal direction="up">
          <div className="text-center mb-[100px] max-[767px]:mb-[32px] max-[767px]:px-[33px]">
            <h3 className="text-[42px] sm:text-[46px] md:text-[100px] lg:text-[120px] font-bold text-black leading-none sm:leading-[48px] md:leading-[90px] lg:leading-[100px] m-0 mb-[25px] md:mb-[28px]">
              <a href="" className="text-black no-underline">Branding &amp; Studio</a>
            </h3>
            <p className="text-[16px] md:text-[32px] font-normal leading-[20px] md:leading-[100%] text-black m-0">
              Building strong brands and impactful marketing strategies<br className="max-[767px]:hidden" />
              {" "}that drive success
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-[1460px] mx-auto flex flex-col lg:flex-row items-start">

          {/* Links (mobile: top) */}
          <div className="lg:hidden w-full px-[32px] pb-[46px] text-center">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 m-0 p-0 list-none">
              {brandingLinks.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-[16px] text-black leading-[1] no-underline hover:underline">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Image collage */}
          <div className="flex-1 max-lg:w-full max-[767px]:relative max-[767px]:min-h-[364px] max-[384px]:min-h-[315px] max-[767px]:overflow-visible">

            {/* Row 1 */}
            <div className="flex items-start max-[767px]:block">
              <div className="shrink-0 pt-[72px] max-lg:w-[30%] max-[767px]:absolute max-[767px]:!pt-0 max-[767px]:!w-[157px] max-[767px]:top-[36px] max-[767px]:left-[-52px] max-[384px]:!w-[135px] max-[384px]:left-[-48px]">
                <Image src="/images/branding1.png" alt="" width={334} height={462} className="w-full h-auto block" />
              </div>
              <div className="-ml-[100px] -mt-[54px] shrink-0 max-lg:w-[15%] max-lg:-ml-[6%] max-[767px]:absolute max-[767px]:!ml-0 max-[767px]:!mt-0 max-[767px]:!w-[75px] max-[767px]:top-[-26px] max-[767px]:left-[73px] max-[384px]:!w-[58px] max-[384px]:top-[-9px] max-[384px]:left-[50px]">
                <Image src="/images/branding2.png" alt="" width={162} height={161} className="w-full h-auto block" />
              </div>
              <div className="-ml-[24px] shrink-0 max-lg:w-[55%] max-lg:-ml-0 max-[767px]:absolute max-[767px]:!ml-0 max-[767px]:!w-[264px] max-[767px]:top-0 max-[767px]:right-0 max-[384px]:!w-[218px]">
                <Image src="/images/branding3.png" alt="" width={608} height={363} className="w-full h-auto block" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-start pl-[80px] max-lg:pl-0 max-[767px]:block">
              <div className="shrink-0 pt-[68px] max-lg:w-[200px] max-[767px]:absolute max-[767px]:!pt-0 max-[767px]:!w-[122px] max-[767px]:top-[285px] max-[767px]:left-[-20px] max-[384px]:!w-[107px] max-[384px]:top-[244px]">
                <Image src="/images/branding4.png" alt="" width={259} height={274} className="w-full h-auto block" />
              </div>
              <div className="-mt-[190px] ml-[58px] shrink-0 max-lg:w-[26%] max-lg:-mt-[168px] max-lg:ml-[58px] max-[767px]:absolute max-[767px]:!mt-0 max-[767px]:!ml-0 max-[767px]:!w-[160px] max-[767px]:top-[163px] max-[767px]:left-[126px] max-[384px]:!w-[112px] max-[384px]:top-[134px] max-[384px]:left-[109px]">
                <Image src="/images/branding5.png" alt="" width={339} height={341} className="w-full h-auto block" />
              </div>
              <div className="-mt-[273px] ml-[32px] shrink-0 max-lg:-mt-[200px] max-lg:ml-[30px] max-[767px]:absolute max-[767px]:!mt-0 max-[767px]:!ml-0 max-[767px]:top-[169px] max-[767px]:right-[-42px] max-[384px]:top-[136px]">
                {/* Colored dots */}
                <div className="mb-[126px] max-lg:mb-[60px] max-[767px]:!mb-0">
                  <span className="inline-block w-[79px] h-[79px] rounded-[20px] bg-[#1a76ff] mr-[5px] max-lg:w-[60px] max-lg:h-[60px] max-[767px]:!w-[37px] max-[767px]:!h-[37px] max-[767px]:!rounded-[9px]" />
                  <span className="inline-block w-[79px] h-[79px] rounded-[20px] bg-[#ff6caa] mr-[5px] max-lg:w-[60px] max-lg:h-[60px] max-[767px]:!w-[37px] max-[767px]:!h-[37px] max-[767px]:!rounded-[9px]" />
                  <span className="inline-block w-[79px] h-[79px] rounded-[20px] bg-[#ffd126] max-lg:w-[60px] max-lg:h-[60px] max-[767px]:!w-[37px] max-[767px]:!h-[37px] max-[767px]:!rounded-[9px]" />
                </div>
                <div className="max-lg:w-[93%] max-[767px]:absolute max-[767px]:!w-[160px] max-[767px]:top-[44px] max-[767px]:right-[-8px] max-[384px]:top-[58px] max-[384px]:!w-[136px]">
                  <Image src="/images/branding6.png" alt="" width={338} height={425} className="w-full h-auto block" />
                </div>
              </div>
            </div>
          </div>

          {/* Links sidebar (desktop) */}
          <ScrollReveal direction="up" delay={0.16} className="hidden lg:block w-[270px] shrink-0 pt-5 pl-8">
            <ul className="m-0 p-0 list-none">
              {brandingLinks.map((item) => (
                <li key={item.href} className="mb-[14px]">
                  <a
                    href={item.href}
                    className="relative inline-block pl-[28px] text-[32px] text-black leading-[1] tracking-[-0.96px] no-underline hover:underline
                      before:absolute before:left-0 before:top-[12px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-black before:content-['']"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      {/* ── S4: TECHNOLOGY ──────────────────────────────────── */}
      <section
        className="py-[134px] px-5 max-[767px]:pt-[38px] max-[767px]:pb-0 max-[767px]:relative max-[767px]:z-[1]"
        style={{
          background: "#000 url(/images/development_bg.png) no-repeat center center",
          backgroundSize: "contain",
        }}
      >
        <ScrollReveal direction="up">
          <div className="max-w-[1394px] mx-auto text-center pb-[120px] max-[767px]:pb-[28px] max-[767px]:px-[32px]">
            <h3 className="text-[42px] sm:text-[46px] md:text-[100px] lg:text-[120px] font-bold text-white leading-[48px] sm:leading-[48px] md:leading-[90px] lg:leading-[100px] tracking-[-0.96px] m-0 mb-[28px] lg:mb-[50px]">
              <a href="" className="text-white no-underline">Technology</a>
            </h3>
            <p className="text-[16px] md:text-[32px] font-normal leading-[20px] md:leading-[100%] text-white m-0">
              Our development services specialize in building robust, scalable platforms tailored to handle complex workflows and systems. We deliver everything from seamless integration to advanced functionality.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-[1634px] mx-auto flex flex-col lg:flex-row items-start">

          {/* Mobile tech list (above image) */}
          <ScrollReveal direction="up" delay={0.12} className="block lg:hidden w-[180px] sm:w-auto mx-auto text-center mb-8 sm:mb-12">
            <TechList />
          </ScrollReveal>

          {/* Main image with floating logos */}
          <div className="relative w-full lg:w-[1035px] shrink-0 mt-0 lg:mt-[150px] lg:mr-[160px] px-3 lg:px-0 pb-[39px] lg:pb-0">
            <Image src="/images/development_imag1.png" alt="" width={1035} height={700} className="w-full h-auto block mx-auto lg:mx-0" />
            <div className="absolute top-[32%] left-[25px]">
              <div className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]">
                <Image src="/images/ts_logo.png" alt="" width={100} height={100} className="w-full h-auto block" />
              </div>
            </div>
            <div className="absolute bottom-[14%] left-[-20px]">
              <div className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]">
                <Image src="/images/gloab_logo.png" alt="" width={100} height={100} className="w-full h-auto block" />
              </div>
            </div>
            <div className="absolute left-[46.5%] bottom-[-5%]">
              <div className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]">
                <Image src="/images/arrow_logo.png" alt="" width={100} height={100} className="w-full h-auto block" />
              </div>
            </div>
            <div className="absolute right-[12%] top-[38%]">
              <div className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px]">
                <Image src="/images/v_logo.png" alt="" width={100} height={100} className="w-full h-auto block" />
              </div>
            </div>
          </div>

          {/* Desktop tech list */}
          <ScrollReveal direction="up" delay={0.12} className="hidden lg:block w-[18%] shrink-0 pt-[34px]">
            <TechList />
          </ScrollReveal>
        </div>
      </section>

      {/* ── S5: CLIENT LOGOS ────────────────────────────────── */}
      <ClientLogosSection />

      {/* ── S6: FAQ ─────────────────────────────────────────── */}
      <FaqSection />

      {/* ── S7: BOTTOM CONTACT ──────────────────────────────── */}
      <PageBottomSection />

    </div>
  );
}

function TechList() {
  return (
    <>
      <div className="mb-[50px] max-[767px]:mb-[34px]">
        <h4 className="text-[32px] max-[767px]:text-[16px] font-semibold leading-[1] text-[#FF6161] m-0 mb-[20px] max-[767px]:mb-[9px] tracking-[-0.96px]">
          <a href="/services/front-end-dev/" className="text-[#FF6161] no-underline">Front End Dev</a>
        </h4>
        <ul className="m-0 p-0 list-none max-[767px]:flex max-[767px]:flex-wrap max-[767px]:gap-x-4 max-[767px]:gap-y-2">
          {["React.js", "Angular", "Vue.js", "Next.js"].map((tech) => (
            <li key={tech} className="mb-[12px] last:mb-0 max-[767px]:mb-0">
              <span className="text-[32px] max-[767px]:text-[14px] font-normal leading-[1] tracking-[-0.96px] text-white">{tech}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-[50px] max-[767px]:mb-[34px]">
        <h4 className="text-[32px] max-[767px]:text-[16px] font-semibold leading-[1] text-[#4ADE80] m-0 mb-[20px] max-[767px]:mb-[9px] tracking-[-0.96px]">
          <a href="/services/back-end-dev/" className="text-[#4ADE80] no-underline">Back End Dev</a>
        </h4>
        <ul className="m-0 p-0 list-none max-[767px]:flex max-[767px]:flex-wrap max-[767px]:gap-x-4 max-[767px]:gap-y-2">
          {["Node.js", "Express.js", "Django", "Python"].map((tech) => (
            <li key={tech} className="mb-[12px] last:mb-0 max-[767px]:mb-0">
              <span className="text-[32px] max-[767px]:text-[14px] font-normal leading-[1] tracking-[-0.96px] text-white">{tech}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
