import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

const BASE_EN = "/assets/fintech-finance";
const BASE_HE = "/assets/fintech-finance-he";

const ASSETS_EN = {
  bannerGridImg: `${BASE_EN}/banner_grid.svg`,
  bannerLayerImg: `${BASE_EN}/portolio_layer.svg`,
  jumpImg1: `${BASE_EN}/jumping_1-1.svg`,
  jumpImg2: `${BASE_EN}/jumping_2-1.svg`,
  jumpImg3: `${BASE_EN}/jumping_3-1.svg`,
} as const;

const ASSETS_HE = {
  bannerGridImg: `${BASE_HE}/banner_grid.svg`,
  bannerLayerImg: `${BASE_HE}/portolio_layer.svg`,
  jumpImg1: `${BASE_HE}/jumping_1-1.svg`,
  jumpImg2: `${BASE_HE}/jumping_2-1.svg`,
  jumpImg3: `${BASE_HE}/jumping_3-1.svg`,
} as const;

const ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${BASE_EN}/altshuler-min.png`,
    desktopImg: `${BASE_EN}/Altshuler-desktop.png`,
    mobileImg: `${BASE_EN}/Altshuler-mobile.png`,
    title: "Fintech Platform Design",
    description:
      "Creating intuitive interfaces for financial transactions and account management.",
    tags: ["FinancialUI", "UserTrust", "Security"],
  },
  {
    logo: `${BASE_EN}/ibi-min.png`,
    desktopImg: `${BASE_EN}/IBI-desktop.png`,
    mobileImg: `${BASE_EN}/IBI-mobile.png`,
    title: "Investment Dashboard",
    description: "Dashboard design for portfolio management and investment tracking.",
    tags: ["Dashboard", "Analytics", "InvestmentUI"],
  },
  {
    logo: `${BASE_EN}/luxon-pay-min.png`,
    desktopImg: `${BASE_EN}/Luxon-pay-desktop.png`,
    mobileImg: `${BASE_EN}/Luxonpay-mobile.png`,
    title: "Payment Interface",
    description: "Streamlined payment flows for B2B and B2C transactions.",
    tags: ["PaymentFlow", "UX", "Conversion"],
  },
  {
    logo: `${BASE_EN}/splitit-min.png`,
    desktopImg: `${BASE_EN}/Splitit-desktop.png`,
    mobileImg: `${BASE_EN}/Splitit-mobile.png`,
    title: "Compliance & Security",
    description: "Designing secure interfaces that meet regulatory requirements.",
    tags: ["Compliance", "Security", "Regulations"],
  },
];

/**
 * Hebrew mirror has desktop/mobile mocks but not all `*-min.png` logos; reuse EN logos for those (same brand art).
 */
const ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${BASE_HE}/altshuler-min.png`,
    desktopImg: `${BASE_HE}/Altshuler-desktop.png`,
    mobileImg: `${BASE_HE}/Altshuler-mobile.png`,
    title: "עיצוב פלטפורמת פינטק",
    description: "ממשקים אינטואיטיביים לעסקאות פיננסיות ולניהול חשבון.",
    tags: ITEMS_EN[0].tags,
  },
  {
    logo: `${BASE_EN}/ibi-min.png`,
    desktopImg: `${BASE_HE}/IBI-desktop.png`,
    mobileImg: `${BASE_HE}/IBI-mobile.png`,
    title: "לוח השקעות",
    description: "עיצוב דשבורד לניהול תיקים ומעקב השקעות.",
    tags: ITEMS_EN[1].tags,
  },
  {
    logo: `${BASE_EN}/luxon-pay-min.png`,
    desktopImg: `${BASE_HE}/Luxon-pay-desktop.png`,
    mobileImg: `${BASE_HE}/Luxonpay-mobile.png`,
    title: "ממשק תשלומים",
    description: "זרמי תשלום יעילים לעסקאות B2B ו-B2C.",
    tags: ITEMS_EN[2].tags,
  },
  {
    logo: `${BASE_EN}/splitit-min.png`,
    desktopImg: `${BASE_HE}/Splitit-desktop.png`,
    mobileImg: `${BASE_HE}/Splitit-mobile.png`,
    title: "עמידה בתקנות ואבטחה",
    description: "ממשקים מאובטחים התואמים דרישות רגולציה.",
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

export const FINTECH_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#0052CC",
  partnerCount: "50+ Fintech platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "Fintech & Finance",
    subtitle: "Team up with product design specialists who deliver.",
    description:
      "Trust and clarity are paramount in fintech. Triolla designs secure, intuitive financial experiences...",
    expandedText:
      "In fintech, users need to understand complex financial concepts quickly and trust their platform completely. Our UX design makes sophisticated financial tools accessible and secure. We create interfaces that build confidence, prevent errors, and guide users through transactions with clarity and ease.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS_EN,
  },
  portfolioItems: ITEMS_EN,
  why: {
    mainTitle: "Why Do fintech companies choose us?",
    items: [
      {
        title: "Financial Expertise",
        description: "Deep understanding of fintech regulations and best practices.",
      },
      {
        title: "Security-First Design",
        description: "Every interaction is designed with security and compliance in mind.",
      },
      {
        title: "Trust Building",
        description: "We create interfaces that users trust with their financial data.",
      },
      {
        title: "Conversion Focused",
        description: "Our UX drives adoption and engagement in competitive markets.",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "Trusted by leading fintech companies worldwide",
    logos: logosWithBase(BASE_EN),
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const FINTECH_PAGE_DATA_HE: PortfolioPageData = {
  ...FINTECH_PAGE_DATA_EN,
  dir: "rtl",
  /** Matches `style-he.css` on the mirrored Hebrew page (`.portfolio_banner`). */
  bannerColor: "#FED125",
  partnerCount: "למעלה מ־50 פלטפורמות פינטק",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "פינטק ופיננסים",
    subtitle: "הצטרפו לצוות מומחי המוצר שמיישמים את החזון ומספקים תוצאות.",
    description:
      "אמון ובהירות הם קריטיים בפינטק. טריאולה מעצבת חוויות פיננסיות מאובטחות ואינטואיטיביות...",
    expandedText:
      "בפינטק, משתמשים צריכים להבין מושגים פיננסיים מורכבים במהירות ולסמוך על הפלטפורמה לחלוטין. עיצוב ה־UX שלנו הופך כלים פיננסיים מתוחכמים לנגישים ומאובטחים. אנו יוצרים ממשקים שבונים ביטחון, מפחיתים טעויות ומנחים בעסקאות בבהירות.",
    buttonText: "שותפו איתנו",
    buttonLink: "#contactus",
    ...ASSETS_HE,
  },
  portfolioItems: ITEMS_HE,
  why: {
    mainTitle: "למה חברות פינטק בוחרות בנו?",
    items: [
      {
        title: "מומחיות פיננסית",
        description: "הבנה מעמיקה של רגולציה ושיטות עבודה מומלצות.",
      },
      {
        title: "עיצוב אבטחה־פירסט",
        description: "כל אינטראקציה נבחנת מול אבטחה וציות.",
      },
      {
        title: "בניית אמון",
        description: "ממשקים שמשתמשים סומכים עליהם עם הנתונים הפיננסיים שלהם.",
      },
      {
        title: "מיקוד בהמרות",
        description: "חוויית משתמש שמניעה אימוץ ומעורבות בשוק תחרותי.",
      },
    ],
  },
  global: {
    title: "הלקוחות שלנו",
    subtitle:
      "מחברות קטנות ועד גלובליות, שיתפנו פעולה עם כמה חברות מדהימות",
    logos: logosWithBase(BASE_HE),
    buttonText: "בואו נדבר",
    buttonLink: "#contactus",
  },
};
