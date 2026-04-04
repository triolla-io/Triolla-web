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

const companies = ["Natural Intelligence", "IronSource", "Jfrog", "Taboola", "Electreon", "Walkme"];

const portfolioItems = [
  {
    logo: "/images/natural.png",
    logoWidth: 264, logoHeight: 72,
    logoAlt: "Natural Intelligence",
    title: "Enhancing flows and user experience in Natural Intelligence platforms. Refining and improving the UX and UI across their products.",
    text: "We focused on improving decision-making flows, visual clarity, and responsiveness across devices. Working on websites and platforms, in order to achieve a smoother, more trustworthy experience that boosted user confidence and engagement.",
    image: "/images/Natiral-Intelligence-Desktop.png",
    ...portfolioMobileFor("/images/Natiral-Intelligence-Desktop.png"),
    imageAlt: "Natural Intelligence platform",
    tags: ["#StartupProduct", "#ProductResearch", "#Platforms"],
    even: false,
  },
  {
    logo: "/images/ironsource-min.png",
    logoWidth: 259, logoHeight: 65,
    logoAlt: "ironSource",
    title: "ironSource partnered with us to elevate the UX of their monetization platform and align multiple products under one cohesive design system.",
    text: "Working to design complex workflows for advertisers and publishers, creating a cleaner, more intuitive experience. Our unified design approach improved usability, strengthened brand consistency, and laid the groundwork for future growth under Unity's expanding ecosystem.",
    image: "/images/Iron-Source-Desktop.png",
    ...portfolioMobileFor("/images/Iron-Source-Desktop.png"),
    imageAlt: "ironSource monetization platform",
    tags: ["#Ecosystem", "#Workflow", "#UserDesign"],
    even: true,
  },
  {
    logo: "/images/jfrog-min.png",
    logoWidth: 244, logoHeight: 73,
    logoAlt: "JFrog",
    title: "Creating a CEO dashboard for quick, clear insights—enabling smarter, faster decisions.",
    text: "We designed a streamlined CEO dashboard focused on high-level performance insights, giving executives a clear, real-time view of key business metrics. With smart data visualizations, customizable reports, and intuitive navigation, the dashboard supports quick, informed decision-making at a glance.",
    image: "/images/Jfrog-desktop-1.png",
    ...portfolioMobileFor("/images/Jfrog-desktop-1.png"),
    imageAlt: "JFrog CEO dashboard",
    tags: ["#CEODashboard", "#DataAnalytics", "#PerformanceInsights"],
    even: false,
  },
  {
    logo: "/images/taboola-min.png",
    logoWidth: 203, logoHeight: 60,
    logoAlt: "Taboola",
    title: "A collaboration with Taboola to redesign key parts of their publisher and advertiser platforms, improving clarity and control at scale.",
    text: "Focused on data-heavy interfaces, we worked to simplify the user journey for campaign setup, analytics, and content recommendations. The updated experience delivers faster insights, easier navigation, and a more consistent design across their suite of tools.",
    image: "/images/Taboola-desktop-2.png",
    ...portfolioMobileFor("/images/Taboola-desktop-2.png"),
    imageAlt: "Taboola platform redesign",
    tags: ["#DataInterface", "#DesignTool", "#UserJourney"],
    even: true,
  },
  {
    logo: "/images/electreon-min.png",
    logoWidth: 292, logoHeight: 48,
    logoAlt: "Electreon",
    title: "Electreon chose us to revamp their wireless charging platform with a unified, scalable design.",
    text: "We collaborated with Electreon's product and field teams to create a scalable, intuitive platform that supports operations from installation to maintenance. Our design system streamlined user flows, surfaced real-time insights, and empowered every team member—from field techs to operations managers.",
    image: "/images/Electreon-Desktop.png",
    ...portfolioMobileFor("/images/Electreon-Desktop.png"),
    imageAlt: "Electreon wireless charging platform",
    tags: ["#ProductTeam", "#DesignSystem", "#TechProduct"],
    even: false,
  },
  {
    logo: "/images/walkme-min.png",
    logoWidth: 177, logoHeight: 60,
    logoAlt: "WalkMe",
    title: "Enhancing the builder experience, we worked with WalkMe to make creating in-app guidance more intuitive and efficient for teams.",
    text: "We helped streamline the platform's core workflows and refined the UI to better support enterprise-scale usage. The new design system improved navigation, reduced friction, and made it easier for users to create and manage guidance flows.",
    image: "/images/WalkMe-Deskop.png",
    ...portfolioMobileFor("/images/WalkMe-Deskop.png"),
    imageAlt: "WalkMe guidance platform",
    tags: ["#WorkFlow", "#UserFlow", "#Enterprise"],
    even: true,
  },
];

const whyCards = [
  {
    title: "We get\nstartups",
    body: "Familiar with the language, pace, and mindset of founders and fast-moving teams.",
  },
  {
    title: "Startup-proven expertise",
    body: "SaaS & AI products launched with top startups, from MVP to scale.",
  },
  {
    title: "Momentum\nfrom the start",
    body: "We know your challenges—so we dive in and deliver value from day one.",
  },
  {
    title: "User and growth focused",
    body: "Our UX is designed to drive engagement, support your vision, and adapt as your startup evolves.",
  },
];

const designSteps = [
  "Kickoff\nMeeting", "Research &\nCompetitive\nanalysis", "User\ninterview",
  "Brain storming\nIdeate phase\nBuild usecase\n+ Flow", "Detailed\nWireframes",
  "User\nTesting", "Concepts\nDesign", "Detailed\nDesign",
];

export default function StartupsTechPage() {
  return (
    <div>
      <IndustryHero
        title="Startups &amp; Tech"
        subtitle="Partner with product design experts who get it."
        titleDir="ltr"
        description={
          <ExpandableHeroText
            preview={<>At Triolla, we speak fluent Startups &amp; Tech — from MVPs to scalable digital solutions.</>}
            moreParagraphs={[
              <>
                As startups and tech companies drive innovation, UX design is essential for turning bold ideas
                into products people love to use.
              </>,
              <>
                In the fast-paced world of technology, great UX means guiding users through new features and
                experiences with clarity, making even complex solutions feel simple and intuitive. At Triolla,
                we specialize in designing startup and tech products that move fast, scale smart, and put
                users first.
              </>,
            ]}
          />
        }
        cta={<PartnerBtn />}
      />

      <CompanyTicker names={companies} />

      <section className="pt-10 lg:pt-[260px] pb-0">
        <ul className="m-0 p-0 list-none">
          {portfolioItems.map((item, i) => (
            <ScrollReveal key={i} as="li" direction="up" delay={0.1} className="mb-12 lg:mb-[144px] last:mb-0"><PortfolioItem {...item} /></ScrollReveal>
          ))}
        </ul>
        <ScrollReveal direction="up" className="text-center pt-10 lg:pt-[80px] px-[50px] pb-16 lg:pb-[151px]">
          <p className="text-[24px] leading-[30px] text-black m-0 mb-6">50+ Startups apps and platforms and counting</p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      <WhyChooseUsSection
        heading={<>Why Do <br />Startup companies <br />choose us?</>}
        cards={whyCards}
        variant="dark"
      />

      <ClientLogosSection />
      <DesignProcessSection title={<>Our unique <br /><span>Design</span> Process</>} description="Our unique design process blends deep user insight with creative strategy to craft digital experiences that truly stand out." steps={designSteps} />
      <FaqSection />
      <PageBottomSection />
    </div>
  );
}
