import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

/** Canonical portfolio imagery (mirrors `public/images/`; slug asset dirs are not shipped). */
const IMG = "/images";

const ASSETS = {
  bannerGridImg: `${IMG}/banner_grid.svg`,
  bannerLayerImg: `${IMG}/portolio_layer.svg`,
  jumpImg1: `${IMG}/jumping_1-1.svg`,
  jumpImg2: `${IMG}/jumping_2-1.svg`,
  jumpImg3: `${IMG}/jumping_3-1.svg`,
} as const;

const ITEM_PATHS = [
  {
    logo: `${IMG}/bermad-min.png`,
    desktopImg: `${IMG}/Frame-2147224067-2.png`,
    mobileImg: `${IMG}/Bermad-mobile.png`,
  },
  {
    logo: `${IMG}/Esences.png`,
    desktopImg: `${IMG}/Essence-desktop.png`,
    mobileImg: `${IMG}/Essence-mobile.png`,
  },
  {
    logo: `${IMG}/Tadiran-1.png`,
    desktopImg: `${IMG}/Tadiran.png`,
    mobileImg: `${IMG}/Tadiran-mobile.png`,
  },
  {
    logo: `${IMG}/noveto-min.png`,
    desktopImg: `${IMG}/Novetto-desktop.png`,
    mobileImg: `${IMG}/Novetto-mobile.png`,
  },
  {
    logo: `${IMG}/ayyeka-min.png`,
    desktopImg: `${IMG}/Ayyeka-desktop.png`,
    mobileImg: `${IMG}/Ayyeka-mobile.png`,
  },
  {
    logo: `${IMG}/arkit-min.png`,
    desktopImg: `${IMG}/Arkit-desktop.png`,
    mobileImg: `${IMG}/Arkit-mobile.png`,
  },
] as const;

/** From `triolla-io-device-iot-body.html` `.company_triker` */
const DEVICE_IOT_COMPANY_TICKER: string[] = [
  "Bermad",
  "Essence Smartcare",
  "Tadiran",
  "Noveto",
  "Ayyeka",
  "Arkit",
];

type PortfolioItemCopy = Pick<
  PortfolioPageData["portfolioItems"][number],
  "title" | "description" | "tags"
>;

const ITEM_COPY_EN: PortfolioItemCopy[] = [
  {
    title:
      "Empowering smarter irrigation, we designed Bermad’s platform —making it easy for users to monitor, manage, & optimize water systems efficiently.",
    description:
      "We partnered with Bermad to design a user-friendly interface for their advanced irrigation platform. Our work focused on simplifying complex water management tasks through intuitive layouts, real-time data visualization, and streamlined controls—empowering users to easily monitor, adjust, and optimize their irrigation systems for greater efficiency and control.",
    tags: ["ProductUI", "ProductResearch", "ProductInterface"],
  },
  {
    title:
      "Designing an intuitive platform for Essence Group , helping providers monitor patients and respond quickly through a clear, user-friendly interface.",
    description:
      "We worked with Essence Group to design a user-friendly healthcare platform for providers, simplifying patient monitoring, alerts, and real-time response. Our UI/UX made complex telecare tools more accessible, supporting faster, more effective care.",
    tags: ["ProductUX", "ProductResearch", "UIDesign", "UserInterview"],
  },
  {
    title:
      "Reimagining climate control—Tadiran’s app lets users manage their indoor environment effortlessly, anytime, anywhere.",
    description:
      "We redesigned the smart climate control app to turn complex functionality into a clean, intuitive, and accessible experience—focusing on clear interactions and seamless connectivity.",
    tags: ["AppDesign", "AppExperience", "UserExperience"],
  },
  {
    title:
      "Noveto partnered with us to design their innovative “invisible headphone” experience, transforming how users engage with spatial audio.",
    description:
      "We developed an intuitive interface that seamlessly integrates with Noveto’s i3DS™ technology, allowing users to personalize their audio environment without physical wearables. The design emphasizes simplicity, accessibility, and a futuristic aesthetic, aligning with Noveto’s vision of immersive, headphone-free sound.",
    tags: ["MotionDesign", "TechProduct", "TechStartup"],
  },
  {
    title:
      "Ayyeka partnered with us to revamp their IIoT platform, enhancing accessibility and usability of remote infrastructure data.",
    description:
      "We worked closely with Ayyeka to redesign their IIoT platform, focusing on making complex remote infrastructure data easy to access and act on. Our process involved user research, simplifying workflows, and creating clear data visualizations—ensuring operators can monitor assets efficiently and make informed decisions quickly.",
    tags: ["Platform", "Design", "IoT"],
  },
  {
    title:
      "Our team crafted Arkit’s app for easy, private control of their vibrator, blending pleasure and medical use with a simple, secure interface.",
    description:
      "We collaborated with Arkit to create an intuitive app for controlling their advanced vibrator, designed for pleasure and medical use. Our design prioritized ease of use, privacy, and customization, delivering a smooth and secure experience that empowers users to confidently manage their wellbeing.",
    tags: ["ProductDesign", "Wellness", "Privacy"],
  },
];

