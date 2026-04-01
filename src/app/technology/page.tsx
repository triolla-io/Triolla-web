"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import HeroJumpSvgs from "@/components/HeroJumpSvgs";
import GradientBtn from "@/components/GradientBtn";
import ClientLogosSection from "@/components/ClientLogosSection";
import FaqSection from "@/components/FaqSection";
import PageBottomSection from "@/components/PageBottomSection";

/* ── data ─────────────────────────────────────────────────── */

const companies = [
  "Deepkeep", "PlainID", "Rescana", "Okta", "Cyngular Security",
  "Armis", "Layerx", "ICTBIT", "Comesecure", "Cybering",
];

const techFeatures = [
  {
    type: "odd" as const,
    img: "/images/techmid1.png",
    items: [
      {
        heading: "Powering Visionary Products with Advanced Technology",
        body: "At Triolla, our Technology department is the engine behind some of the most innovative digital products in Israel and beyond. We partner with unicorns, high-growth startups, and industry leaders to turn ambitious ideas into scalable, secure, and high-performing solutions.",
        tags: "#Product UX UI Design  #Product Research  #User Interview",
      },
    ],
  },
  {
    type: "even" as const,
    img: "/images/techmid2new.png",
    items: [
      {
        heading: "AI Development Platforms",
        body: "We build robust AI platforms, leveraging real-world experience with leading tools like Cursor, N8N, LangChain, Airflow, Hugging Face, TensorFlow, and OpenAI. Our team is among the few with proven expertise in developing and deploying AI-driven solutions that drive automation and insight.",
        tags: "#Product UX UI Design  #Product Research  #User Interview",
      },
    ],
  },
  {
    type: "odd" as const,
    img: "/images/techmid3.png",
    items: [
      {
        heading: "Server-Side Engineering",
        body: "Secure, scalable server-side solutions powered by our strong Node.js team with AWS infrastructure expertise. We build solid foundations for growth and security.",
        tags: "#Product UX UI Design  #Product Research  #User Interview",
      },
      {
        heading: "Front-End Excellence",
        body: "Seamless user experiences with our React, Vue, and React Native experts. Pixel-perfect web and app development.",
        tags: "#Product UX UI Design  #Product Research  #User Interview",
      },
    ],
  },
  {
    type: "even" as const,
    img: "/images/techmid4.png",
    items: [
      {
        heading: "Gentrix's Platinum Partner",
        body: "Triolla is proud to be Gentrix's exclusive Platinum Partner in Israel, giving our clients first-access to the platform's cutting-edge AI orchestration and deployment capabilities. This strategic partnership lets us integrate Gentrix.ai's technology deep into your products, accelerating time-to-market while ensuring enterprise-grade scalability and security.",
        tags: "#Product UX UI Design  #Product Research  #User Interview",
      },
    ],
  },
];


const techFaqs = [
  {
    img: "/images/faq_q1.png",
    q: "Can you help with both UX and UI design?",
    a: "We take the time to deeply understand your brand identity, values, and target audience before starting any design work. By maintaining open communication and incorporating your feedback throughout the process, we ensure every design reflects your vision and resonates with your audience.",
  },
  {
    img: "/images/faq_q2.png",
    q: "How do you ensure your designs align with my brand?",
    a: "We take the time to deeply understand your brand identity, values, and target audience before starting any design work. By maintaining open communication and incorporating your feedback throughout the process, we ensure every design reflects your vision and resonates with your audience.",
  },
  {
    img: "/images/faq_q3.png",
    q: "Can you redesign an existing product?",
    a: "We take the time to deeply understand your brand identity, values, and target audience before starting any design work. By maintaining open communication and incorporating your feedback throughout the process, we ensure every design reflects your vision and resonates with your audience.",
  },
  {
    img: "/images/faq_q4.png",
    q: "Do you conduct user research as part of your services?",
    a: "We take the time to deeply understand your brand identity, values, and target audience before starting any design work. By maintaining open communication and incorporating your feedback throughout the process, we ensure every design reflects your vision and resonates with your audience.",
  },
  {
    img: "/images/faq_q5.png",
    q: "How long does the product design process usually take?",
    a: "We take the time to deeply understand your brand identity, values, and target audience before starting any design work. By maintaining open communication and incorporating your feedback throughout the process, we ensure every design reflects your vision and resonates with your audience.",
  },
  {
    img: "/images/faq_q6.png",
    q: "What industries have you worked with?",
    a: "We take the time to deeply understand your brand identity, values, and target audience before starting any design work. By maintaining open communication and incorporating your feedback throughout the process, we ensure every design reflects your vision and resonates with your audience.",
  },
  {
    img: "/images/faq_q7.png",
    q: "What is the cost of working with Triolla?",
    a: "We take the time to deeply understand your brand identity, values, and target audience before starting any design work. By maintaining open communication and incorporating your feedback throughout the process, we ensure every design reflects your vision and resonates with your audience.",
  },
];

