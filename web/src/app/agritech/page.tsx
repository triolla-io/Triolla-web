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

const companies = [
  "Beewise", "Agritask", "Bermad", "Manna", "ReelView", "Supplant",
  "BlueCircle", "Netafim", "Treetoscope", "STK Bio", "Phi-Tech",
];

const portfolioItems = [
  {
    logo: "/images/supplant-min.png",
    logoWidth: 229, logoHeight: 72,
    logoAlt: "SupPlant",
    title: "Revolutionizing Agriculture with SupPlant – Partnering with us to Drive Smart Irrigation",
    text: "Supplant harnesses AI and plant-sensing technology to optimize irrigation, conserving water and enhancing crop yields. Our teams partnered on product design and UX research to refine their digital platform, delivering real-time insights that help farmers worldwide.",
    image: "/images/Frame-2147224063-1.png",
    ...portfolioMobileFor("/images/Frame-2147224063-1.png"),
    imageAlt: "SupPlant smart irrigation platform",
    tags: ["#ProductUI", "#AIProduct", "#UXResearch", "#PlatformDesign"],
    even: false,
  },
  {
    logo: "/images/rivulis-min.png",
    logoWidth: 215, logoHeight: 72,
    logoAlt: "Rivulis",
    title: "Reimagining Irrigation Excellence with Rivulis – Pioneering Sustainable Farming Solutions",
    text: "Rivulis leads the way in micro-irrigation solutions, offering a comprehensive portfolio of products and smart farming technologies. They partnered with us to enhance their digital platforms, delivering user-centric designs that empower farmers worldwide to optimize water usage and boost crop yields.",
    image: "/images/Frame-2147224064.png",
    ...portfolioMobileFor("/images/Frame-2147224064.png"),
    imageAlt: "Rivulis irrigation platform",
    tags: ["#UXUIDesign", "#SmartFarming", "#AgriTechProduct", "#AppDesign"],
    even: true,
  },
  {
    logo: "/images/beewise-min.png",
    logoWidth: 258, logoHeight: 82,
    logoAlt: "Beewise",
    title: "Innovating Beekeeping with Beewise – Collaborative Technology for a Sustainable Future",
    text: "Beewise is transforming beekeeping through AI and robotics, addressing challenges like hive distance, timing, and expertise. Our collaboration focused on enhancing their digital platforms, delivering user-centric designs that empower beekeepers worldwide to optimize hive management and protect the global food supply.",
    image: "/images/Frame-2147224065-1.png",
    ...portfolioMobileFor("/images/Frame-2147224065-1.png"),
    imageAlt: "Beewise hive management platform",
    tags: ["#ProductUX", "#ProductUI", "#AIDesign", "#DigitalPlatforms", "#Robotics"],
    even: false,
  },
  {
    logo: "/images/solar-edge-min.png",
    logoWidth: 252, logoHeight: 51,
    logoAlt: "SolarEdge",
    title: "Real-Time Insight, Worldwide Impact.",
    text: "Our collaboration centered on elevating their digital platforms, with a key highlight being the design of their new Control Tower Center. This innovative hub provides real-time oversight of eight global factories overseas, empowering their teams to seamlessly monitor, manage, and optimize operations worldwide from a single, intuitive interface.",
    image: "/images/Frame-2147224066-1.png",
    ...portfolioMobileFor("/images/Frame-2147224066-1.png"),
    imageAlt: "SolarEdge control tower",
    tags: ["#ProductDesign", "#ProductResearch", "#UserExperience"],
    even: true,
  },
  {
    logo: "/images/bermad-min.png",
    logoWidth: 248, logoHeight: 68,
    logoAlt: "Bermad",
    title: "Real-time field sensor monitoring for smarter irrigation with Bermad.",
    text: "Empowering Bermad users with real-time control and insights through our smart field IoT sensor monitoring system for efficient irrigation management.",
    image: "/images/Frame-2147224067-2.png",
    ...portfolioMobileFor("/images/Frame-2147224067-2.png"),
    imageAlt: "Bermad IoT sensor platform",
    tags: ["#ProductDesign", "#UXUIDesign", "#IoTDevice", "#UXUIAgritech"],
    even: false,
  },
];

const whyCards = [
  {
    title: "We speak\nyour language",
    body: "Fluent in the terms, flows, and mindset of agritech users",
  },
  {
    title: "Battle-tested experience",
    body: "Over 50 Apps & SaaS platforms designed for top-tier agritech companies",
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

export default function AgritechPage() {
  return (
    <div>
      {/* S1: HERO */}
      <IndustryHero
        title="Agritech"
        subtitle="Partner with product design experts who get it."
        description={
          <ExpandableHeroText
            preview={<>At Triolla, we speak fluent Agritech — from smart farming to precision agriculture.</>}
            moreParagraphs={[
              <>
                We design smart, user-friendly interfaces that simplify complex agricultural processes and
                empower innovation in the Agritech sector.
              </>,
              <>
                Our product design approach focuses on usability, data-driven insights, and seamless
                integration with agri-management systems.
              </>,
              <>
                With Triolla, your Agritech solutions benefit from design expertise that drives efficiency,
                support, and helps your business grow.
              </>,
            ]}
          />
        }
        cta={<PartnerBtn />}
      />

      {/* S2: TICKER */}
      <CompanyTicker names={companies} />

      {/* S3: PORTFOLIO ITEMS */}
      <section className="pt-10 lg:pt-[260px] pb-0">
        <ul className="m-0 p-0 list-none">
          {portfolioItems.map((item, i) => (
            <ScrollReveal key={i} as="li" direction="up" delay={0.1} className="mb-12 lg:mb-[144px] last:mb-0">
              <PortfolioItem {...item} />
            </ScrollReveal>
          ))}
        </ul>
        <ScrollReveal direction="up" className="text-center pt-10 lg:pt-[80px] px-[50px] pb-16 lg:pb-[151px]">
          <p className="text-[24px] leading-[30px] text-black m-0 mb-6">50+ Agritech platforms and counting</p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      {/* S4: WHY */}
      <WhyChooseUsSection
        heading={<>Why Do <br />Agritech companies <br />choose us?</>}
        cards={whyCards}
        variant="dark"
      />

      {/* S5-S8 */}
      <ClientLogosSection />
      <DesignProcessSection
        title={<>Our unique <br /><span>Design</span> Process</>}
        description="Our unique design process blends deep user insight with creative strategy to craft digital experiences that truly stand out."
        steps={designSteps}
      />
      <FaqSection />
      <PageBottomSection />
    </div>
  );
}
