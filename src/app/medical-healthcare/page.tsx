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
  "MeverickAI", "InHouse. Health", "DigitalOwl", "Elastimed", "Anima biotech",
  "Trialog", "Kaizen", "Medwise App", "Human - X", "AFC industries", "Evogene",
  "Ichilov Hospital", "Soroka Hospital", "Soroka", "One Step", "Neuralight",
  "Clewmed", "Edwards", "Optio", "Binah", "Calmigo", "Muscle & motion",
  "Arkit", "Vetpet", "Alma",
];

const portfolioItems = [
  {
    logo: "/images/ichilov-min.png",
    logoWidth: 217, logoHeight: 74,
    logoAlt: "Ichilov Hospital",
    title: "Powering Informed Decisions for Hospital Leaders - Real time control room",
    text: "Ichilov Hospital partnered with us to design and build an advanced control room for hospital leadership, enabling real-time visibility across the hospital and empowering better, faster decision-making.",
    image: "/images/Ichilov-image-desktop.png",
    ...portfolioMobileFor("/images/Ichilov-image-desktop.png"),
    imageAlt: "Ichilov Hospital control room",
    tags: ["#ProductLeaders", "#Medtech", "#Controlroom", "#UXUI"],
    even: false,
  },
  {
    logo: "/images/Sweetch-min.png",
    logoWidth: 239, logoHeight: 79,
    logoAlt: "Sweetch",
    title: "Redesigning Wellness Experiences for Greater Daily Impact",
    text: "Sweetch blends behavioral science with innovative technology to provide personalized, real-time health interventions that increase engagement and deliver results. They partnered with us to redesign their app, making it easier for users to stay engaged and active every day.",
    image: "/images/Sweetch-image-desktop.png",
    ...portfolioMobileFor("/images/Sweetch-image-desktop.png"),
    imageAlt: "Sweetch wellness app",
    tags: ["#AppsDesign", "#ProductDesign", "#ProductResearch", "#Personalization"],
    even: true,
  },
  {
    logo: "/images/edwards-min.png",
    logoWidth: 260, logoHeight: 93,
    logoAlt: "Edwards Lifesciences",
    title: "Real-Time Heart Monitoring, Smarter Decisions",
    text: "We partnered with Edwards Lifesciences to help innovate a new product that uses advanced sensors to monitor heart conditions in real time—enabling cardiologists to make informed decisions instantly, based on live data.",
    image: "/images/Edwards-image-desktop.png",
    ...portfolioMobileFor("/images/Edwards-image-desktop.png"),
    imageAlt: "Edwards heart monitoring platform",
    tags: ["#UXUIDesign", "#ProductLaunch", "#MedtechProduct", "#UserInterface"],
    even: false,
  },
  {
    logo: "/images/elasitmed-min.png",
    logoWidth: 240, logoHeight: 53,
    logoAlt: "ElastiMed",
    title: "Enhancing Compression Therapy with Connected Guidance",
    text: "We designed a new IoT App for ElastiMed's smart compression sock. The app guides users on proper use and offers real-time feedback to maximize results.",
    image: "/images/Elasitmed-image-desktop.png",
    ...portfolioMobileFor("/images/Elasitmed-image-desktop.png"),
    imageAlt: "ElastiMed IoT app",
    tags: ["#AppUX", "#AppUI", "#IoTforMedical", "#DigitalDesign"],
    even: true,
  },
  {
    logo: "/images/twist-min.png",
    logoWidth: 181, logoHeight: 99,
    logoAlt: "Twist Bioscience",
    title: "Pioneering Synthetic DNA with Twist Bioscience – Accelerating innovation",
    text: "Twist Bioscience partnered with us to redesign their cutting-edge silicon platform, enabling high-precision, scalable DNA synthesis and driving advancements in research, diagnostics, and therapeutics.",
    image: "/images/Twist-image-desktop.png",
    ...portfolioMobileFor("/images/Twist-image-desktop.png"),
    imageAlt: "Twist Bioscience platform",
    tags: ["#PlatformProduct", "#Redesign", "#DataAnalytics", "#Medical"],
    even: false,
  },
  {
    logo: "/images/digitalowl-min.png",
    logoWidth: 281, logoHeight: 54,
    logoAlt: "DigitalOwl",
    title: "Transforming Medical Data with DigitalOwl – Delivering precision and efficiency through advanced technology",
    text: "DigitalOwl partnered with Triolla to redesign their entire platform, making it easier for companies to search and gain insights from patients' extensive medical histories—helping them make better, data-driven decisions.",
    image: "/images/Digitalowl-image-desktop-1.png",
    ...portfolioMobileFor("/images/Digitalowl-image-desktop-1.png"),
    imageAlt: "DigitalOwl medical data platform",
    tags: ["#PlatformDesign", "#MedicalProducts", "#UX", "#UI", "#Design"],
    even: true,
  },
  {
    logo: "/images/soroka-min.png",
    logoWidth: 176, logoHeight: 55,
    logoAlt: "Soroka Medical Center",
    title: "Leading Healthcare Innovation in Israel's South – Soroka Medical Center",
    text: "We partnered with Soroka Medical Center to revolutionize their healthcare management systems. By implementing advanced data solutions and optimizing workflows, we enhanced patient care, streamlined administrative processes, and empowered their medical teams to focus on delivering exceptional health outcomes for the Negev community.",
    image: "/images/Soroka-image-desktop.png",
    ...portfolioMobileFor("/images/Soroka-image-desktop.png"),
    imageAlt: "Soroka Medical Center platform",
    tags: ["#DesignSystem", "#UserExperience", "#UserJourney", "#Medical"],
    even: false,
  },
];

const whyCards = [
  {
    title: "We understand\nhealthcare",
    body: "Fluent in clinical workflows, patient needs, and regulatory standards",
  },
  {
    title: "Healthcare design expertise",
    body: "Over 70 digital solutions for medical and health organizations",
  },
  {
    title: "Ready to care\nfrom day one",
    body: "We know your environment, so we deliver meaningful results quickly",
  },
  {
    title: "High end design",
    body: "Our UX focuses on accessibility and empowering both patients and professionals",
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

export default function MedicalHealthcarePage() {
  return (
    <div>
      {/* S1: HERO */}
      <IndustryHero
        title="Digital Health"
        subtitle="Team up with product design pros."
        description={
          <ExpandableHeroText
            preview={<>Triolla&apos;s approach to Medical &amp; Healthcare unites experience and innovation.</>}
            moreParagraphs={[
              <>
                We design clear and accessible interfaces that support patient care and streamline complex
                medical workflows in the healthcare sector.
              </>,
              <>
                Our product design process prioritizes usability, regulatory compliance, and seamless
                integration with healthcare systems to ensure safe and effective user experiences.
              </>,
              <>
                With Triolla, your medical and healthcare solutions benefit from design expertise that
                improves outcomes, builds trust, and empowers both patients and professionals.
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
          <p className="text-[24px] leading-[30px] text-black m-0 mb-6">50+ Medical Healthcare platforms and counting</p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      {/* S4: WHY */}
      <WhyChooseUsSection
        heading={<>Why Do <br />Medical companies <br />choose us?</>}
        cards={whyCards}
        variant="dark"
      />

      {/* S5-S8: shared components */}
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
