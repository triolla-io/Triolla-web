"use client";

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
  "Openops", "Banksbride", "Jifiti", "Tel aviv Payments", "Prepay",
  "Djed", "Worldcom", "Splitit", "Bluevine", "Simplex", "Plus 500",
  "Golden equator", "Menahel 4u – power bi", "Kirobo", "Luxon pay",
  "Fuse", "Altshuler Shaham Trade", "Arborknot debt collect", "Coti",
  "Okoora", "Proxibit", "Optiloan", "Finaro", "Feezback", "FBX",
  "Altshuler self service",
];

const portfolioItems = [
  {
    logo: "/images/luxon-pay-min.png",
    logoWidth: 290, logoHeight: 50,
    logoAlt: "Luxon Pay",
    title: "Redesigning Luxon Pay: Seamless Money, Enhanced Experience",
    text: "Luxon Pay partnered with us to redesign their payment wallet app, creating a smoother user experience and redefining how users send, receive, and manage money.",
    image: "/images/Luxon-pay-desktop.png",
    ...portfolioMobileFor("/images/Luxon-pay-desktop.png"),
    imageAlt: "Luxon Pay redesign",
    tags: ["#ProductRedesign", "#PaymentApp", "#FintechUX", "#FintechUI", "#UXUI"],
    even: false,
  },
  {
    logo: "/images/image-160.png",
    logoWidth: 222, logoHeight: 55,
    logoAlt: "Plus500",
    title: "Plus500 Platform Redesign: Unified System, Enhanced Trading Experience",
    text: "Our UX research and product design teams partnered closely to elevate the user experience, modernize the interface, and ensure design consistency at scale. We delivered a cohesive, intuitive platform tailored for millions of global users.",
    image: "/images/Plus500-desktop.png",
    imageAlt: "Plus500 platform redesign",
    tags: ["#UXresearch", "#ProductDesign", "#UserExperience", "#UserInterface"],
    even: true,
  },
  {
    logo: "/images/altshuler-min.png",
    logoWidth: 373, logoHeight: 80,
    logoAlt: "Altshuler Shaham",
    title: "Altshuler Shaham partnered with us to reimagine their digital investment experience, bringing clarity, trust, and simplicity to their users.",
    text: "We redesigned the onboarding process to achieve a higher acquisition rate, making complex financial information approachable. Proud to help one of Israel's leading investment firms deliver a smarter, more human digital experience.",
    image: "/images/Altshuler-desktop.png",
    ...portfolioMobileFor("/images/Altshuler-desktop.png"),
    imageAlt: "Altshuler Shaham investment platform",
    tags: ["#Redesign", "#ProductUX", "#AppDesign", "#UserExperience"],
    even: false,
  },
  {
    logo: "/images/splitit-min.png",
    logoWidth: 210, logoHeight: 70,
    logoAlt: "Splitit",
    title: "Streamlining Splitit's Payment Experience Across Every Platform",
    text: "Our teams partnered with Splitit to simplify their payment platform and user journey across diverse users and platforms. We crafted a scalable design system for a cleaner, faster, and consistent experience, reflecting their innovative approach.",
    image: "/images/Splitit-desktop.png",
    ...portfolioMobileFor("/images/Splitit-desktop.png"),
    imageAlt: "Splitit payment platform",
    tags: ["#PaymentPlatform", "#ProductResearch", "#DesignSystem", "#Platforms"],
    even: true,
  },
  {
    logo: "/images/ibi-min.png",
    logoWidth: 145, logoHeight: 100,
    logoAlt: "IBI",
    title: "Revolutionizing IBI's Equity Platform: Streamlined Equity Management",
    text: "IBI partnered with us to reinvent their employee stock options platform, enabling both employees and CFOs to easily view and manage company equity in one streamlined experience.",
    image: "/images/IBI-desktop.png",
    ...portfolioMobileFor("/images/IBI-desktop.png"),
    imageAlt: "IBI equity platform",
    tags: ["#FinancePlatform", "#UserJourney", "#Fintech", "#UserExperience"],
    even: false,
  },
];

const whyCards = [
  {
    title: "We speak\nfinance fluently",
    body: "Deep understanding of financial flows, compliance, and user trust",
  },
  {
    title: "Fintech-focused expertise",
    body: "Proven track record designing digital products for leading financial brands",
  },
  {
    title: "On the money from day one",
    body: "We know your industry, so we deliver value right from the start",
  },
  {
    title: "Trust by design",
    body: "Our UX prioritizes security, clarity, and seamless financial experiences",
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

export default function FintechFinancePage() {
  return (
    <div>

      {/* ── S1: HERO BANNER ─────────────────────────────────── */}
      <IndustryHero
        title={
          <>
            <span className="block text-center lg:hidden">Finance</span>
            <span className="block text-center lg:hidden">&amp; Tech</span>
            <span className="hidden lg:inline">Finance &amp; Tech</span>
          </>
        }
        subtitle="Join product design experts who will listen to you."
        description={
          <ExpandableHeroText
            preview={<>Enterprise tools and efficient workflows are our language in Fintech &amp; Finance.</>}
            moreParagraphs={[
              <>
                We create secure and intuitive interfaces that <br />
                simplify complex financial processes and build user trust in the fintech and finance sector.
              </>,
              <>
                Our product design approach focuses on clarity, compliance, and seamless integration with
                financial systems to deliver exceptional user experiences.
              </>,
              <>
                With Triolla, your fintech solutions benefit from design expertise that drives engagement,
                ensures reliability, and supports your growth in a dynamic market.
              </>,
            ]}
          />
        }
        cta={<PartnerBtn />}
        contentClassName="z-10 w-full flex flex-col items-center text-center"
        titleClassName="!block !text-center"
        titleDir="ltr"
      />

      {/* ── S2: COMPANY TICKER ──────────────────────────────── */}
      <CompanyTicker names={companies} className="ticker-wrap" />

      {/* ── S3: PORTFOLIO — mobile stack + spacing (parity with cyber-security; RTL-safe) ─ */}
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

        <ScrollReveal
          direction="up"
          className="text-center px-4 pb-16 pt-10 sm:px-4 sm:pb-8 sm:pt-6 md:px-12 md:pb-28 lg:px-[50px] lg:pb-[151px] lg:pt-[80px]"
        >
          <p className="m-0 mb-5 leading-snug text-black sm:mb-6 sm:text-sm md:text-2xl lg:text-[24px] lg:leading-[30px]">
            50+ fintech-finance platforms and counting
          </p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      {/* ── S4: WHY FINTECH SECTION ──────────────────────────── */}
      <WhyChooseUsSection
        heading={<>Why Do <br />fintech companies <br />choose us?</>}
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
