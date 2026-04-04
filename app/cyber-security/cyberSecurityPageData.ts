import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

/** EN/HE case studies and hero art live in `public/images/` (slug asset dirs are empty). */
const IMG = "/images";

const ASSETS_EN = {
  bannerGridImg: `${IMG}/banner_grid.svg`,
  bannerLayerImg: `${IMG}/portolio_layer.svg`,
  jumpImg1: `${IMG}/jumping_1-1.svg`,
  jumpImg2: `${IMG}/jumping_2-1.svg`,
  jumpImg3: `${IMG}/jumping_3-1.svg`,
} as const;

const ASSETS_HE = {
  bannerGridImg: `${IMG}/banner_grid.svg`,
  bannerLayerImg: `${IMG}/portolio_layer.svg`,
  jumpImg1: `${IMG}/jumping_1-1.svg`,
  jumpImg2: `${IMG}/jumping_2-1.svg`,
  jumpImg3: `${IMG}/jumping_3-1.svg`,
} as const;

const ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${IMG}/armis-min.png`,
    desktopImg: `${IMG}/Armis-desktop.png`,
    mobileImg: `${IMG}/Armis-mobile.png`,
    title:
      "Redefining game intelligence by enhancing user engagement and performance through management and analytics platforms.",
    description:
      "A long and successful collaboration focusing on analysis solutions, security, user satisfaction, data and more.",
    tags: ["ProductUX", "ProductUI", "DesignSystem", "UserExperience"],
  },
  {
    logo: `${IMG}/suridata_logo.svg`,
    desktopImg: `${IMG}/Suridata-desktop.png`,
    mobileImg: `${IMG}/Suridata-mobile.png`,
    title: "Expansion of security capabilities through strategic UX design.",
    description:
      "Suridata partnership focused on security product design and user experience enhancement.",
    tags: ["SecurityDesign", "ProductStrategy", "UserTrust"],
  },
  {
    logo: `${IMG}/safebridge-min.png`,
    desktopImg: `${IMG}/Safebridge-desktop.png`,
    mobileImg: `${IMG}/Safebridge-mobile.png`,
    title: "Advanced threat detection and response interface design.",
    description: "Creating intuitive dashboards for security operations and threat management.",
    tags: ["ThreatDetection", "Dashboard", "SecurityOps"],
  },
  {
    logo: `${IMG}/cyngular_logo.svg`,
    desktopImg: `${IMG}/Cyngular-desktop.png`,
    mobileImg: `${IMG}/Cyngular-mobile.png`,
    title: "Network security platform user interface optimization.",
    description: "Designing clear, accessible security interfaces for network management.",
    tags: ["NetworkSecurity", "UXDesign", "AccessibleUI"],
  },
];

const ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${IMG}/armis-min.png`,
    desktopImg: `${IMG}/Armis-desktop.png`,
    mobileImg: `${IMG}/Armis-mobile.png`,
    title: "חיזוק מעורבות וביצועים באמצעות פלטפורמות ניהול ואנליטיקה.",
    description:
      "שיתוף פעולה ארוך ומוצלח עם דגש על ניתוח, אבטחה, שביעות רצון משתמשים, נתונים ועוד.",
    tags: ITEMS_EN[0].tags,
  },
  {
    logo: `${IMG}/suridata_logo.svg`,
    desktopImg: `${IMG}/Suridata-desktop.png`,
    mobileImg: `${IMG}/Suridata-mobile.png`,
    title: "הרחבת יכולות אבטחה באמצעות אסטרטגיית UX.",
    description: "שותפות Suridata — עיצוב מוצרי אבטחה וחיזוק חוויית המשתמש.",
    tags: ITEMS_EN[1].tags,
  },
  {
    logo: `${IMG}/saf_breach_logo.svg`,
    desktopImg: `${IMG}/Safebridge-desktop.png`,
    mobileImg: `${IMG}/Safebridge-mobile.png`,
    title: "עיצוב ממשק לזיהוי איומים ותגובה מתקדמת.",
    description: "דשבורדים אינטואיטיביים לפעולות אבטחה וניהול איומים.",
    tags: ITEMS_EN[2].tags,
  },
  {
    logo: `${IMG}/cyngular_logo.svg`,
    desktopImg: `${IMG}/Cyngular-desktop.png`,
    mobileImg: `${IMG}/Cyngular-mobile.png`,
    title: "אופטימיזציה של ממשק לפלטפורמת אבטחת רשת.",
    description: "ממשקי אבטחה ברורים ונגישים לניהול רשת.",
    tags: ITEMS_EN[3].tags,
  },
];

