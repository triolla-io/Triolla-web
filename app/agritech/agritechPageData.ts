import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

/** Portfolio imagery in `public/images/` (placeholder `/assets/agritech/*` files are not shipped). */
const IMG = "/images";

const ASSETS = {
  bannerGridImg: `${IMG}/banner_grid.svg`,
  bannerLayerImg: `${IMG}/portolio_layer.svg`,
  jumpImg1: `${IMG}/jumping_1-1.svg`,
  jumpImg2: `${IMG}/jumping_2-1.svg`,
  jumpImg3: `${IMG}/jumping_3-1.svg`,
} as const;

/**
 * Case studies use on-disk mocks (irrigation, field IoT, climate, remote monitoring).
 * Order: Bermad, Ayyeka, Tadiran, Essence — aligned with agritech-adjacent work.
 */
const AGRITECH_ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${IMG}/bermad-min.png`,
    desktopImg: `${IMG}/Frame-2147224067-2.png`,
    mobileImg: `${IMG}/Bermad-mobile.png`,
    title:
      "Empowering smarter irrigation, we designed Bermad’s platform —making it easy for users to monitor, manage, & optimize water systems efficiently.",
    description:
      "We partnered with Bermad to design a user-friendly interface for their advanced irrigation platform. Our work focused on simplifying complex water management tasks through intuitive layouts, real-time data visualization, and streamlined controls—empowering users to easily monitor, adjust, and optimize their irrigation systems for greater efficiency and control.",
    tags: ["ProductUI", "ProductResearch", "ProductInterface"],
  },
  {
    logo: `${IMG}/ayyeka-min.png`,
    desktopImg: `${IMG}/Ayyeka-desktop.png`,
    mobileImg: `${IMG}/Ayyeka-mobile.png`,
    title:
      "Ayyeka partnered with us to revamp their IIoT platform, enhancing accessibility and usability of remote infrastructure data.",
    description:
      "We worked closely with Ayyeka to redesign their IIoT platform, focusing on making complex remote infrastructure data easy to access and act on. Our process involved user research, simplifying workflows, and creating clear data visualizations—ensuring operators can monitor assets efficiently and make informed decisions quickly.",
    tags: ["Platform", "Design", "IoT"],
  },
  {
    logo: `${IMG}/Tadiran-1.png`,
    desktopImg: `${IMG}/Tadiran.png`,
    mobileImg: `${IMG}/Tadiran-mobile.png`,
    title:
      "Reimagining climate control—Tadiran’s app lets users manage their indoor environment effortlessly, anytime, anywhere.",
    description:
      "We redesigned the smart climate control app to turn complex functionality into a clean, intuitive, and accessible experience—focusing on clear interactions and seamless connectivity.",
    tags: ["AppDesign", "AppExperience", "UserExperience"],
  },
  {
    logo: `${IMG}/Esences.png`,
    desktopImg: `${IMG}/Essence-desktop.png`,
    mobileImg: `${IMG}/Essence-mobile.png`,
    title:
      "Designing an intuitive platform for Essence Group, helping providers monitor patients and respond quickly through a clear, user-friendly interface.",
    description:
      "We worked with Essence Group to design a user-friendly healthcare platform for providers, simplifying patient monitoring, alerts, and real-time response. Our UI/UX made complex telecare tools more accessible, supporting faster, more effective care.",
    tags: ["ProductUX", "ProductResearch", "UIDesign", "UserInterview"],
  },
];

const AGRITECH_ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    ...AGRITECH_ITEMS_EN[0],
    title:
      "העצמה של השקיה חכמה — עיצבנו לברמד פלטפורמה שמקלה על משתמשים לנטר, לנהל ולייעל מערכות מים ביעילות.",
    description:
      "שותפנו לברמד לעיצוב ממשק ידידותי לפלטפורמת ההשקיה המתקדמת. התמקדנו בפישוט ניהול מים מורכב באמצעות פריסות אינטואיטיביות, ויזואליזציה בזמן אמת ובקרות זורמות — כדי לאפשר ניטור והתאמה קלה ושליטה יעילה יותר.",
  },
  {
    ...AGRITECH_ITEMS_EN[1],
    title:
      "שיפור פלטפורמת ה־IIoT של אייקה — נגישות ושימושיות טובות יותר בנתוני תשתית מרחוק.",
    description:
      "שכננו מחדש את הפלטפורמה כך שנתוני תשתית מרוחקת יהיו קלים יותר לצפייה ולפעולה, עם מחקר משתמשים, פישוט זרימות עבודה וויזואליזציה ברורה לניטור נכסים והחלטות מהירות.",
  },
  {
    ...AGRITECH_ITEMS_EN[2],
    title:
      "חידוש בקרת האקלים — לאפליקציה של תדיראן ניהול הסביבה הפנימית בקלות, בכל זמן ומכל מקום.",
    description:
      "עיצבנו מחדש אפליקציית בקרת אקלים חכמה — מתפקוד מורכב לחוויה נקייה, אינטואיטיבית ונגישה, עם דגש על אינטראקציות ברורות וחיבוריות חלקה.",
  },
  {
    ...AGRITECH_ITEMS_EN[3],
    title:
      "פלטפורמה אינטואיטיבית לקבוצת אסנס — מסייעת לספקים לנטר חולים ולהגיב במהירות דרך ממשק ברור ונוח.",
    description:
      "עבדנו עם אסנס על פלטפורמת טלטיפול ידידותית לספקים, עם פישוט ניטור, התראות ותגובה בזמן אמת. ה־UI/UX הפך כלים מורכבים לנגישים יותר ותומך בטיפול מהיר ויעיל יותר.",
  },
];

/** From `triolla-io-agritech-body.html` `.company_triker` */
const AGRITECH_COMPANY_TICKER: string[] = [
  "Beewise",
  "Agritask",
  "Bermad",
  "Manna",
  "ReelView",
  "Supplant",
  "BlueCircle",
  "Netafim",
  "Treetoscope",
  "STK Bio",
  "Phi-Tech",
];

const AGRITECH_GLOBAL_LOGOS: PortfolioPageData["global"]["logos"] = [
  { img: `${IMG}/microsoft_global.svg`, alt: "Microsoft" },
  { img: `${IMG}/american_express_global.svg`, alt: "American Express" },
  { img: `${IMG}/n_gloabl.svg`, alt: "N" },
  { img: `${IMG}/human_global.svg`, alt: "Human" },
  { img: `${IMG}/passport_cart_global.svg`, alt: "Passport" },
  { img: `${IMG}/jfrog_global.svg`, alt: "JFrog" },
  { img: `${IMG}/alam_global.svg`, alt: "Alam" },
  { img: `${IMG}/taboola_global.svg`, alt: "Taboola" },
  { img: `${IMG}/is_global.svg`, alt: "IS" },
  { img: `${IMG}/star_global.svg`, alt: "Star" },
  { img: `${IMG}/playtika_global.svg`, alt: "Playtika" },
  { img: `${IMG}/finaro_global.svg`, alt: "Finaro" },
];

export const AGRITECH_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  companyTicker: AGRITECH_COMPANY_TICKER,
  partnerCount: "50+ Agritech platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "Agritech",
    subtitle: "Team up with product design specialists who deliver.",
    description:
      "Designing agricultural technology that empowers farmers. Triolla creates tools that bridge farming and technology...",
    expandedText:
      "In agritech, users range from small-scale farmers to large agricultural enterprises. Our UX design translates complex agricultural data into actionable insights, creates intuitive mobile-first interfaces for field use, and supports sustainable farming practices. We understand the unique challenges of agricultural technology and design accordingly.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: AGRITECH_ITEMS_EN,
  why: {
    mainTitle: "Why do agritech companies choose us?",
    items: [
      {
        title: "Agricultural Domain Knowledge",
        description: "We understand farming workflows and seasonal challenges.",
      },
      {
        title: "Field-Ready Design",
        description: "Interfaces designed for durability and offline functionality.",
      },
      {
        title: "Data Simplification",
        description: "Complex agricultural data made accessible to all farmers.",
      },
      {
        title: "Global Agricultural Experience",
        description: "Working across diverse farming communities worldwide.",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "Partnered with agritech innovators globally",
    logos: AGRITECH_GLOBAL_LOGOS,
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const AGRITECH_PAGE_DATA_HE: PortfolioPageData = {
  ...AGRITECH_PAGE_DATA_EN,
  dir: "rtl",
  partnerCount: "למעלה מ־50 פלטפורמות אגריטק",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "אגריטק",
    subtitle: "הצטרפו לצוות מומחי המוצר שמיישמים את החזון ומספקים תוצאות.",
    description:
      "אנחנו מעצבים טכנולוגיה חקלאית שמעצימה חקלאים. טריאולה יוצרת כלים שמחברים בין עבודת השדה לטכנולוגיה...",
    expandedText:
      "באגריטק, קהל המשתמשים נע בין חקלאים בשטח קטן ועד ארגונים חקלאיים גדולים. עיצוב ה־UX שלנו הופך נתונים חקלאיים מורכבים לתובנות ברות מעש, מייצר ממשקים אינטואיטיביים המותאמים לעבודה בשטח ותומך בפרקטיקות קיימות. אנו מכירים את האתגרים הייחודיים של טכנולוגיה חקלאית ומתאימים את העיצוב בהתאם.",
    buttonText: "שותפו איתנו",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: AGRITECH_ITEMS_HE,
  why: {
    mainTitle: "למה חברות במגזר האגריטק בוחרות בנו?",
    items: [
      {
        title: "היכרות עם תחום החקלאות",
        description: "אנו מבינים תהליכי עבודה בעונה ובשטח.",
      },
      {
        title: "עיצוב מוכן לשטח",
        description: "ממשקים שנבנו לעמידות, נוחות ועבודה ללא רשת כשצריך.",
      },
      {
        title: "הפשטת נתונים",
        description: "נתונים חקלאיים מורכבים נגישים יותר לכל משתמש.",
      },
      {
        title: "ניסיון גלובלי",
        description: "עבודה מגוונת עם קהילות חקלאיות ברחבי העולם.",
      },
    ],
  },
  global: {
    title: "הלקוחות שלנו",
    subtitle: "שותפים לחדשנות אגריטק ברחבי העולם",
    logos: AGRITECH_GLOBAL_LOGOS,
    buttonText: "בואו נדבר",
    buttonLink: "#contactus",
  },
};
