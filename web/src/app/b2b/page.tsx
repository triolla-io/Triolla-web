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
import ClientLogosSection from "@/components/ClientLogosSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import DesignProcessSection from "@/components/DesignProcessSection";
import FaqSection from "@/components/FaqSection";
import PageBottomSection from "@/components/PageBottomSection";

/* ── data ─────────────────────────────────────────────────── */

const companies = [
  "Jfrog", "Adam Milo", "Percepto", "Comax", "Solar Edge",
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
    tags: ["#ProductDesign", "#UXUI", "#UserExperience"],
    even: false,
  },
  {
    logo: "/images/adam-milo-min.png",
    logoWidth: 266, logoHeight: 88,
    logoAlt: "Adam Milo",
    title: "Shaping smarter HR decisions, we helped Adam Milo create an intuitive platform for candidate assessments, enabling faster, data-driven decisions.",
    text: "We partnered with Adam Milo to design their candidate assessment platform. Our work focused on creating an intuitive interface for conducting skill tests, personality evaluations, and reliability screenings—helping employers make faster, data-driven hiring decisions.",
    image: "/images/adam-milo-desktop.png",
    ...portfolioMobileFor("/images/adam-milo-desktop.png"),
    imageAlt: "Adam Milo HR assessment platform",
    tags: ["#UXUIDesign", "#ProductUI", "#UserResearch"],
    even: true,
  },
  {
    logo: "/images/percepto-min.png",
    logoWidth: 284, logoHeight: 71,
    logoAlt: "Percepto",
    title: "Driving innovation, we enhanced the UX of a global leader's autonomous drone and industrial inspection platforms.",
    text: "Our team designed intuitive dashboards, smart alert systems, and responsive interfaces to make complex drone data clear and actionable.",
    image: "/images/Percepto-Desktop.png",
    imageAlt: "Percepto drone inspection platform",
    tags: ["#DroneDesign", "#Dashboards", "#SmartSystems"],
    even: false,
  },
  {
    logo: "/images/Comax-min.png",
    logoWidth: 257, logoHeight: 76,
    logoAlt: "Comax",
    title: "Transforming retail management, we streamlined COMAX's ERP and kiosk screens with intuitive UI and seamless integration.",
    text: "We worked with Comax to simplify and modernize their ERP and kiosk retail platforms with clean, user-friendly UX/UI. Our design improved daily workflows, from warehouse management to point-of-sale, making complex tasks faster and more intuitive.",
    image: "/images/Comax-Desktop-1.png",
    ...portfolioMobileFor("/images/Comax-Desktop-1.png"),
    imageAlt: "Comax ERP platform",
    tags: ["#Platforms", "#UserFriendly", "#POS"],
    even: true,
  },
  {
    logo: "/images/solar-edge-min.png",
    logoWidth: 252, logoHeight: 51,
    logoAlt: "SolarEdge",
    title: "Supporting smart energy innovation, we collaborated with SolarEdge to enhance their solar system platforms for better user experience and efficiency.",
    text: "We partnered with SolarEdge to design intuitive interfaces for their monitoring screens and back-office platform. Our work focused on improving data visualization and streamlining workflows, enabling users to easily track system performance and manage operations efficiently.",
    image: "/images/Solaredge-Desktop.png",
    ...portfolioMobileFor("/images/Solaredge-Desktop.png"),
    imageAlt: "SolarEdge monitoring platform",
    tags: ["#UserEngagement", "#IntuitiveDashboards", "#ControlTower"],
    even: false,
  },
];

const whyCards = [
  {
    title: "We speak\nyour language",
    body: "Fluent in the terms, workflows, and mindset of B2B users",
  },
  {
    title: "Proven B2B expertise",
    body: "50+ SaaS platforms designed for leading B2B companies",
  },
  {
    title: "Ready to deliver\nfrom day one",
    body: "We understand your business, so we hit the ground running",
  },
  {
    title: "Business-driven design",
    body: "Our UX is created for your users, processes, and enterprise needs",
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

export default function B2BPage() {
  return (
    <div>

      {/* ── S1: HERO BANNER ─────────────────────────────────── */}
      <IndustryHero
        title="B2B"
        subtitle="Work with product design experts who understand you."
        description={
          <ExpandableHeroText
            preview={<>Fluent in B2B, Triolla delivers enterprise tools and efficient workflows.</>}
            moreParagraphs={[
              <>
                We design intuitive interfaces that drive business results, tailoring every solution to the
                unique challenges of B2B environments.
              </>,
              <>
                Our product design process focuses on usability, scalability, and seamless integration with
                enterprise workflows.
              </>,
              <>
                With Triolla, your business benefits from product design expertise that empowers growth and
                delivers measurable value.
              </>,
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

        <ScrollReveal direction="up" className="text-center pt-10 lg:pt-[80px] px-[50px] pb-16 lg:pb-[151px]">
          <p className="text-[24px] leading-[30px] text-black m-0 mb-6">
            50+ B2B platforms and counting
          </p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      {/* ── S4: WHY B2B SECTION ──────────────────────────────── */}
      <WhyChooseUsSection
        heading={<>Why Do <br />B2B companies <br />choose us?</>}
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