const ITEM_COPY_HE: PortfolioItemCopy[] = [
  {
    title:
      "העצמה של השקיה חכמה — עיצבנו לברמד פלטפורמה שמקלה על משתמשים לנטר, לנהל ולייעל מערכות מים ביעילות.",
    description:
      "שותפנו לברמד לעיצוב ממשק ידידותי לפלטפורמת ההשקיה המתקדמת. התמקדנו בפישוט ניהול מים מורכב באמצעות פריסות אינטואיטיביות, ויזואליזציה בזמן אמת ובקרות זורמות — כדי לאפשר ניטור והתאמה קלה ושליטה יעילה יותר.",
    tags: ["ProductUI", "ProductResearch", "ProductInterface"],
  },
  {
    title:
      "פלטפורמה אינטואיטיבית לקבוצת אסנס — מסייעת לספקים לנטר חולים ולהגיב במהירות דרך ממשק ברור ונוח.",
    description:
      "עבדנו עם אסנס על פלטפורמת טלטיפול ידידותית לספקים, עם פישוט ניטור, התראות ותגובה בזמן אמת. ה־UI/UX הפך כלים מורכבים לנגישים יותר ותומך בטיפול מהיר ויעיל יותר.",
    tags: ["ProductUX", "ProductResearch", "UIDesign", "UserInterview"],
  },
  {
    title:
      "חידוש בקרת האקלים — לאפליקציה של תדיראן ניהול הסביבה הפנימית בקלות, בכל זמן ומכל מקום.",
    description:
      "עיצבנו מחדש אפליקציית בקרת אקלים חכמה — מתפקוד מורכב לחוויה נקייה, אינטואיטיבית ונגישה, עם דגש על אינטראקציות ברורות וחיבוריות חלקה.",
    tags: ["AppDesign", "AppExperience", "UserExperience"],
  },
  {
    title:
      "שותפות עם נובטו לעיצוב חוויית ”אוזניות בלתי נראות”, לחוויית שמע מרחבי חדשה.",
    description:
      "פיתחנו ממשק אינטואיטיבי שמשתלב בטכנולוגיית i3DS™ של נובטו, עם התאמה אישית לסביבת השמע בלי wearables פיזיים. העיצוב מדגיש פשטות, נגישות ואסתטיקה עתידנית.",
    tags: ["MotionDesign", "TechProduct", "TechStartup"],
  },
  {
    title:
      "שיפור פלטפורמת ה־IIoT של אייקה — נגישות ושימושיות טובות יותר בנתוני תשתית מרחוק.",
    description:
      "שכננו מחדש את הפלטפורמה כך שנתוני תשתית מרוחקת יהיו קלים יותר לצפייה ולפעולה, עם מחקר משתמשים, פישוט זרימות עבודה וויזואליזציה ברורה לניטור נכסים והחלטות מהירות.",
    tags: ["Platform", "Design", "IoT"],
  },
  {
    title:
      "אפליקציית ארקיט לשליטה פשוטה ופרטית, עם ממשק מאובטח — למוצר המשלב הנאה ושימוש רפואי.",
    description:
      "הקמנו אפליקציה אינטואיטיבית לבקרה על המוצר המתקדם של ארקיט, עם דגש על קלות שימוש, פרטיות והתאמה אישית וחוויה חלקה ובטוחה.",
    tags: ["ProductDesign", "Wellness", "Privacy"],
  },
];

