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

const companies = [
  "Backgammon", "Spring game", "Survivor – CBS", "Monkey Ball", "Betiton",
  "DotaPlus", "Ironsourse- Unity", "Aspire mobile", "Cha Game", "Neogames",
  "POY", "Yellowstone",
];

const portfolioItems = [
  {
    logo: "/images/playtika-min.png",
    logoWidth: 252, logoHeight: 82,
    logoAlt: "Playtika",
    title: "Redefining game intelligence by enhancing user engagement and performance through Playtika's management and analytics platforms.",
    text: "A long and successful collaboration with Playtika on their internal platforms, focusing on analysis solutions, marketing, game experience, user satisfaction, data and more.",
    image: "/images/Playtika-desktop.png",
    ...portfolioMobileFor("/images/Playtika-desktop.png"),
    imageAlt: "Playtika analytics platform",
    tags: ["#InternalCommunication", "#GameExperience", "#UserData"],
    even: false,
  },
  {
    logo: "/images/overwolf-min.png",
    logoWidth: 300, logoHeight: 94,
    logoAlt: "Overwolf",
    title: "Empowering gaming's future with Overwolf's Eternal platform—enabling studios to create scalable, creator-driven UGC experiences.",
    text: "Overwolf's Eternal platform enables game studios to integrate community mods and content, boosting engagement, monetization, and game longevity—connecting millions of players with over 178,000 creators across 1,500+ titles.",
    image: "/images/Eternal-overwolf-desktop.png",
    ...portfolioMobileFor("/images/Eternal-overwolf-desktop.png"),
    imageAlt: "Overwolf Eternal platform",
    tags: ["#GameStudio", "#ProductPlatform", "#OnlineCommunity"],
    even: true,
  },
  {
    logo: "/images/spring-games-min.png",
    logoWidth: 191, logoHeight: 93,
    logoAlt: "Spring Games",
    title: "Bringing casual gaming to life—creating an engaging design and accessible player experience from the ground up.",
    text: "We collaborated with Spring games in order to create the UI for their mobile games with a focus on clarity, accessibility, and player immersion. From intuitive navigation and responsive controls to visually engaging menus and HUD elements.",
    image: "/images/spring-game-desktop.png",
    ...portfolioMobileFor("/images/spring-game-desktop.png"),
    imageAlt: "Spring Games mobile UI",
    tags: ["#EngagingDesign", "#MobileUI", "#MobileUX"],
    even: false,
  },
  {
    logo: "/images/cha-games-min.png",
    logoWidth: 109, logoHeight: 96,
    logoAlt: "Cha Games",
    title: "Redefining social play—Cha Games unites players with user-first, interactive mini-games.",
    text: "We designed intuitive interfaces for Cha Games' multiplayer matchmaking, leaderboards, and group challenges—enhancing engagement while ensuring a seamless, secure, and privacy-conscious experience for all users.",
    image: "/images/Cha-game-sdesktop.png",
    ...portfolioMobileFor("/images/Cha-game-sdesktop.png"),
    imageAlt: "Cha Games social platform",
    tags: ["#ProductDesigners", "#StudioDesigners", "#GamingDesign"],
    even: true,
  },
  {
    logo: "/images/my-town-min.png",
    logoWidth: 154, logoHeight: 100,
    logoAlt: "My Town Games",
    title: "Inspiring imaginative play—My Town Games lets kids explore, create, and tell stories in safe, interactive worlds.",
    text: "We partnered with My Town Games to enhance UX and visual design, creating intuitive interfaces and playful visuals that support creativity and immersive, open-ended play.",
    image: "/images/my-town-desktop.png",
    ...portfolioMobileFor("/images/my-town-desktop.png"),
    imageAlt: "My Town Games platform",
    tags: ["#VisualDesign", "#GamingProduct", "#ImmersiveExperience"],
    even: false,
  },
  {
    logo: "/images/Frame-2147223744-e1747836676565.png",
    logoWidth: 389, logoHeight: 80,
    logoAlt: "BabyTV",
    title: "Bringing early learning to life—BabyTV offers safe, playful experiences that support toddler development and parent peace of mind.",
    text: "Collaborating with BabyTV to enhance the user experience and visual design of their digital platforms, focusing on creating intuitive interfaces and engaging visuals.",
    image: "/images/BabyTV-desktop.png",
    ...portfolioMobileFor("/images/BabyTV-desktop.png"),
    imageAlt: "BabyTV digital platform",
    tags: ["#DigitalPlatforms", "#IntuitiveInterfaces", "#EngagingVisuals"],
    even: true,
  },
  {
    logo: "/images/Frame-2147223744-1.png",
    logoWidth: 360, logoHeight: 90,
    logoAlt: "Aspire Global",
    title: "Driving iGaming growth—Aspire Global powers operators with seamless, end-to-end platforms and services.",
    text: "We partnered with Aspire Global on various games to refine UX and visual design, creating clear, scalable interfaces that support both operator efficiency and user trust in regulated iGaming environments.",
    image: "/images/Aspire-global-desktop.png",
    imageAlt: "Aspire Global iGaming platform",
    tags: ["#UserTrust", "#iGaming", "#GamingExperience"],
    even: false,
  },
  {
    logo: "/images/Group-1410103797.png",
    logoWidth: 755, logoHeight: 96,
    logoAlt: "Survivor – CBS",
    title: "We created a real-time voting game for Survivor viewers, letting fans predict outcomes and vote on key moments, bringing the show's excitement to life on a second screen.",
    text: "A collaboration with CBS for the show Survivor. We designed an interactive voting game for viewers watching Survivor at home, transforming passive viewing into an engaging, real-time experience. The game lets fans cast votes on key decisions, predict outcomes, and compete with friends and other viewers.",
    image: "/images/Survivor-desktop.png",
    ...portfolioMobileFor("/images/Survivor-desktop.png"),
    imageAlt: "Survivor CBS voting game",
    tags: ["#RealTimeExperience", "#OnlineGaming", "#LiveStream"],
    even: true,
  },
];

const whyCards = [
  {
    title: "We play\nto win",
    body: "Fluent in player journeys, game mechanics, and immersive experiences.",
  },
  {
    title: "Game design expertise",
    body: "Extensive experience crafting interfaces for top gaming platforms and studios.",
  },
  {
    title: "In the game\nfrom day one",
    body: "We understand gamer culture, so we create engaging experiences right away.",
  },
  {
    title: "Fun by design",
    body: "Our UX is built for excitement, retention, and seamless player interaction.",
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

export default function GamingPage() {
  return (
    <div>
      {/* S1: HERO */}
      <IndustryHero
        title="Gaming"
        subtitle="Team up with product design specialists who deliver."
        description={
          <ExpandableHeroText
            preview={<>Fluent in Gaming, Triolla delivers immersive gameplay and engaging experiences.</>}
            moreParagraphs={[
              <>
                We design immersive and engaging interfaces that elevate gameplay and keep players coming back
                for more.
              </>,
              <>
                Our product design process for gaming focuses on intuitive navigation, captivating visuals, and
                seamless user interaction across platforms.
              </>,
              <>
                With Triolla, your gaming products benefit from design expertise that enhances player
                experience, boosts retention, and brings your creative vision to life.
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
          <p className="text-[24px] leading-[30px] text-black m-0 mb-6">50+ Gaming platforms and counting</p>
          <PartnerBtn />
        </ScrollReveal>
      </section>

      {/* S4: WHY */}
      <WhyChooseUsSection
        heading={<>Why Do <br />Gaming companies <br />choose us?</>}
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
