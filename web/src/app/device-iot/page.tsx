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

const companies = ["Bermad", "Essence Smartcare", "Tadiran", "Noveto", "Ayyeka", "Arkit"];

const portfolioItems = [
  {
    logo: "/images/bermad-min.png",
    logoWidth: 248, logoHeight: 68,
    logoAlt: "Bermad",
    title: "Empowering smarter irrigation, we designed Bermad's platform—making it easy for users to monitor, manage, & optimize water systems efficiently.",
    text: "We partnered with Bermad to design a user-friendly interface for their advanced irrigation platform. Our work focused on simplifying complex water management tasks through intuitive layouts, real-time data visualization, and streamlined controls—empowering users to easily monitor, adjust, and optimize their irrigation systems for greater efficiency and control.",
    image: "/images/Frame-2147224067-2.png",
    ...portfolioMobileFor("/images/Frame-2147224067-2.png"),
    imageAlt: "Bermad irrigation platform",
    tags: ["#ProductUI", "#ProductResearch", "#ProductInterface"],
    even: false,
  },
  {
    logo: "/images/Esences.png",
    logoWidth: 194, logoHeight: 90,
    logoAlt: "Essence Smartcare",
    title: "Designing an intuitive platform for Essence Group, helping providers monitor patients and respond quickly through a clear, user-friendly interface.",
    text: "We worked with Essence Group to design a user-friendly healthcare platform for providers, simplifying patient monitoring, alerts, and real-time response. Our UI/UX made complex telecare tools more accessible, supporting faster, more effective care.",
    image: "/images/Essence-desktop.png",
    ...portfolioMobileFor("/images/Essence-desktop.png"),
    imageAlt: "Essence healthcare platform",
    tags: ["#ProductUX", "#ProductResearch", "#UIDesign", "#UserInterview"],
    even: true,
  },
  {
    logo: "/images/Tadiran-1.png",
    logoWidth: 272, logoHeight: 71,
    logoAlt: "Tadiran",
    title: "Reimagining climate control—Tadiran's app lets users manage their indoor environment effortlessly, anytime, anywhere.",
    text: "We redesigned the smart climate control app to turn complex functionality into a clean, intuitive, and accessible experience—focusing on clear interactions and seamless connectivity.",
    image: "/images/Tadiran.png",
    ...portfolioMobileFor("/images/Tadiran.png"),
    imageAlt: "Tadiran climate control app",
    tags: ["#AppDesign", "#AppExperience", "#UserExperience"],
    even: false,
  },
  {
    logo: "/images/noveto-min.png",
    logoWidth: 223, logoHeight: 44,
    logoAlt: "Noveto",
    title: "Noveto partnered with us to design their innovative \u201cinvisible headphone\u201d experience, transforming how users engage with spatial audio.",
    text: "We developed an intuitive interface that seamlessly integrates with Noveto's i3DS™ technology, allowing users to personalize their audio environment without physical wearables. The design emphasizes simplicity, accessibility, and a futuristic aesthetic, aligning with Noveto's vision of immersive, headphone-free sound.",
    image: "/images/Novetto-desktop.png",
    ...portfolioMobileFor("/images/Novetto-desktop.png"),
    imageAlt: "Noveto spatial audio experience",
    tags: ["#MotionDesign", "#TechProduct", "#TechStartup"],
    even: true,
  },
  {
    logo: "/images/ayyeka-min.png",
    logoWidth: 207, logoHeight: 60,
    logoAlt: "Ayyeka",
    title: "Ayyeka partnered with us to revamp their IIoT platform, enhancing accessibility and usability of remote infrastructure data.",
    text: "We worked closely with Ayyeka to redesign their IIoT platform, focusing on making complex remote infrastructure data easy to access and act on. Our process involved user research, simplifying workflows, and creating clear data visualizations—ensuring operators can monitor assets efficiently and make informed decisions quickly.",
    image: "/images/Ayyeka-desktop.png",
    ...portfolioMobileFor("/images/Ayyeka-desktop.png"),
    imageAlt: "Ayyeka IIoT platform",
    tags: ["#Platform", "#Design", "#IoT"],
    even: false,
  },
  {
    logo: "/images/arkit-min.png",
    logoWidth: 168, logoHeight: 75,
    logoAlt: "Arkit",
    title: "Our team crafted Arkit's app for easy, private control of their device, blending advanced technology with a simple, secure interface.",
    text: "We collaborated with Arkit to create an intuitive app for controlling their advanced device. Our design prioritized ease of use, privacy, and customization, delivering a smooth and secure experience that empowers users to confidently manage their wellbeing.",
    image: "/images/Arkit-desktop.png",
    ...portfolioMobileFor("/images/Arkit-desktop.png"),
    imageAlt: "Arkit app design",
    tags: ["#AppDesign", "#Privacy", "#UserExperience"],
    even: true,
  },
];

const whyCards = [
  {
    title: "We connect\nthe dots",
    body: "Full mastery in the interactions, data flows, and logic of connected devices",
  },
  {
    title: "IoT-driven expertise",
    body: "Extensive experience designing interfaces for smart devices and IoT platforms",
  },
  {
    title: "Plugged in\nfrom the start",
    body: "We understand device ecosystems, so we accelerate your project from day one",
  },
  {
    title: "Seamless integration mindset",
    body: "Our UX is crafted for real-time data, device reliability, and user convenience",
  },
];

const designSteps = [
  "Kickoff\nMeeting", "Research &\nCompetitive\nanalysis", "User\ninterview",
  "Brain storming\nIdeate phase\nBuild usecase\n+ Flow", "Detailed\nWireframes",
  "User\nTesting", "Concepts\nDesign", "Detailed\nDesign",
];

export default function DeviceIoTPage() {
  return (
    <div>
      <IndustryHero
        title="Devices &amp; IoT"
        subtitle="Work with the best product designers."
        description={
          <ExpandableHeroText
            preview={<>Triolla brings Devices &amp; IoT products to life with smart tools and workflows.</>}
            moreParagraphs={[
              <>
                We design intuitive and reliable interfaces that bridge the gap between users and connected
                devices, ensuring seamless interaction in the IoT ecosystem.
              </>,
              <>
                Our product design process emphasizes usability, real-time data visualization, and effortless
                device integration for smart environments. With Triolla, your IoT product benefits from design
                expertise that empowers users and drives adoption.
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
          <p className="text-[24px] leading-[30px] text-black m-0 mb-6">50+ IoT projects and counting</p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      <WhyChooseUsSection
        heading={<>Why Do <br />IoT companies <br />choose us?</>}
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