function logosWithBase(base: string): PortfolioPageData["global"]["logos"] {
  const names = [
    "microsoft_global.svg",
    "american_express_global.svg",
    "n_gloabl.svg",
    "human_global.svg",
    "passport_cart_global.svg",
    "jfrog_global.svg",
    "alam_global.svg",
    "taboola_global.svg",
    "is_global.svg",
    "star_global.svg",
    "playtika_global.svg",
    "finaro_global.svg",
  ] as const;
  const alts = [
    "Microsoft",
    "American Express",
    "N",
    "Human",
    "Passport",
    "JFrog",
    "Alam",
    "Taboola",
    "IS",
    "Star",
    "Playtika",
    "Finaro",
  ] as const;
  return names.map((file, i) => ({ img: `${base}/${file}`, alt: alts[i] }));
}

export const CYBER_SECURITY_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  /** Matches `style.css` / triolla snapshot (`.portfolio_banner`); `#000` made the hero override the theme and looked broken. */
  bannerColor: "#FED125",
  partnerCount: "50+ Cybersecurity platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "Cyber\nSecurity",
    subtitle: "Team up with product design specialists who deliver.",
    description:
      "As cyber threats grow more complex, UX design helps simplify security processes without compromising protection...",
    expandedText:
      "In cybersecurity, great UX means guiding users through secure actions without overwhelming them with technical complexity. A well-designed interface builds trust, encourages safe behavior, and gives users a sense of control. By anticipating risks and preventing common user errors, UX design plays a proactive role in reducing cyber threats. At Triolla, we specialize in designing secure, seamless, and human-centered experiences for cybersecurity products.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS_EN,
  },
  portfolioItems: ITEMS_EN,
  why: {
    mainTitle: "Why Do cyber companies choose us?",
    items: [
      {
        title: "We speak your language",
        description: "Fluent in the terms, flows, and mindset of cybersecurity users",
      },
      {
        title: "Battle-tested experience",
        description: "Over 65 SaaS platforms designed for top-tier cyber companies",
      },
      {
        title: "Up to speed from day one",
        description: "We get your world, so we get to work—fast.",
      },
      {
        title: "Security-first thinking",
        description: "Our UX is built with your users, risks, and compliance in mind.",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "From small to global, we have partnered with some great companies",
    logos: logosWithBase(IMG),
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const CYBER_SECURITY_PAGE_DATA_HE: PortfolioPageData = {
  ...CYBER_SECURITY_PAGE_DATA_EN,
  dir: "rtl",
  /** Matches `style-he.css` on the mirrored Hebrew page (`.portfolio_banner`). */
  bannerColor: "#FED125",
  partnerCount: "למעלה מ־50 פלטפורמות סייבר",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "אבטחת\nסייבר",
    subtitle: "הצטרפו לצוות מומחי המוצר שמיישמים את החזון ומספקים תוצאות.",
    description:
      "ככל שהאיומים מתרקמים, עיצוב UX מסייע לפשט תהליכי אבטחה בלי לוותר על הגנה...",
    expandedText:
      "בסייבר, UX מצוין מנחה משתמשים לפעולות מאובטחות בלי להציף במורכבות טכנית. ממשק מתוכנן היטב בונה אמון, מעודד התנהגות בטוחה ונותן תחושת שליטה. לציד הימנעות משגיאות נפוצות, UX תורם באופן אקטיבי להפחתת סיכונים. בטריאולה אנו מתמחים בחוויות מאובטחות, חלקות וממוקדות אדם למוצרי סייבר.",
    buttonText: "שותפו איתנו",
    buttonLink: "#contactus",
    ...ASSETS_HE,
  },
  portfolioItems: ITEMS_HE,
  why: {
    mainTitle: "למה חברות סייבר בוחרות בנו?",
    items: [
      {
        title: "דוברים את השפה שלכם",
        description: "שוטפים במונחים, בזרימות ובמנטליות של משתמשי סייבר.",
      },
      {
        title: "ניסיון מלוטש בקרב",
        description: "עשרות פלטפורמות SaaS לחברות סייבר מובילות.",
      },
      {
        title: "בקצב מהיום הראשון",
        description: "אנו מבינים את העולם שלכם — ומתחילים לעבוד מהר.",
      },
      {
        title: "חשיבה אבטחה־פירסט",
        description: "ה־UX נבנה עם משתמשים, סיכונים וציות בראש.",
      },
    ],
  },
  global: {
    title: "הלקוחות שלנו",
    subtitle: "מקומי ועד גלובלי — התקדמנו עם חברות מעולות",
    logos: logosWithBase(IMG),
    buttonText: "בואו נדבר",
    buttonLink: "#contactus",
  },
};
