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

const companies = [
  "Jfrog",
  "Ichilov hospital",
  "Melingo",
  "Surely",
  "Geneo",
  "Human Xtensions",
  "Stern",
  "Cytaka",
];

const portfolioItems = [
  {
    logo: "/images/jfrog-min.png",
    logoWidth: 244,
    logoHeight: 73,
    logoAlt: "JFrog",
    title: "A Platform For Managing Internal Servers",
    text: "We developed an efficient platform for managing internal servers, providing IT teams and administrators with a centralized, real-time overview of server status and performance. With advanced monitoring tools, customizable alerts, and intuitive controls, the platform streamlines server management, enhances operational visibility, and enables rapid response to technical issues.",
    image: "/images/Jfrog-desktop-1.png",
    ...portfolioMobileFor("/images/Jfrog-desktop-1.png"),
    imageAlt: "JFrog internal server management platform",
    imageWidth: 1001,
    imageHeight: 980,
    tags: ["#PlatformDevelopment", "#InternalServers", "#UserInterview"],
    even: false,
  },
  {
    logo: "/images/ichilov-min.png",
    logoWidth: 217,
    logoHeight: 74,
    logoAlt: "Ichilov Hospital",
    title: "Ichilov hospital control-tower center",
    text: "Ichilov hospital partnered with Triolla to develop a new control tower center featuring multi dashboards. This web platform, built with Vue and fully integrated with the hospital’s backend, was developed over 10 months by a dedicated team of professionals.",
    image: "/images/Ichilov-image-desktop.png",
    ...portfolioMobileFor("/images/Ichilov-image-desktop.png"),
    imageAlt: "Ichilov Hospital control tower center",
    imageWidth: 1000,
    imageHeight: 980,
    tags: ["#MultiDashboards", "#WebPlatform", "#ControlTowerCenter"],
    even: true,
  },
  {
    logo: "/images/melingo-min.png",
    logoWidth: 208,
    logoHeight: 100,
    logoAlt: "Melingo",
    title: "AI-Powered Language Learning Platform",
    text: "Triolla developed an AI-powered B2B2C language learning platform and hybrid mobile app with Flutter, fully integrated with the company’s backend.",
    image: "/images/Melingo-desktop.png",
    ...portfolioMobileFor("/images/Melingo-desktop.png"),
    imageAlt: "Melingo AI language learning platform",
    imageWidth: 1000,
    imageHeight: 980,
    tags: ["#B2B2C", "#AI", "#Flutter", "#LearningPlatform"],
    even: false,
  },
];

const whyCards = [
  {
    title: "We speak\nyour tech",
    body: "We know the frameworks, processes, and mindset that drive today’s development teams.",
  },
  {
    title: "Built on real-world expertise",
    body: "With products delivered for top brands, our experience powers your next project.",
  },
  {
    title: "Instant momentum",
    body: "We get your domain—so we dive in and start delivering value from day one.",
  },
  {
    title: "Reliability at every step",
    body: "Our development puts users, performance, and security at the heart of every solution.",
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

export default function DevPage() {
  return (
    <div>
      <IndustryHero
        eyebrow="End-to-End product"
        title="Dev"
        subtitle="Choose development experts who get things done."
        titleDir="ltr"
        description={
          <ExpandableHeroText
            preview={<>Building scalable, integrated platforms &amp; apps is what we do best at Triolla</>}
            moreParagraphs={[
              <>
                At Triolla, we speak fluent development—delivering end-to-end software solutions for startups and
                enterprises alike. From seamless API integrations and scalable cloud architectures to robust backend
                development and intuitive frontend interfaces, our team specializes in building high-performance web
                applications, SaaS platforms, IoT systems, and B2B digital products. We combine agile development
                methodologies, secure coding practices, and user-centered design to ensure every product is reliable,
                scalable, and ready for growth. Whether you need custom software development, enterprise system
                integration, or full-cycle product engineering, Triolla is your trusted partner for innovative,
                future-proof digital solutions.
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
            <ScrollReveal key={i} as="li" direction="up" delay={0.1} className="mb-12 lg:mb-[144px] last:mb-0">
              <PortfolioItem {...item} />
            </ScrollReveal>
          ))}
        </ul>

        <ScrollReveal direction="up" className="text-center pt-10 lg:pt-[80px] px-[50px] pb-16 lg:pb-[151px]">
          <p className="text-[24px] leading-[30px] text-black m-0 mb-6">
            Our development experience and expertise just keep on growing
          </p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      <WhyChooseUsSection
        heading={
          <>
            Why Do <br />
            tech companies <br />
            choose us?
          </>
        }
        cards={whyCards}
        variant="dark"
      />

      <ClientLogosSection />

      <DesignProcessSection
        title={
          <>
            Our unique <br />
            <span>Design</span> Process
          </>
        }
        description="Our unique design process blends deep user insight with creative strategy to craft digital experiences that truly stand out."
        steps={designSteps}
      />

      <FaqSection />

      <PageBottomSection />
    </div>
  );
}
