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
  "Tadiran", "Intel", "Altshuler Shaham", "Sweetch", "Melingo",
  "Alljobs", "Skideal", "Comax", "PassportCard",
];

const portfolioItems = [
  {
    logo: "/images/Tadiran-1.png",
    logoWidth: 272, logoHeight: 71,
    logoAlt: "Tadiran",
    title: "Reimagining climate control—Tadiran's app lets users manage their indoor environment effortlessly, anytime, anywhere.",
    text: "We redesigned the smart climate control app to turn complex functionality into a clean, intuitive, and accessible experience—focusing on clear interactions and seamless connectivity.",
    image: "/images/Tadiran.png",
    ...portfolioMobileFor("/images/Tadiran.png"),
    imageAlt: "Tadiran app redesign",
    tags: ["#MobileApp", "#AppDesign", "#UserExperience"],
    even: false,
  },
  {
    logo: "/images/intel-min.png",
    logoWidth: 134, logoHeight: 94,
    logoAlt: "Intel",
    title: "Intel's gaming rig builder takes an innovative approach in new compelling touch screen display",
    text: "We collaborated with Intel to design a touchscreen experience that lets users intuitively build their ideal gaming rig—blending powerful configuration with an immersive, consumer-grade interface.",
    image: "/images/Intel-Desktop.png",
    ...portfolioMobileFor("/images/Intel-Desktop.png"),
    imageAlt: "Intel gaming rig builder",
    tags: ["#InteractiveUX", "#GamingUI", "#TouchscreenDesign"],
    even: true,
  },
  {
    logo: "/images/altshuler-min.png",
    logoWidth: 373, logoHeight: 80,
    logoAlt: "Altshuler Shaham",
    title: "Taking mundane processes with an elevated approach, creating seamless user flows in a vast ecosystem",
    text: "The financial house Altshuler Shaham is our long-time partner in creating simple processes and appealing apps for their large audience—making finance accessible and intuitive.",
    image: "/images/altshuler-desktop1.png",
    ...portfolioMobileFor("/images/altshuler-desktop1.png"),
    imageAlt: "Altshuler Shaham investment platform",
    tags: ["#FintechUX", "#InvestmentUI", "#MobileDesign"],
    even: false,
  },
  {
    logo: "/images/Sweetch-min.png",
    logoWidth: 239, logoHeight: 79,
    logoAlt: "Sweetch",
    title: "Transforming chronic care—Sweetch App delivers personalized interventions tailored to each health journey.",
    text: "We collaborated with Sweetch to enhance both the user experience and visual identity of their digital health app, creating a compassionate, engaging platform that supports patients through personalized care.",
    image: "/images/Sweetch-image-desktop-1.png",
    ...portfolioMobileFor("/images/Sweetch-image-desktop-1.png"),
    imageAlt: "Sweetch digital health app",
    tags: ["#UserExperience", "#DigitalApp", "#B2C"],
    even: true,
  },
  {
    logo: "/images/melingo-min.png",
    logoWidth: 208, logoHeight: 100,
    logoAlt: "Melingo",
    title: "Partnering with Melingo and Britannica to design user-friendly language learning experience—blending conversational AI with intuitive, engaging UI.",
    text: "We worked with Melingo and Britannica to design an intuitive, engaging language learning experience that seamlessly blends AI-driven conversation practice with a visually polished interface.",
    image: "/images/melingo-desktop1.png",
    ...portfolioMobileFor("/images/melingo-desktop1.png"),
    imageAlt: "Melingo language learning app",
    tags: ["#AIUXDesign", "#EdTechUX", "#LanguageTechUI"],
    even: false,
  },
  {
    logo: "/images/all-jobs-min.png",
    logoWidth: 213, logoHeight: 76,
    logoAlt: "Alljobs",
    title: "A user friendly concept to a professional questionnaire, elevating a simplified process with fun, engaging elements.",
    text: "Customized illustrations and a clean look while maintaining brand identity created a unique outlook to what was once a lengthy questionnaire—transformed into an enjoyable, streamlined experience.",
    image: "/images/all-jobs-desktop-1.png",
    ...portfolioMobileFor("/images/all-jobs-desktop-1.png"),
    imageAlt: "Alljobs questionnaire redesign",
    tags: ["#JobTechDesign", "#UserFriendlyDesign"],
    even: true,
  },
  {
    logo: "/images/skideal-min.png",
    logoWidth: 141, logoHeight: 73,
    logoAlt: "SkiDeal",
    title: "Our long time partner entrusted us with defining the user experience of their brand both on desktop and mobile.",
    text: "Designing SkiDeal's main flows with a fresh visual identity, a user-friendly interface that simplifies the skiing vacation booking process from search to checkout.",
    image: "/images/Skideal-desktop-1.png",
    ...portfolioMobileFor("/images/Skideal-desktop-1.png"),
    imageAlt: "SkiDeal vacation booking platform",
    tags: ["#VacationBookingUX", "#SeamlessCheckout", "#UXForTravel"],
    even: false,
  },
  {
    logo: "/images/Comax-min.png",
    logoWidth: 257, logoHeight: 76,
    logoAlt: "Comax",
    title: "An ERP & Retail platform given a fresh approach to UI UX",
    text: "Simplified and modernized ERP and retail platforms with clean, user-friendly designs and flows—making complex enterprise tools feel approachable and efficient.",
    image: "/images/Comax-Desktop-1.png",
    ...portfolioMobileFor("/images/Comax-Desktop-1.png"),
    imageAlt: "Comax ERP retail platform",
    tags: ["#SmartERPDesign", "#RetailUX", "#EnterpriseUI"],
    even: true,
  },
  {
    logo: "/images/Passport-card-1.png",
    logoWidth: 257, logoHeight: 76,
    logoAlt: "PassportCard",
    title: "Designing a user-friendly app for PassportCard, making travelers easily claim tax refunds on shopping abroad.",
    text: "We created a user-friendly app for PassportCard that simplifies claiming tax refunds on international shopping—turning a complex process into a seamless, delightful traveler experience.",
    image: "/images/Passport-card-desktop-1.png",
    ...portfolioMobileFor("/images/Passport-card-desktop-1.png"),
    imageAlt: "PassportCard tax refund app",
    tags: ["#InsurTech", "#MicroAnimation", "#TravelApp"],
    even: false,
  },
];

