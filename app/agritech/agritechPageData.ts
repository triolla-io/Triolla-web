import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

const AGRITECH_ASSETS = {
  bannerGridImg: "/assets/agritech/banner_grid.svg",
  bannerLayerImg: "/assets/agritech/portolio_layer.svg",
  jumpImg1: "/assets/agritech/jumping_1-1.svg",
  jumpImg2: "/assets/agritech/jumping_2-1.svg",
  jumpImg3: "/assets/agritech/jumping_3-1.svg",
} as const;

const AGRITECH_ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: "/assets/agritech/logo-1.png",
    desktopImg: "/assets/agritech/item-1-desktop.png",
    mobileImg: "/assets/agritech/item-1-mobile.png",
    title: "Farm Management System",
    description:
      "Mobile and web application for crop planning, monitoring, and harvest management.",
    tags: ["FarmTech", "MobileFirst", "Agriculture"],
  },
  {
    logo: "/assets/agritech/logo-2.png",
    desktopImg: "/assets/agritech/item-2-desktop.png",
    mobileImg: "/assets/agritech/item-2-mobile.png",
    title: "IoT Sensor Dashboard",
    description: "Real-time monitoring of soil, weather, and crop health metrics.",
    tags: ["IoT", "DataDriven", "FarmMonitoring"],
  },
  {
    logo: "/assets/agritech/logo-3.png",
    desktopImg: "/assets/agritech/item-3-desktop.png",
    mobileImg: "/assets/agritech/item-3-mobile.png",
    title: "Marketplace Platform",
    description: "Connecting farmers with buyers and agricultural resources.",
    tags: ["Marketplace", "Agriculture", "Supply Chain"],
  },
  {
    logo: "/assets/agritech/logo-4.png",
    desktopImg: "/assets/agritech/item-4-desktop.png",
    mobileImg: "/assets/agritech/item-4-mobile.png",
    title: "Sustainability Analytics",
    description: "Tracking environmental impact and sustainable farming practices.",
    tags: ["Sustainability", "Analytics", "Reporting"],
  },
];

const AGRITECH_ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    ...AGRITECH_ITEMS_EN[0],
    title: "מערכת ניהול חווה",
    description:
      "אפליקציית מובייל ואתר לתכנון גידולים, ניטור וניהול קציר.",
  },
  {
    ...AGRITECH_ITEMS_EN[1],
    title: "לוח בקרת חיישני IoT",
    description: "ניטור בזמן אמת של קרקע, מזג אוויר ומצב הגידולים.",
  },
  {
    ...AGRITECH_ITEMS_EN[2],
    title: "פלטפורמת מרקטפלייס",
    description: "מחברת חקלאים לקונים ולמשאבים חקלאיים.",
  },
  {
    ...AGRITECH_ITEMS_EN[3],
    title: "אנליטיקה לקיימות",
    description: "מעקב אחר השפעה סביבתית ופרקטיקות חקלאות בת־קיימא.",
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
  { img: "/assets/agritech/microsoft_global.svg", alt: "Microsoft" },
  { img: "/assets/agritech/american_express_global.svg", alt: "American Express" },
  { img: "/assets/agritech/n_gloabl.svg", alt: "N" },
  { img: "/assets/agritech/human_global.svg", alt: "Human" },
  { img: "/assets/agritech/passport_cart_global.svg", alt: "Passport" },
  { img: "/assets/agritech/jfrog_global.svg", alt: "JFrog" },
  { img: "/assets/agritech/alam_global.svg", alt: "Alam" },
  { img: "/assets/agritech/taboola_global.svg", alt: "Taboola" },
  { img: "/assets/agritech/is_global.svg", alt: "IS" },
  { img: "/assets/agritech/star_global.svg", alt: "Star" },
  { img: "/assets/agritech/playtika_global.svg", alt: "Playtika" },
  { img: "/assets/agritech/finaro_global.svg", alt: "Finaro" },
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
    ...AGRITECH_ASSETS,
  },
  portfolioItems: AGRITECH_ITEMS_EN,
  why: {
    mainTitle: "Why Do agritech companies choose us?",
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
    ...AGRITECH_ASSETS,
  },
  portfolioItems: AGRITECH_ITEMS_HE,
  why: {
    mainTitle: "למה חברות אגריטק בוחרות בנו?",
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
