"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import IndustryHero from "@/components/IndustryHero";
import CompanyTicker from "@/components/CompanyTicker";
import ExpandableHeroText from "@/components/ExpandableHeroText";
import PartnerBtn from "@/components/PartnerBtn";
import PortfolioItem from "@/components/PortfolioItem";
import { portfolioMobileFor } from "@/lib/portfolioMobileImages";
import {
  LazyClientLogosSection as ClientLogosSection,
  LazyDesignProcessSection as DesignProcessSection,
  LazyFaqSection as FaqSection,
  LazyPageBottomSection as PageBottomSection,
  LazyWhyChooseUsSection as WhyChooseUsSection,
} from "@/components/LazyBelowFoldMarketing";

/* ── data ─────────────────────────────────────────────────── */

const companies = [
  "Krust.io", "Cyngular Security", "Comsecure", "Cytwist", "Armis",
  "Ranger hall", "Layer x", "Cybring", "ICTBIT", "Infognio", "Bugsec",
  "Cyngular security", "Spikerz", "Suridata", "Itur Intelligence", "Savvy",
  "Safebreach", "Riskey", "OP – Innovate", "Opora", "PlainID", "Cynomi",
  "DeepKeep", "Cloudsine", "Armis", "Rescana",
];

const portfolioItems = [
  {
    logo: "/images/armis-min.png",
    logoAlt: "Armis",
    logoWidth: 221, logoHeight: 100,
    title: "Armis partnered with us to lead the complete redesign of their platform and build a unified design system across all their products.",
    text: "Our collaboration focused on enhancing user experience and creating a cohesive design system that supports Armis's mission to secure the ever-expanding landscape of connected devices.",
    image: "/images/Armis-desktop.png",
    ...portfolioMobileFor("/images/Armis-desktop.png"),
    imageAlt: "Armis platform redesign",
    tags: ["#ProductUX", "#ProductUI", "#UserExperience", "#DesignSystem"],
    even: false,
  },
  {
    logo: "/images/Suridata-min.png",
    logoAlt: "Suridata",
    logoWidth: 319, logoHeight: 87,
    title: "Suridata Partnership: Scaling Security Through Strategic UX Design",
    text: "Suridata partnered with us to reimagine their SaaS security platform. We focused on UX research and upgraded the design to deliver a better user experience, enhancing clarity, scalability, and user trust across their entire product suite.",
    image: "/images/Suridata-desktop.png",
    ...portfolioMobileFor("/images/Suridata-desktop.png"),
    imageAlt: "Suridata security platform",
    tags: ["#SaaSPlatform", "#UXDesign", "#SaaSProduct", "#SecurityPlatform"],
    even: true,
  },
  {
    logo: "/images/okta-min.png",
    logoAlt: "Okta",
    logoWidth: 228, logoHeight: 89,
    title: "Simplifying Complex Identity Flows for Okta's Security Platform",
    text: "Our teams conducted in-depth design research to simplify complex identity and access management flows, enhance clarity across key user journeys, and ensure a consistent experience across all touchpoints—delivering a streamlined, intuitive platform that reinforces Okta's leadership.",
    image: "/images/Okta-desktop.png",
    ...portfolioMobileFor("/images/Okta-desktop.png"),
    imageAlt: "Okta identity platform",
    tags: ["#DesignResearch", "#UserJourney", "#ProductSecurity"],
    even: false,
  },
  {
    logo: "/images/safebridge-min.png",
    logoAlt: "SafeBreach",
    logoWidth: 338, logoHeight: 62,
    title: "SafeBreach: Transforming Threat Data into Actionable Security",
    text: "Safebreach partnered with us to transform complex data and threat simulations into clear, actionable experiences. We redesigned core flows, enhanced overall usability, and built a scalable system that empowers security teams to act faster.",
    image: "/images/Safebridge-desktop.png",
    ...portfolioMobileFor("/images/Safebridge-desktop.png"),
    imageAlt: "SafeBreach threat platform",
    tags: ["#CyberProduct", "#ProductDesigner", "#CyberUI", "#CyberUX"],
    even: true,
  },
  {
    logo: "/images/cyngular-min.png",
    logoAlt: "Cyngular",
    logoWidth: 281, logoHeight: 78,
    title: "Cyngular: Enhanced Cybersecurity Through Product & UX Design",
    text: "As Cyngular's UX partner, we collaborated to transform complex cybersecurity into intuitive experiences. Through product design and UI enhancements, we streamlined flows and clarified data, building a flexible system for future growth.",
    image: "/images/Cyngular-desktop.png",
    ...portfolioMobileFor("/images/Cyngular-desktop.png"),
    imageAlt: "Cyngular cybersecurity platform",
    tags: ["#PlatformDesign", "#UIEnhancement", "#UXDesign", "#ComplexSystem"],
    even: false,
  },
];