const processSteps = [
  { num: 1, label: ["Ideation &", "discovery"] },
  { num: 2, label: ["Design &", "prototyping"] },
  { num: 3, label: ["Development", "sprints"] },
  { num: 4, label: ["MVP", "launch"] },
  { num: 5, label: ["Product", "growth"] },
];

/* ── page ─────────────────────────────────────────────────── */

export default function TechnologyPage() {
  useEffect(() => {
    document.body.classList.add("page-technology");
    return () => { document.body.classList.remove("page-technology"); };
  }, []);

  return (
    <div className="page-technology">

      {/* ── S1: HERO BANNER ─────────────────────────────────── */}
      <section className="relative bg-black pt-[100px] pb-[80px] sm:pt-[160px] sm:pb-[120px] lg:pt-[262px] lg:pb-[201px] overflow-hidden">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/techtop1.svg" alt="" className="absolute max-sm:hidden" style={{ width: 990, top: "6%", right: "7%" }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/techtop2.svg" alt="" className="absolute max-sm:hidden" style={{ width: 990, top: "6%", left: "20%" }} />
        </div>

        <div className="relative w-[88%] max-w-[1458px] mx-auto">
          {/* Floating jump SVGs — positioned relative to max-w container */}
          <HeroJumpSvgs />

          <div className="relative text-center">
            <motion.h1
              className="text-white font-bold text-[clamp(38px,12vw,182px)] leading-[0.9] pb-[40px] sm:pb-[70px] m-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              AI, SaaS Platforms Development
            </motion.h1>

            <motion.p
              className="text-white font-bold text-[clamp(18px,2.5vw,32px)] leading-tight lg:leading-[37px] tracking-[-0.96px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Full-stack development for AI, server-side, front-end, and complex systems.
            </motion.p>

            <motion.div
              className="pt-8 sm:pt-12 lg:pt-[65px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <GradientBtn href="#contactus">Partner with us</GradientBtn>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── S2: COMPANY TICKER ──────────────────────────────── */}
      <div className="ticker-wrapper h-[70px] sm:h-[111px] overflow-hidden flex items-center">
        <div className="ticker-track flex items-center whitespace-nowrap">
          {[...companies, ...companies].map((name, i) => (
            <span
              key={i}
              className="inline-block font-medium text-[18px] sm:text-[28px] leading-[1.4] text-black px-[14px] sm:px-[24px]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── S3: TECHNOLOGY FEATURES ─────────────────────────── */}
      <section className="bg-[#E7EBF0] pt-[50px] pb-[100px] overflow-hidden">
        {techFeatures.map((row, i) => (
          <div
            key={i}
            className={`flex flex-col lg:flex-row items-start gap-3 lg:gap-0 mb-[100px] lg:mb-[150px] last:mb-0 ${
              row.type === "odd" ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Image — flush right on odd (flex-row-reverse), flush left on even */}
            <div className="w-full lg:w-[53.7%] shrink-0">
              <Image
                src={row.img} alt="" width={700} height={560}
                className="w-full h-auto block max-h-[320px] lg:max-h-none object-cover lg:object-contain"
              />
            </div>

            {/* Text — odd: 20px left indent + top padding; even: right padding only */}
            <div className={`w-full lg:w-[44.3%] px-5 sm:px-[30px] lg:px-0 ${row.type === "odd" ? "lg:pl-5 lg:pt-[160px]" : "lg:pr-5"}`}>
              {row.items.map((item, j) => (
                <ScrollReveal key={j} direction="up" delay={j * 0.15} className="mb-[46px] last:mb-0">
                  <h3 className="text-[clamp(32px,5.5vw,80px)] leading-[1] font-bold text-black mb-[30px]">
                    {item.heading}
                  </h3>
                  <p className="text-[20px] leading-[28px] lg:text-[24px] lg:leading-[30px] text-black mb-[10px]">{item.body}</p>
                  <p className="text-[13px] sm:text-[14px] lg:text-[16px] text-[#736E6E] font-medium">{item.tags}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <ScrollReveal direction="up" className="text-center pt-[80px]">
          <p className="text-[24px] leading-[30px] text-black mb-[25px]">
            50+ Cyber Security SaaS platforms and counting
          </p>
          <GradientBtn href="#contactus">Partner with us</GradientBtn>
        </ScrollReveal>
      </section>

      {/* ── S4: TECH STACK CIRCLE ───────────────────────────── */}
      <section className="bg-black py-[60px] sm:py-[100px] xl:py-[170px] px-5">
        <div className="max-w-[1380px] mx-auto">

          {/* Title */}
          <ScrollReveal direction="up" className="text-center mb-[70px] md:mb-[120px] xl:mb-[160px]">
            <h3 className="text-[40px] xs:text-[60px] md:text-[100px] xl:text-[128px] 2xl:text-[160px] leading-[0.9] font-bold text-white m-0">
              Dedicated Israeli Team Working
            </h3>
            <h4
              className="text-[40px] xs:text-[60px] md:text-[100px] xl:text-[128px] 2xl:text-[160px] leading-[0.9] font-bold pb-[30px] md:pb-[56px] m-0"
              style={{
                background: "linear-gradient(94.64deg, #49C0B3 -0.94%, #8164E3 26.69%, #D1628E 48.87%, #FFA802 75.32%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Only For You.
            </h4>
            <p className="text-[18px] sm:text-[22px] leading-[150%] text-white font-light">
              We specialize in <strong className="font-bold">ReactJS</strong> &amp;{" "}
              <strong className="font-bold">Vue</strong> for front-end,{" "}
              <strong className="font-bold">Node.js</strong> &amp;{" "}
              <strong className="font-bold">PHP</strong> for backend, and Flutter for mobile development.
            </p>
          </ScrollReveal>

          {/* Circle diagram */}
          <ScrollReveal direction="up" delay={0.2}>
            <div
              className="max-w-[260px] xs:max-w-[360px] md:max-w-[500px] xl:max-w-[600px] 2xl:max-w-[1025px] min-h-[260px] xs:min-h-[370px] md:min-h-[500px] xl:min-h-[630px] 2xl:min-h-[1025px] mx-auto flex items-center justify-center overflow-visible"
              style={{ background: "url(/images/oursteakblue.svg) no-repeat center center", backgroundSize: "cover" }}
            >
              <div className="relative w-full max-w-[706px] mx-auto overflow-visible">
                {/* Circle base */}
                <Image src="/images/bluemidline.png" alt="" width={706} height={706} className="w-full h-auto block" />

                {/* Center label */}
                <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 text-white text-[28px] xs:text-[36px] md:text-[50px] 2xl:text-[72px] leading-[110%] font-bold text-center">
                  Our Tech<br />Stack
                </div>

                {/* Icons — 50px mobile, 70px xs, 120px desktop */}
                <div className="absolute top-[-16px] xs:top-[-22px] md:top-[-36px] left-[44%]">
                  <Image src="/images/tmid1.svg" alt="" width={120} height={120} className="w-[50px] h-[50px] xs:w-[70px] xs:h-[70px] md:w-[120px] md:h-[120px]" />
                </div>
                <div className="absolute top-[38px] xs:top-[52px] right-[7%] md:right-[10%]">
                  <Image src="/images/tmid2.svg" alt="" width={120} height={120} className="w-[50px] h-[50px] xs:w-[70px] xs:h-[70px] md:w-[120px] md:h-[120px]" />
                  <span className="absolute font-corenarae text-white text-[11px] xs:text-[13px] lg:text-[23px] right-[4px] xs:right-[8px] top-[-14px]">React</span>
                </div>
                <div className="absolute top-[170px] xs:top-[237px] md:top-[294px] right-[-8%]">
                  <span className="absolute font-corenarae text-white text-[11px] xs:text-[13px] lg:text-[23px] right-[0px] xs:right-[-50px] lg:right-[-50px] top-[56px] xs:top-[32px] lg:top-[32px]">html</span>
                  <Image src="/images/tmid3.svg" alt="" width={120} height={120} className="w-[50px] h-[50px] xs:w-[70px] xs:h-[70px] md:w-[120px] md:h-[120px]" />
                </div>
                <div className="absolute bottom-[22px] xs:bottom-[30px] right-[3%] md:top-[554px] md:bottom-auto md:right-[2%]">
                  <Image src="/images/tmid4.svg" alt="" width={120} height={120} className="w-[50px] h-[50px] xs:w-[70px] xs:h-[70px] md:w-[120px] md:h-[120px]" />
                  <span className="block font-corenarae text-white text-[11px] xs:text-[13px] lg:text-[23px] text-center mt-[-6px] lg:mt-[-10px]">Vue.js</span>
                </div>
                <div className="absolute bottom-[-38px] xs:bottom-[-51px] md:bottom-[-73px] left-[46%]">
                  <Image src="/images/tmid5.svg" alt="" width={120} height={120} className="w-[50px] h-[50px] xs:w-[70px] xs:h-[70px] md:w-[120px] md:h-[120px]" />
                  <span className="block font-corenarae text-white text-[11px] xs:text-[13px] lg:text-[23px] text-center mt-[-6px] lg:mt-[-10px]">MangoDB</span>
                </div>
                <div className="absolute bottom-[22px] xs:bottom-[37px] md:bottom-[30px] left-[7%] xs:left-[5%] md:left-[7%]">
                  <Image src="/images/tmid6.svg" alt="" width={120} height={120} className="w-[50px] h-[50px] xs:w-[70px] xs:h-[70px] md:w-[120px] md:h-[120px]" />
                </div>
                <div className="absolute top-[175px] xs:top-[245px] left-[-6%] md:top-[294px] md:left-[-8%]">
                  <Image src="/images/tmid7.svg" alt="" width={120} height={120} className="w-[50px] h-[50px] xs:w-[70px] xs:h-[70px] md:w-[120px] md:h-[120px]" />
                  <span className="absolute font-corenarae text-white text-[11px] xs:text-[13px] lg:text-[23px] top-[-22px] xs:top-[-22px] left-[-26px] xs:left-[-26px] lg:top-[32px] lg:left-[-105px]">Node JS</span>
                </div>
                <div className="absolute top-[50px] xs:top-[68px] left-[5%] md:top-[72px] md:left-[7%]">
                  <Image src="/images/tmid8.svg" alt="" width={120} height={120} className="w-[50px] h-[50px] xs:w-[70px] xs:h-[70px] md:w-[120px] md:h-[120px]" />
                  {/* Typescript label: small on mobile, arrow only on lg+ */}
                  <span className="absolute font-corenarae text-white text-[11px] xs:text-[13px] top-[-41px] left-[-54px] lg:hidden">Typescript</span>
                  <div className="absolute top-[-59px] left-[-322px] hidden lg:block">
                    <span className="font-corenarae text-white text-[23px]">Typescript</span>
                    <Image src="/images/typearow.png" alt="" width={187} height={118} className="mt-[-10px] ml-[124px]" />
                  </div>
                </div>

                {/* Frontend label — right side with arrows, desktop only */}
                <div className="absolute top-[12%] right-[-145px] font-corenarae text-white text-[23px] text-center hidden xl:block">
                  <Image src="/images/frontarow.png" alt="" width={202} height={184} />
                  <span className="inline-block relative top-[-70px] right-[-133px]">Our Tech<br />Stack</span>
                  <Image src="/images/frontarow2.png" alt="" width={183} height={262} className="relative top-[-47px] right-[-40px]" />
                </div>

                {/* Cloud label — bottom left, desktop only */}
                <div className="absolute bottom-0 left-[-108px] font-corenarae text-white text-[23px] text-center hidden xl:block">
                  <Image src="/images/cloudarow.png" alt="" width={150} height={71} />
                  <span className="inline-block relative left-[-92px] top-[27px]">Cloud &amp;<br />infrastructure</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── S5: CLIENT LOGOS ────────────────────────────────── */}
      <ClientLogosSection />

      {/* ── S6: IDEA TO LAUNCH PROCESS ──────────────────────── */}
      {/* WP: padding 116px 114px 246px 114px at desktop, but ≤1540px overrides to 20px sides */}
      <section className="bg-[#371957] px-5 pt-[60px] sm:pt-[116px] pb-[80px] sm:pb-[246px]">

          {/* Header */}
          <ScrollReveal direction="up" className="max-w-[1116px] mx-auto text-center mb-0">
            <h4 className="text-[40px] xs:text-[60px] md:text-[100px] xl:text-[128px] 2xl:text-[160px] font-bold leading-[89%] text-white mb-[30px]">
              From idea to soft launch
            </h4>
            <p className="text-[18px] sm:text-[22px] leading-[110%] text-white">
              We specialize in <strong>ReactJS</strong> &amp; <strong>Vue</strong> for front-end,{" "}
              <strong>Node.js</strong> &amp; <strong>PHP</strong> for backend, and Flutter for mobile development.
            </p>
          </ScrollReveal>

          {/* Numbered steps */}
          <ScrollReveal direction="up" delay={0.15} className="pt-[60px] sm:pt-[140px] pb-[40px] sm:pb-[46px]">
            <ul className="flex flex-wrap list-none m-0 p-0 gap-y-5">
              {processSteps.map((step) => (
                <li key={step.num} className="w-full sm:w-1/2 lg:w-1/5 px-[10px] flex items-start gap-3">
                  <div
                    className="shrink-0 w-[44px] h-[38px] flex items-center justify-center text-white font-bold text-[24px] pt-1"
                    style={{ background: "url(/images/bigribbon.svg) no-repeat center center", backgroundSize: "cover" }}
                  >
                    {step.num}
                  </div>
                  <div className="text-white text-[20px] leading-[1.3] pt-0.5">
                    {step.label[0]}<br />{step.label[1]}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Gantt strips */}
          <ScrollReveal direction="up" delay={0.3} className="space-y-[14px] sm:space-y-[23px]">
            {/* Project management — full width purple */}
            <div
              className="rounded-[20px] px-[15px] sm:px-[25px] leading-[32px] sm:leading-[42px] text-white text-[16px] sm:text-[24px] font-medium"
              style={{ background: "linear-gradient(90deg, #AD29FE 82.9%, rgba(173,41,254,0) 94.69%)" }}
            >
              Project management
            </div>

            {/* Product framework */}
            <div
              className="rounded-[20px] px-[15px] sm:px-[25px] leading-[32px] sm:leading-[42px] text-white text-[16px] sm:text-[24px] font-medium sm:hidden"
              style={{ background: "linear-gradient(89.96deg, #C19FF0 20.19%, rgba(193,159,240,0) 96.92%)" }}
            >
              Product framework
            </div>

            {/* Product framework + Product design — side by side on sm+ */}
            <div className="hidden sm:flex">
              <div
                className="shrink-0 w-[326px] rounded-[20px] px-[25px] leading-[42px] text-white text-[24px] font-medium"
                style={{ background: "linear-gradient(89.96deg, #C19FF0 20.19%, rgba(193,159,240,0) 96.92%)" }}
              >
                Product framework
              </div>
              <div
                className="w-4/5 -ml-[2%] rounded-[20px] px-[25px] leading-[42px] text-white text-[24px] font-medium"
                style={{ background: "linear-gradient(89.98deg, #5B96CB 47.27%, rgba(91,150,203,0) 96.34%)" }}
              >
                Product design
              </div>
            </div>

            {/* Product design — mobile only */}
            <div
              className="rounded-[20px] px-[15px] leading-[32px] text-white text-[16px] font-medium sm:hidden"
              style={{ background: "linear-gradient(89.98deg, #5B96CB 47.27%, rgba(91,150,203,0) 96.34%)" }}
            >
              Product design
            </div>

            {/* Frontend development */}
            <div className="sm:mr-[16%]">
              <div
                className="w-full sm:ml-auto sm:w-[60%] rounded-[20px] px-[15px] sm:px-[25px] leading-[32px] sm:leading-[42px] text-white text-[16px] sm:text-[24px] font-medium"
                style={{ background: "linear-gradient(89.95deg, #41CFA9 40.62%, rgba(65,207,169,0) 98.1%)" }}
              >
                Frontend development
              </div>
            </div>

            {/* Backend development */}
            <div className="sm:mr-[19%]">
              <div
                className="w-full sm:ml-auto sm:w-[48%] rounded-[20px] px-[15px] sm:px-[25px] leading-[32px] sm:leading-[42px] text-white text-[16px] sm:text-[24px] font-medium"
                style={{ background: "linear-gradient(90deg, #D36489 37.5%, rgba(211,100,137,0) 94.26%)" }}
              >
                Backend development
              </div>
            </div>

            {/* Soft launch */}
            <div className="sm:flex sm:justify-end">
              <div
                className="w-full sm:w-[31%] rounded-[20px] px-[15px] sm:px-[25px] leading-[32px] sm:leading-[42px] text-white text-[16px] sm:text-[24px] font-medium"
                style={{ background: "linear-gradient(90deg, #FFA800 21.43%, rgba(255,168,0,0) 90.23%)" }}
              >
                Soft launch
              </div>
            </div>
          </ScrollReveal>
      </section>

      {/* ── S7: FAQ ─────────────────────────────────────────── */}
      <FaqSection questions={techFaqs} />

      {/* ── S8: CONTACT CTA ─────────────────────────────────── */}
      <PageBottomSection />

    </div>
  );
}
