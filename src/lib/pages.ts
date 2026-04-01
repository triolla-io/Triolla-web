export interface PortfolioItem {
  id: number;
  logo: string;
  title: string;
  text: string;
  image: string;
  tags: string[];
}

export interface ServiceItem {
  title: string;
  description: string;
  menuItems: { label: string; href: string }[];
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 1,
    logo: "/images/armis_logo.svg",
    title: "Armis chose us to lead the complete redesign of their platform and build a unified design system across all their products",
    text: "Over the course of a year, with two dedicated designers deeply embedded in their teams, we built a scalable design system and completely redesigned their security management platform.",
    image: "/images/armis_img.svg",
    tags: ["Cyber Security", "SaaS", "Design System"],
  },
  {
    id: 2,
    logo: "/images/suridata_logo.svg",
    title: "Shaping the future of digital healthcare with user-centered design — trusted by top medical brands.",
    text: "We know the users, the lingo, and the pain points. Avoid the headaches of working with a generic agency and partner with a team that speaks your language.",
    image: "/images/suridata_img.svg",
    tags: ["Medical", "UX Research", "B2B"],
  },
  {
    id: 3,
    logo: "/images/cyngular_logo.svg",
    title: "Building enterprise-grade SaaS platforms that scale with your business and delight your users.",
    text: "From complex dashboards to intuitive workflows — we design and develop full-stack products that enterprise teams love using every day.",
    image: "/images/cyngular_img.svg",
    tags: ["SaaS", "Enterprise", "Platform"],
  },
];

export const whyChooseUs = [
  {
    title: "We speak your language",
    text: "Fluent in the terms, flows, and mindset of your industry's users — we get it from day one.",
  },
  {
    title: "Battle-tested experience",
    text: "Over 50 SaaS platforms and enterprise products designed for top-tier companies.",
  },
  {
    title: "Up to speed from day one",
    text: "We get your world, so we get to work fast — no lengthy onboarding, no ramp-up time.",
  },
  {
    title: "Security-first thinking",
    text: "Our UX is built with your users, risks, and compliance in mind from the start.",
  },
];

export const companyTicker = [
  "Deepkeep", "PlainID", "Rescana", "Okta", "Cyngular Security",
  "Armis", "Layerx", "ICTBIT", "Comesecure", "Cybering",
  "Jfrog", "Playtika", "Taboola", "Openops", "Natural Intelligence",
];

export const servicesSections = {
  productDesign: {
    title: "Product Design",
    description:
      "Whether you need a complete redesign or are starting from scratch, we can help you create a digital experience that will delight your users and drive business success.",
    menuItems: [
      { label: "Product UX/UI Design", href: "/services/product-ux-ui-design/" },
      { label: "UX Research", href: "/services/ux-research/" },
      { label: "UI Design", href: "/services/ui-design/" },
      { label: "Wireframing", href: "/services/wireframing/" },
      { label: "Prototyping", href: "/services/prototyping/" },
      { label: "User Testing", href: "/services/user-testing/" },
      { label: "Design System Creation", href: "/services/design-system-creation/" },
      { label: "Product Stars", href: "/services/product-stars/" },
    ],
    images: [
      "/images/proddes1.png",
      "/images/proddes2.png",
      "/images/proddes3.png",
      "/images/proddes4.png",
      "/images/proddes5.png",
      "/images/proddes6.png",
      "/images/proddes7.png",
      "/images/proddes8.png",
      "/images/proddes9.png",
    ],
  },
  branding: {
    title: "Branding & Studio",
    description:
      "Building strong brands and impactful marketing strategies that drive success.",
    menuItems: [
      { label: "Creative Concept", href: "/services/creative-concept/" },
      { label: "Logo Design", href: "/services/logo-design/" },
      { label: "Character Design", href: "/services/character-design/" },
      { label: "Presentations", href: "/services/presentations/" },
      { label: "Motion Design", href: "/services/motion-design/" },
    ],
    images: [
      "/images/branding1.png",
      "/images/branding2.png",
      "/images/branding3.png",
      "/images/branding4.png",
      "/images/branding5.png",
      "/images/branding6.png",
    ],
  },
  technology: {
    title: "Technology",
    description:
      "Our development services specialize in building robust, scalable platforms tailored to handle complex workflows and systems. We deliver everything from seamless integration to advanced functionality.",
    groups: [
      {
        label: "AI & Automation",
        color: "#943BDD",
        items: ["LLM Integration", "Workflow Automation", "AI-Powered UX", "Custom GPT"],
      },
      {
        label: "Front End Dev",
        color: "#FF6161",
        items: ["React.js", "Angular", "Vue.js", "Next.js"],
      },
      {
        label: "Back End Dev",
        color: "#4ADE80",
        items: ["Node.js", "Express.js", "Django", "Python"],
      },
    ],
    image: "/images/dev1.png",
  },
};