const whyCards = [
  {
    title: "We speak\nyour language",
    body: "Fluent in the terms, flows, and mindset of cybersecurity users",
  },
  {
    title: "Battle-tested experience",
    body: "Over 65 SaaS platforms designed for top-tier cyber companies",
  },
  {
    title: "Up to speed\nfrom day one",
    body: "We get your world, so we get to work—fast.",
  },
  {
    title: "Security-first\nthinking",
    body: "Our UX is built with your users, risks, and compliance in mind.",
  },
];

const designSteps = [
  "Kickoff\nMeeting",
  "Research &\nCompetitive\nanalysis",
  "User\ninterview",
  "Brain storming\nIdeate phase\nBuild usecase\n+ Flow",
  "Detailed\nWireframes",
  "User\nTesting",
  "Concepts\nDesign",
  "Detailed\nDesign",
];

/* ── page ─────────────────────────────────────────────────── */

export default function CyberSecurityPage() {
  return (
    <div>

      {/* ── S1: HERO BANNER ─────────────────────────────────── */}
      <IndustryHero
        title="Cyber Security"
        subtitle="Partner with product design specialists who get it."
        description={
          <ExpandableHeroText
            preview={
              <>
                User Experience (UX) design is crucial in the world of cybersecurity, where secure systems
                must also be intuitive and user-friendly.
              </>
            }
            moreParagraphs={[
              <>
                As cyber threats grow more complex, UX design helps simplify security processes without
                compromising protection. In cybersecurity, great UX means guiding users through secure
                actions without overwhelming them with technical complexity. A well-designed interface builds
                trust, encourages safe behavior, and gives users a sense of control.
              </>,
              <>
                By anticipating risks and preventing common user errors, UX design plays a proactive role in
                reducing cyber threats. At Triolla, we specialize in designing secure, seamless, and
                human-centered experiences for cybersecurity products.
              </>,
            ]}
          />
        }
        cta={<PartnerBtn />}
      />

      {/* ── S2: COMPANY TICKER ──────────────────────────────── */}
      <CompanyTicker names={companies} className="ticker-wrap" />

      {/* ── S3: PORTFOLIO — mobile stack; lg+ split row with alternating image side ─ */}
      <section className="bg-[#e7eaef] pb-0 pt-16 sm:pt-24 md:pt-32 lg:pt-40 xl:pt-[260px]">
        <ul className="m-0 list-none p-0">
          {portfolioItems.map((item, i) => (
            <ScrollReveal
              key={i}
              as="li"
              direction="up"
              delay={0.1}
              className="mb-12 max-[767px]:border-b max-[767px]:border-black/10 max-[767px]:pb-12 last:mb-0 last:max-[767px]:border-b-0 sm:mb-16 sm:max-[767px]:pb-16 md:mb-24 md:max-[767px]:pb-20 lg:mb-[120px] xl:mb-[144px]"
            >
              <PortfolioItem {...item} />
            </ScrollReveal>
          ))}
        </ul>

        {/* Partners CTA */}
        <ScrollReveal
          direction="up"
          className="text-center px-4 pb-16 pt-10 sm:px-4 sm:pb-8 sm:pt-6 md:px-12 md:pb-28 lg:px-[50px] lg:pb-[151px] lg:pt-[80px]"
        >
          <p className="m-0 mb-5 leading-snug text-black sm:mb-6 sm:text-sm md:text-2xl lg:text-[24px] lg:leading-[30px]">
            50+ Cyber Security SaaS{" "}
            <br className="block sm:hidden" aria-hidden="true" />
             platforms and counting
          </p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      {/* ── S4: WHY CYBER SECTION ────────────────────────────── */}
      <WhyChooseUsSection
        heading={<>Why Do <br />Cyber Companies <br />Choose Us?</>}
        cards={whyCards}
        variant="dark"
      />

      {/* ── S5: CLIENT LOGOS ────────────────────────────────── */}
      <ClientLogosSection />

      {/* ── S6: DESIGN PROCESS ──────────────────────────────── */}
      <DesignProcessSection
        title={<>Our unique <br /><span>Design</span> Process</>}
        description="Our unique design process blends deep user insight with creative strategy to craft digital experiences that truly stand out."
        steps={designSteps}
      />

      {/* ── S7: FAQ ─────────────────────────────────────────── */}
      <FaqSection />

      {/* ── S8: BOTTOM CONTACT ──────────────────────────────── */}
      <PageBottomSection />

    </div>
  );
}
