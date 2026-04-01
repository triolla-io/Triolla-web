import type { Locale } from "@/lib/i18n";

export type CommonMessages = {
  ticker: string;
  closeTicker: string;
  portfolio: string;
  services: string;
  technology: string;
  theCompany: string;
  contactUs: string;
  bookACall: string;
  whatsappLabel: string;
  openMenu: string;
  closeMenu: string;
  blog: string;
  career: string;
  mentions: string;
  productDesign: string;
  caseStudies: string;
  about: string;
  ourBlog: string;
  social: string;
  talkToUs: string;
  mail: string;
  tlvOffices: string;
  nyOffices: string;
  allRights: string;
  privacyPolicy: string;
  termsOfUse: string;
  partOf: string;
  langEn: string;
  langHe: string;
  /** Mobile drawer: portfolio sub-column headings (WP had placeholder “test”) */
  portfolioMobCol1Title: string;
  portfolioMobCol2Title: string;
  portfolioItems: {
    cybersecurity: string;
    digitalHealth: string;
    fintechFinance: string;
    gaming: string;
    agritech: string;
    b2c: string;
    devicesIot: string;
    startupsTech: string;
    mobileApps: string;
    saasPlatforms: string;
    b2b: string;
    dev: string;
  };
  footerCols: {
    col1: { title: string; items: string[] };
    col2: { title: string; items: string[] };
    col3: { title: string; items: string[] };
    col4: { title: string; items: string[] };
    col5: { title: string; items: string[] };
  };
};

