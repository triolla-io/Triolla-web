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
  "Jfrog", "Playtika", "Taboola", "Juxta", "LayerX", "Melingo", "PlainID",
];

const portfolioItems = [
  {
    logo: "/images/jfrog-min.png",
    logoWidth: 244, logoHeight: 73,
    logoAlt: "JFrog",
    title: "Creating a CEO dashboard for quick, clear insights—enabling smarter, faster decisions.",
    text: "We designed a streamlined CEO dashboard focused on high-level performance insights, giving executives a clear, real-time view of key business metrics. With smart data visualizations, customizable reports, and intuitive navigation, the dashboard supports quick, informed decision-making at a glance.",
    image: "/images/Jfrog-desktop.png",
    ...portfolioMobileFor("/images/Jfrog-desktop.png"),
    imageAlt: "JFrog CEO dashboard",
    tags: ["#ProductUI", "#Research", "#Interview"],
    even: false,
  },
  {
    logo: "/images/playtika-min.png",
    logoWidth: 252, logoHeight: 82,
    logoAlt: "Playtika",
    title: "Redefining game intelligence by enhancing user engagement and performance through Playtika's management and analytics platforms.",
    text: "A long and successful collaborations with Playtika on their internal platforms, focusing on analysis solutions, marketing, game experience, user satisfaction, data and more.",
    image: "/images/Playtika-desktop-2.png",
    ...portfolioMobileFor("/images/Playtika-desktop-2.png"),
    imageAlt: "Playtika analytics platform",
    tags: ["#ProductUX", "#ProductResearch", "#UserInterview"],
    even: true,
  },
  {
    logo: "/images/taboola-min.png",
    logoWidth: 203, logoHeight: 60,
    logoAlt: "Taboola",
    title: "A collaboration with Taboola to redesign key parts of their publisher and advertiser platforms, improving clarity and control at scale.",
    text: "Focused on data-heavy interfaces, we worked to simplify the user journey for campaign setup, analytics, and content recommendations. The updated experience delivers faster insights, easier navigation, and a more consistent design across their suite of tools.",
    image: "/images/Taboola-desktop.png",
    ...portfolioMobileFor("/images/Taboola-desktop.png"),
    imageAlt: "Taboola platform redesign",
    tags: ["#Product", "#UserPlatform", "#DataInterfaces"],
    even: false,
  },
  {
    logo: "/images/Juxta.png",
    logoWidth: 351, logoHeight: 42,
    logoAlt: "Juxta",
    title: "We teamed up with Juxta to design a clear, efficient platform for store management—simplifying inventory, malfunction reports, and daily operations.",
    text: "A collaboration with Juxta to design a streamlined platform for store management, covering inventory tracking, malfunction reporting, and daily operations. Focused on clarity and efficiency, the UI helps managing accurately and efficiently—improving store performance and reducing downtime.",
    image: "/images/Juxta-desktop.png",
    ...portfolioMobileFor("/images/Juxta-desktop.png"),
    imageAlt: "Juxta store management platform",
    tags: ["#ProductDesign", "#ProductUI", "#UXUI"],
    even: true,
  },
  {
    logo: "/images/layerx-min.png",
    logoWidth: 202, logoHeight: 55,
    logoAlt: "LayerX",
    title: "Working with Layer X to simplify their security platform, designing clear dashboards and workflows, making threat data more accessible and actionable.",
    text: "In a collaboration with LayerX, we delivered intuitive dashboards and smart data visuals to help IT teams easily monitor, manage, and respond to security events in real time.",
    image: "/images/Layer-x-desktop.png",
    ...portfolioMobileFor("/images/Layer-x-desktop.png"),
    imageAlt: "LayerX security platform",
    tags: ["#UXUI", "#IntuitivDesign", "#DashboardDesign"],
    even: false,
  },
  {
    logo: "/images/melingo-min.png",
    logoWidth: 208, logoHeight: 100,
    logoAlt: "Melingo",
    title: "Partnering with Melingo and Britannica to design user-friendly language learning experience—blending conversational AI with intuitive, engaging UI.",
    text: "We worked with Melingo and Britannica to design an intuitive, engaging language learning experience. We created a student app and a teacher dashboard for monitoring and student tracking.",
    image: "/images/melingo-desktop-1-1.png",
    ...portfolioMobileFor("/images/melingo-desktop-1-1.png"),
    imageAlt: "Melingo language learning platform",
    tags: ["#SystemDesign", "#UserExperience", "#DigitalDesign"],
    even: true,
  },
  {
    logo: "/images/plainid-min.png",
    logoWidth: 206, logoHeight: 60,
    logoAlt: "PlainID",
    title: "We partnered with PlainID, elevating their platform user experience and design approach.",
    text: "Designing PlainID new system—from dashboards to inner screens—creating a seamless, intuitive UX that simplifies complex authorization workflows for security teams.",
    image: "/images/plain-id-desktop.png",
    ...portfolioMobileFor("/images/plain-id-desktop.png"),
    imageAlt: "PlainID authorization platform",
    tags: ["#UXDesign", "#UI", "#Product"],
    even: false,
  },
];

const whyCards = [
  {
    title: "SaaS Expertise\nDelivered",
    body: "We understand the unique challenges, workflows, and expectations of SaaS users.",
  },
  {
    title: "Proven Results Across the Industry",
    body: "Our team has crafted high-performing SaaS platforms for top tech companies.",
  },
  {
    title: "Seamless Onboarding,\nRapid Impact",
    body: "We quickly align with your product vision and hit the ground running from day one.",
  },
  {
    title: "UX That Drives Adoption and Growth",
    body: "Our design approach puts your users, scalability, and business objectives at the center of every decision.",
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

export default function SaaSPlatformsPage() {
  return (
    <div>

      {/* ── S1: HERO BANNER ─────────────────────────────────── */}
      <IndustryHero
        title={
          <>
            <span className="block w-screen relative left-1/2 -translate-x-1/2 text-center lg:hidden">
              SaaS
            </span>
            <span className="block w-screen relative left-1/2 -translate-x-1/2 text-center lg:hidden">
              Platforms
            </span>
            <span className="hidden lg:inline">SaaS Platforms</span>
          </>
        }
        subtitle="Partner with product design experts who get it."
        contentClassName="z-10 w-full flex flex-col items-center text-center"
        titleClassName="!block !text-center"
        titleDir="ltr"
        description={
          <ExpandableHeroText
            preview={<>We speak fluent SaaS platforms — from onboarding flows to robust dashboards</>}
            moreParagraphs={[
              <>
                As SaaS platforms become essential tools for businesses and individuals, UX design is key to
                making complex capabilities accessible and user-friendly.
              </>,
              <>
                In SaaS, great UX means guiding users through workflows and features with clarity, helping
                them achieve their goals efficiently without unnecessary friction. A well-designed SaaS
                interface builds trust, drives adoption, and empowers users to take full advantage of the
                platform. By anticipating user needs and minimizing common errors, UX design ensures a seamless,
                productive, and enjoyable experience.
              </>,
              <>At Triolla, we specialize in designing SaaS platforms that are intuitive, scalable, and focused on real user success.</>,
            ]}
          />
        }
        cta={<PartnerBtn />}
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
            50+ SaaS platforms and counting
          </p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      {/* ── S4: WHY SAAS SECTION ─────────────────────────────── */}
      <WhyChooseUsSection
        heading={<>Why Do <br />SaaS companies <br />choose us?</>}
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
