"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import HeroJumpSvgs from "@/components/HeroJumpSvgs";
import PartnerBtn from "@/components/PartnerBtn";
import PageBottomSection from "@/components/PageBottomSection";

export default function BrandingStudioPage() {
  return (
    <div>
      {/* ── S1: HERO BANNER ─────────────────────────────────── */}
      <section className="relative bg-[#FED125] pt-[100px] sm:pt-[180px] lg:pt-[262px] pb-[80px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image src="/images/banner_grid.svg" alt="" fill className="object-cover object-top opacity-60" priority />
        </div>
        <div className="relative max-w-[1214px] mx-auto px-5 sm:px-[30px] md:px-[80px] lg:px-[150px]">
          <HeroJumpSvgs />
          <div className="relative text-center">
            <motion.h1
              className="font-bold text-[77px] sm:text-[96px] md:text-[138px] lg:text-[180px] xl:text-[260px] leading-[0.85] text-black text-center m-0 pb-[70px]"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            >
              Branding &amp; Studio
            </motion.h1>
            <motion.div className="flex justify-center pt-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
              <PartnerBtn />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── S2: HERO IMAGE ──────────────────────────────────── */}
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-10 -mt-8 relative z-10">
        <Image
          src="/images/Frame-213673.jpg"
          alt="Branding & Studio"
          width={1400}
          height={700}
          className="w-full h-auto rounded-[24px] object-cover"
        />
      </div>

      {/* ── S3: ARTICLE CONTENT ─────────────────────────────── */}
      <section className="max-w-[900px] mx-auto px-5 sm:px-10 py-[100px]">
        <ScrollReveal direction="up">
          <p className="text-[20px] md:text-[26px] lg:text-[32px] font-bold leading-[1.3] text-black mb-12">
            From concept to creation, our Branding &amp; Studio team brings your brand vision to life with a unique blend of creativity, strategy, and technology. We combine artistic expertise with data-driven insights and advanced AI tools to craft a visual identity that truly sets your business apart.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <h2 className="text-[22px] md:text-[28px] font-normal leading-[1.4] text-black mb-8">
            Our branding process is designed to uncover what makes your company unique and translate it into a cohesive, memorable brand experience. We start by deeply understanding your business, your audience, and your market landscape—using AI-powered research and analytics to identify trends, opportunities, and the emotional triggers that resonate with your customers.
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.15}>
          <p className="text-[18px] md:text-[20px] leading-[1.6] text-black/70 mb-6">
            From initial brand audits and creative workshops to the development of logos, color palettes, typography, and imagery, our studio team works hand in hand with you at every stage. We leverage intelligent design systems and automation tools to ensure consistency, scalability, and efficiency across all your digital and physical touchpoints.
          </p>
          <p className="text-[18px] md:text-[20px] leading-[1.6] text-black/70 mb-6">
            Throughout our collaboration, we use AI to enhance creative exploration, streamline asset production, and personalize brand storytelling. Our process includes audience analysis, competitive review, visual positioning, and the creation of a comprehensive visual identity system. We also develop icon and illustration guides, and build a detailed style guide that empowers your team to maintain brand integrity as you grow.
          </p>
          <p className="text-[18px] md:text-[20px] leading-[1.6] text-black/70 mb-12">
            With our Branding &amp; Studio services, you receive a complete brand guideline and creative toolkit—equipped with everything you need to launch, evolve, and manage your brand across every channel. The result is a powerful, future-ready brand identity that connects with your audience and drives lasting impact.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.2}>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      {/* ── S4: BOTTOM CONTACT ──────────────────────────────── */}
      <PageBottomSection />
    </div>
  );
}