const whyCards = [
  {
    title: "We get\nyour audience",
    body: "Aligned with the habits, journeys, and expectations of B2C users",
  },
  {
    title: "Consumer-focused expertise",
    body: "Dozens of digital products designed for top B2C brands",
  },
  {
    title: "Quick to connect",
    body: "We understand your market, so we create impact from day one",
  },
  {
    title: "Experience-first approach",
    body: "Our UX is shaped around your customers, their needs, and their lifestyle",
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

export default function B2CPage() {
  return (
    <div>

      {/* ── S1: HERO BANNER ─────────────────────────────────── */}
      <IndustryHero
        title="B2C"
        subtitle="Collaborate with product design leaders."
        description={
          <ExpandableHeroText
            preview={<>Triolla&apos;s approach to B2C unites advanced tools and efficient workflows.</>}
            moreParagraphs={[
              <>
                We craft engaging and intuitive interfaces that elevate the user experience and connect
                directly with your customers.
              </>,
              <>
                Our product design process for B2C brands focuses on usability, visual appeal, and seamless
                interaction across all digital touchpoints.
              </>,
              <>
                With Triolla, your consumer products benefit from design expertise that drives loyalty,
                boosts satisfaction, and sets your brand apart in a competitive market.
              </>,
            ]}
          />
        }
        cta={<PartnerBtn />}
        showGrid={false}
      />

      {/* ── S2: COMPANY TICKER ──────────────────────────────── */}
      <CompanyTicker names={companies} />

      {/* ── S3: PORTFOLIO ITEMS ──────────────────────────────── */}
      <section className="pt-10 lg:pt-[260px] pb-0">
        <ul className="m-0 p-0 list-none">
          {portfolioItems.map((item, i) => (
            <ScrollReveal key={i} as="li" direction="up" delay={0.1} className="mb-12 lg:mb-[144px] last:mb-0">
              <PortfolioItem {...item} />
            </ScrollReveal>
          ))}
        </ul>

        {/* Partners CTA */}
        <ScrollReveal direction="up" className="text-center pt-10 lg:pt-[80px] px-[50px] pb-16 lg:pb-[151px]">
          <p className="text-[24px] leading-[30px] text-black m-0 mb-6">
            50+ B2C consumer products and counting
          </p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      {/* ── S4: WHY B2C SECTION ──────────────────────────────── */}
      <WhyChooseUsSection
        heading={<>Why Do <br />B2C companies <br />choose us?</>}
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
