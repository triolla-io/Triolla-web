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

const companies = ["Tadiran", "Swetch", "Melingo", "PassportCard", "Hot", "CBS Survivor", "Overwolf", "Playtika"];

const portfolioItems = [
  {
    logo: "/images/Tadiran-1.png",
    logoWidth: 272, logoHeight: 71,
    logoAlt: "Tadiran",
    title: "Reimagining climate control—Tadiran's app lets users manage their indoor environment effortlessly, anytime, anywhere.",
    text: "We redesigned the smart climate control app to turn complex functionality into a clean, intuitive, and accessible experience—focusing on clear interactions and seamless connectivity.",
    image: "/images/Tadiran.png",
    ...portfolioMobileFor("/images/Tadiran.png"),
    imageAlt: "Tadiran climate control app",
    tags: ["#ControlApp", "#UserExperience", "#ProductDesign"],
    even: false,
  },
  {
    logo: "/images/Sweetch-min.png",
    logoWidth: 239, logoHeight: 79,
    logoAlt: "Sweetch",
    title: "Transforming chronic care—Sweetch App delivers personalized interventions tailored to each health journey.",
    text: "We collaborated with Sweetch to enhance both the user experience and visual identity of their digital health app. Alongside refining navigation and simplifying complex health data, we developed a warm, approachable illustration style that reinforces motivation and trust.",
    image: "/images/Sweetch-desktop.png",
    ...portfolioMobileFor("/images/Sweetch-desktop.png"),
    imageAlt: "Sweetch health app",
    tags: ["#HealthApp", "#ProductUI", "#ProductUX"],
    even: true,
  },
  {
    logo: "/images/melingo-min.png",
    logoWidth: 208, logoHeight: 100,
    logoAlt: "Melingo",
    title: "Partnering with Melingo and Britannica to design user-friendly language learning experience—blending conversational AI with intuitive, engaging UI.",
    text: "We worked with Melingo and Britannica to design an intuitive, engaging language learning experience. We created a student app and a teacher dashboard for monitoring and student tracking.",
    image: "/images/Melingo-desktop.png",
    ...portfolioMobileFor("/images/Melingo-desktop.png"),
    imageAlt: "Melingo language learning app",
    tags: ["#EdTech", "#IntuitiveDesign", "#LearningExperience"],
    even: false,
  },
  {
    logo: "/images/Passport-card-1.png",
    logoWidth: 257, logoHeight: 76,
    logoAlt: "PassportCard",
    title: "PassportCard offers international health insurance with instant coverage, personalized service, and an innovative user experience—so you can travel with peace of mind.",
    text: "We partnered with PassportCard to enhance the user experience and visual design—creating intuitive interfaces and a friendly visual language that supports a clear, accessible, and personalized experience.",
    image: "/images/Passport-card-desktop.png",
    ...portfolioMobileFor("/images/Passport-card-desktop.png"),
    imageAlt: "PassportCard insurance app",
    tags: ["#PersonalizedExperience", "#UserResearch", "#ProductResearch"],
    even: true,
  },
  {
    logo: "/images/Hot-1.png",
    logoWidth: 97, logoHeight: 66,
    logoAlt: "Hot",
    title: "Redesigning Hot clients club app, offering a seamless experience where users can quickly browse, activate, and redeem offers, all within a clean, intuitive interface.",
    text: "Designing Hot's club card app, focusing on making discounts and offers easily accessible and rewarding. The app offers a seamless experience where users can quickly browse, activate, and redeem offers, all within a clean, intuitive interface.",
    image: "/images/Hot-desktop.png",
    ...portfolioMobileFor("/images/Hot-desktop.png"),
    imageAlt: "Hot club card app",
    tags: ["#IntuitiveInterface", "#AppDesign", "#ExperienceDesign"],
    even: false,
  },
];

const whyCards = [
  {
    title: "We think\nmobile-first",
    body: "We know about user flows, gestures, and the dynamics of mobile experiences.",
  },
  {
    title: "App design expertise",
    body: "A proven record designing intuitive and engaging mobile applications.",
  },
  {
    title: "Onboard\nfrom day one",
    body: "We understand mobile users, so we deliver value from the very start.",
  },
  {
    title: "Experience in your pocket",
    body: "Our UX is crafted for usability, speed, and seamless interaction on any device.",
  },
];

const designSteps = [
  "Kickoff\nMeeting", "Research &\nCompetitive\nanalysis", "User\ninterview",
  "Brain storming\nIdeate phase\nBuild usecase\n+ Flow", "Detailed\nWireframes",
  "User\nTesting", "Concepts\nDesign", "Detailed\nDesign",
];

export default function MobileAppsPage() {
  return (
    <div>
      <IndustryHero
        title="Mobile Apps"
        subtitle="Design a product with experts who understand your needs."
        description={
          <ExpandableHeroText
            preview={<>In the world of Mobile Apps, Triolla creates intuitive interfaces and powerful features.</>}
            moreParagraphs={[
              <>
                As mobile experiences become more central to daily life, UX design plays a crucial role in
                making powerful features accessible and intuitive.
              </>,
              <>
                In mobile apps, great UX means guiding users through key actions with clarity and ease, without
                overwhelming them with unnecessary complexity. A well-designed mobile experience builds loyalty,
                drives engagement, and empowers users to get the most out of every interaction. At Triolla, we
                specialize in designing mobile apps that are beautiful, intuitive, and built for real people.
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
          <p className="text-[24px] leading-[30px] text-black m-0 mb-6">50+ Mobile Apps platforms and counting</p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      <WhyChooseUsSection
        heading={<>Why Do <br />Mobile App companies <br />choose us?</>}
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
