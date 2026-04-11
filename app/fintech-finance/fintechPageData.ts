import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

/** Portfolio imagery lives in `public/images/` (per-slug asset dirs are not shipped). */
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
    logo: `${IMG}/altshuler-min.png`,
    desktopImg: `${IMG}/Altshuler-desktop.png`,
    mobileImg: `${IMG}/Altshuler-mobile-1.png`,
    title: "Fintech Platform Design",
    description:
      "Creating intuitive interfaces for financial transactions and account management.",
    tags: ["FinancialUI", "UserTrust", "Security"],
  },
  {
    logo: `${IMG}/ibi-min.png`,
    desktopImg: `${IMG}/IBI-desktop.png`,
    mobileImg: `${IMG}/IBI-mobile.png`,
    title: "Investment Dashboard",
    description: "Dashboard design for portfolio management and investment tracking.",
    tags: ["Dashboard", "Analytics", "InvestmentUI"],
  },
  {
    logo: `${IMG}/luxon-pay-min.png`,
    desktopImg: `${IMG}/Luxon-pay-desktop.png`,
    /** No dedicated mobile mock in repo; reuse desktop art. */
    mobileImg: `${IMG}/Luxon-pay-desktop.png`,
    title: "Payment Interface",
    description: "Streamlined payment flows for B2B and B2C transactions.",
    tags: ["PaymentFlow", "UX", "Conversion"],
  },
  {
    logo: `${IMG}/splitit-min.png`,
    desktopImg: `${IMG}/Splitit-desktop.png`,
    mobileImg: `${IMG}/Splitit-mobile.png`,
    title: "Compliance & Security",
    description: "Designing secure interfaces that meet regulatory requirements.",
    tags: ["Compliance", "Security", "Regulations"],
  },
];

const ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${IMG}/altshuler-min.png`,
    desktopImg: `${IMG}/Altshuler-desktop.png`,
    mobileImg: `${IMG}/Altshuler-mobile-1.png`,
    title: "עיצוב פלטפורמת פינטק",
    description: "ממשקים אינטואיטיביים לעסקאות פיננסיות ולניהול חשבון.",
    tags: ITEMS_EN[0].tags,
  },
  {
    logo: `${IMG}/ibi-min.png`,
    desktopImg: `${IMG}/IBI-desktop.png`,
    mobileImg: `${IMG}/IBI-mobile.png`,
    title: "לוח השקעות",
    description: "עיצוב דשבורד לניהול תיקים ומעקב השקעות.",
    tags: ITEMS_EN[1].tags,
  },
  {
    logo: `${IMG}/luxon-pay-min.png`,
    desktopImg: `${IMG}/Luxon-pay-desktop.png`,
    mobileImg: `${IMG}/Luxon-pay-desktop.png`,
    title: "ממשק תשלומים",
    description: "זרמי תשלום יעילים לעסקאות B2B ו-B2C.",
    tags: ITEMS_EN[2].tags,
  },
  {
    logo: `${IMG}/splitit-min.png`,
    desktopImg: `${IMG}/Splitit-desktop.png`,
    mobileImg: `${IMG}/Splitit-mobile.png`,
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

const FINTECH_WHY: PortfolioPageData["why"] = {
  mainTitle: "Why Do <br />fintech companies <br />choose us?",
  items: [
    {
      title: "We speak <br />finance fluently",
      description:
        "Deep understanding of financial flows, compliance, and user trust",
    },
    {
      title: "Fintech-focused expertise",
      description:
        "Proven track record designing digital products for leading financial brands",
    },
    {
      title: "On the money from day one",
      description: "We know your industry, so we deliver value right from the start",
    },
    {
      title: "Trust by design",
      description:
        "Our UX prioritizes security, clarity, and seamless financial experiences",
    },
  ],
};

export const FINTECH_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  partnerCount: "50+ Fintech platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "Fintech & Finance",
    subtitle: "Join product design experts who will listen to you.",
    description:
      "Enterprise tools and efficient workflows are our language in Fintech & Finance.",
    expandedText:
      "We create secure and intuitive interfaces that simplify complex financial processes and build user trust in the fintech and finance sector.\n\nOur product design approach focuses on clarity, compliance, and seamless integration with financial systems to deliver exceptional user experiences.\n\nWith Triolla, your fintech solutions benefit from design expertise that drives engagement, ensures reliability, and supports your growth in a dynamic market.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS_EN,
  },
  portfolioItems: ITEMS_EN,
  why: FINTECH_WHY,
  global: {
    title: "Our Clients",
    subtitle: "From small to global, we have partnered with some great companies",
    logos: logosWithBase(IMG),
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
      "אמון ובהירות הם קריטיים בפינטק. טריאולה מעצבת חוויות פיננסיות מאובטחות ואינטואיטיביות",
    expandedText:
      "בפינטק, משתמשים צריכים להבין מושגים פיננסיים מורכבים במהירות ולסמוך על הפלטפורמה לחלוטין.\n\nעיצוב ה־UX שלנו הופך כלים פיננסיים מתוחכמים לנגישים ומאובטחים.\n\nאנו יוצרים ממשקים שבונים ביטחון, מפחיתים טעויות ומנחים בעסקאות בבהירות.",
    buttonText: "שותפו איתנו",
    buttonLink: "#contactus",
    ...ASSETS_HE,
  },
  portfolioItems: ITEMS_HE,
  why: FINTECH_WHY,
  global: {
    title: "הלקוחות שלנו",
    subtitle:
      "מחברות קטנות ועד גלובליות, שיתפנו פעולה עם כמה חברות מדהימות",
    logos: logosWithBase(IMG),
    buttonText: "בואו נדבר",
    buttonLink: "#contactus",
  },
};