function buildItems(
  paths: typeof ITEM_PATHS,
  copy: PortfolioItemCopy[],
): PortfolioPageData["portfolioItems"] {
  return paths.map((p, i) => ({
    ...p,
    ...copy[i],
  }));
}

function logosUnder(base: string): PortfolioPageData["global"]["logos"] {
  const files = [
    ["microsoft_global.svg", "Microsoft"],
    ["american_express_global.svg", "American Express"],
    ["n_gloabl.svg", "N"],
    ["human_global.svg", "Human"],
    ["passport_cart_global.svg", "Passport"],
    ["jfrog_global.svg", "JFrog"],
    ["alam_global.svg", "Alam"],
    ["taboola_global.svg", "Taboola"],
    ["is_global.svg", "IS"],
    ["star_global.svg", "Star"],
    ["playtika_global.svg", "Playtika"],
    ["finaro_global.svg", "Finaro"],
  ] as const;
  return files.map(([file, alt]) => ({ img: `${base}/${file}`, alt }));
}

const DEVICE_IOT_WHY: PortfolioPageData["why"] = {
  mainTitle: "Why Do <br />IoT companies <br />choose us?",
  items: [
    {
      title: "We connect <br />the dots",
      description:
        "Full mastery in the interactions, data flows, and logic of connected devices",
    },
    {
      title: "IoT-driven expertise",
      description:
        "Extensive experience designing interfaces for smart devices and IoT platforms",
    },
    {
      title: "Plugged in from the start",
      description:
        "We understand device ecosystems, so we accelerate your project from day one",
    },
    {
      title: "Seamless integration mindset",
      description:
        "Our UX is crafted for real-time data, device reliability, and user convenience",
    },
  ],
};

export const DEVICE_IOT_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  companyTicker: DEVICE_IOT_COMPANY_TICKER,
  partnerCount: "50+ Device & IoT platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "Device & IoT",
    subtitle: "Work with with the best product designers.",
    description:
      "Triolla brings Devices & IOT products to life with smart tools and workflows.",
    expandedText:
      "We design intuitive and reliable interfaces that bridge the gap between users and connected devices, ensuring seamless interaction in the IoT ecosystem.\n\nOur product design process emphasizes usability, real-time data visualization, and effortless device integration for smart environments.\n\nWith Triolla, your Devices & IoT solutions benefit from design expertise that enhances connectivity, improves user engagement, and accelerates innovation.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: buildItems(ITEM_PATHS, ITEM_COPY_EN),
  why: DEVICE_IOT_WHY,
  global: {
    title: "Our Clients",
    subtitle: "From small to global, we have partnered with some great companies",
    logos: logosUnder(IMG),
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const DEVICE_IOT_PAGE_DATA_HE: PortfolioPageData = {
  ...DEVICE_IOT_PAGE_DATA_EN,
  dir: "rtl",
  partnerCount: "למעלה מ־50 פלטפורמות מכשירים ו-IoT",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "מכשירים ו-IoT",
    subtitle: "הצטרפו לצוות מומחי המוצר שמיישמים את החזון ומספקים תוצאות.",
    description:
      "עיצוב עתיד המכשירים המחוברים. טריאולה יוצרת חוויות IoT חלקות בין חומרה לתוכנה",
    expandedText:
      "מוצרי IoT דורשים התחשבות במגבלות חומרה, אתגרי קישוריות וחוויות חוצות פלטפורמות.\n\nעיצוב ה־UX שלנו מפשט הקמה וניהול מכשירים, יוצר ממשקים לניטור ובקרה בזמן אמת ומאפשר תקשורת חלקה בין הפיזי לדיגיטלי.",
    buttonText: "שותפו איתנו",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: buildItems(ITEM_PATHS, ITEM_COPY_HE),
  why: DEVICE_IOT_WHY,
  global: {
    title: "הלקוחות שלנו",
    subtitle:
      "מחברות קטנות ועד גלובליות, שיתפנו פעולה עם כמה חברות מדהימות",
    logos: logosUnder(IMG),
    buttonText: "בואו נדבר",
    buttonLink: "#contactus",
  },
};