export const common: Record<Locale, CommonMessages> = {
  en: {
    ticker: "Pitangoux is now Triolla – We've rebranded! Hello and welcome!",
    closeTicker: "Close ticker",
    portfolio: "Portfolio",
    services: "Services",
    technology: "Technology",
    theCompany: "The Company",
    contactUs: "Contact Us",
    bookACall: "Book a Call",
    whatsappLabel: "WhatsApp",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    blog: "Blog",
    career: "Career",
    mentions: "Mentions:",
    productDesign: "Product Design",
    caseStudies: "Case studies",
    about: "About",
    ourBlog: "Our Blog",
    social: "Social",
    talkToUs: "Talk to us",
    mail: "Mail:",
    tlvOffices: "TLV Offices:",
    nyOffices: "NY Offices:",
    allRights: "All rights reserved to Triolla LTD",
    privacyPolicy: "Privacy Policy",
    termsOfUse: "Terms Of Use",
    partOf: "Part of",
    langEn: "Eng",
    langHe: "Heb",
    portfolioMobCol1Title: "Industries",
    portfolioMobCol2Title: "Platforms & tech",
    portfolioItems: {
      cybersecurity: "Cybersecurity",
      digitalHealth: "Digital Health",
      fintechFinance: "Fintech & Finance",
      gaming: "Gaming",
      agritech: "Agritech",
      b2c: "B2C",
      devicesIot: "Devices & IoT",
      startupsTech: "Startups & Tech",
      mobileApps: "Mobile Apps",
      saasPlatforms: "SaaS Platforms",
      b2b: "B2B",
      dev: "Dev",
    },
    footerCols: {
      col1: {
        title: "Product Design",
        items: [
          "Product UX & UI Design",
          "UX Research",
          "Prototype",
          "Digital Branding",
          "Front End Development",
        ],
      },
      col2: {
        title: "Case studies",
        items: [
          "Mobile Apps",
          "Fintech & Finance",
          "IOT & Devices",
          "SaaS",
          "Gaming",
          "Medical",
          "Agritech",
        ],
      },
      col3: {
        title: "Technology",
        items: [
          "Dev & Technology",
          "Front End",
          "React.js",
          "Vue.js",
          "Back End",
          "Node.Js",
        ],
      },
      col4: {
        title: "About",
        items: [
          "About us",
          "Careers",
          "Our Services",
          "Talk to us",
          "Press",
          "Accessibility Statement",
        ],
      },
      col5: {
        title: "Our Blog",
        items: [
          "All Blogs",
          "Fintech & Finance",
          "IOT & Devices",
          "SaaS",
          "Gaming",
          "Medical",
          "Agritech",
        ],
      },
    },
  },
  he: {
    ticker: "פיטנגו עכשיו טריולה — שינינו מותג! שלום וברוכים הבאים!",
    closeTicker: "סגור הודעת באנר",
    portfolio: "תיק עבודות",
    services: "שירותים",
    technology: "טכנולוגיה",
    theCompany: "החברה",
    contactUs: "צור קשר",
    bookACall: "קבע שיחה",
    whatsappLabel: "וואטסאפ",
    openMenu: "פתח תפריט",
    closeMenu: "סגור תפריט",
    blog: "בלוג",
    career: "קריירה",
    mentions: "בתקשורת:",
    productDesign: "עיצוב מוצר",
    caseStudies: "מקרי בוחן",
    about: "אודות",
    ourBlog: "הבלוג שלנו",
    social: "רשתות חברתיות",
    talkToUs: "דברו איתנו",
    mail: "מייל:",
    tlvOffices: "משרד ת״א:",
    nyOffices: "משרד ניו יורק:",
    allRights: "כל הזכויות שמורות לטריולה בע״מ",
    privacyPolicy: "מדיניות פרטיות",
    termsOfUse: "תנאי שימוש",
    partOf: "חלק מ־",
    langEn: "אנגלית",
    langHe: "עברית",
    portfolioMobCol1Title: "תעשיות",
    portfolioMobCol2Title: "פלטפורמות וטכנולוגיה",
    portfolioItems: {
      cybersecurity: "סייבר",
      digitalHealth: "בריאות דיגיטלית",
      fintechFinance: "פינטק ופיננסים",
      gaming: "גיימינג",
      agritech: "אגריטק",
      b2c: "B2C",
      devicesIot: "מכשירים ו־IoT",
      startupsTech: "סטארטאפים וטק",
      mobileApps: "אפליקציות מובייל",
      saasPlatforms: "פלטפורמות SaaS",
      b2b: "B2B",
      dev: "פיתוח",
    },
    footerCols: {
      col1: {
        title: "עיצוב מוצר",
        items: [
          "עיצוב UX ו־UI למוצר",
          "מחקר משתמשים",
          "אבות טיפוס",
          "מיתוג דיגיטלי",
          "פיתוח פרונט־אנד",
        ],
      },
      col2: {
        title: "מקרי בוחן",
        items: [
          "אפליקציות מובייל",
          "פינטק ופיננסים",
          "IoT ומכשירים",
          "SaaS",
          "גיימינג",
          "רפואה",
          "אגריטק",
        ],
      },
      col3: {
        title: "טכנולוגיה",
        items: [
          "פיתוח וטכנולוגיה",
          "פרונט־אנד",
          "React.js",
          "Vue.js",
          "בק־אנד",
          "Node.js",
        ],
      },
      col4: {
        title: "אודות",
        items: [
          "מי אנחנו",
          "קריירה",
          "השירותים שלנו",
          "דברו איתנו",
          "בתקשורת",
          "הצהרת נגישות",
        ],
      },
      col5: {
        title: "הבלוג שלנו",
        items: [
          "כל הפוסטים",
          "פינטק ופיננסים",
          "IoT ומכשירים",
          "SaaS",
          "גיימינג",
          "רפואה",
          "אגריטק",
        ],
      },
    },
  },
};

export const portfolioCol1Keys = [
  { key: "cybersecurity" as const, href: "/cyber-security/" },
  { key: "digitalHealth" as const, href: "/medical-healthcare/" },
  { key: "fintechFinance" as const, href: "/fintech-finance/" },
  { key: "gaming" as const, href: "/gaming/" },
  { key: "agritech" as const, href: "/agritech/" },
  { key: "b2c" as const, href: "/b2c/" },
];

export const portfolioCol2Keys = [
  { key: "devicesIot" as const, href: "/device-iot/" },
  { key: "startupsTech" as const, href: "/startups-tech/" },
  { key: "mobileApps" as const, href: "/mobile-apps/" },
  { key: "saasPlatforms" as const, href: "/saas-platforms/" },
  { key: "b2b" as const, href: "/b2b/" },
  { key: "dev" as const, href: "/dev/" },
];

export const footerHrefMap = {
  col1: "/services/",
  col2: [
    "/mobile-apps/",
    "/fintech-finance/",
    "/device-iot/",
    "/saas-platforms/",
    "/gaming/",
    "/medical-healthcare/",
    "/agritech/",
  ],
  col3: "/technology/",
  col4: [
    "/about-us/",
    "/careers/",
    "/services/",
    "/contact-us/",
    "/about-us/",
    "/accessibility-statement/",
  ],
  col5: "/blog/",
} as const;
