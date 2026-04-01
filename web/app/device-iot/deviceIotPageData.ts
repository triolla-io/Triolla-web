import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

const EN = "/assets/device-iot";
const HE = "/assets/device-iot-he";

const ASSETS_EN = {
  bannerGridImg: `${EN}/banner_grid.svg`,
  bannerLayerImg: `${EN}/portolio_layer.svg`,
  jumpImg1: `${EN}/jumping_1-1.svg`,
  jumpImg2: `${EN}/jumping_2-1.svg`,
  jumpImg3: `${EN}/jumping_3-1.svg`,
} as const;

const ASSETS_HE = {
  bannerGridImg: `${HE}/banner_grid.svg`,
  bannerLayerImg: `${HE}/portolio_layer.svg`,
  jumpImg1: `${HE}/jumping_1-1.svg`,
  jumpImg2: `${HE}/jumping_2-1.svg`,
  jumpImg3: `${HE}/jumping_3-1.svg`,
} as const;

/** Image paths per row; HE mirror uses some different filenames (see `public/assets/device-iot-he`). */
const ITEM_PATHS_EN = [
  {
    logo: `${EN}/bermad-min.png`,
    desktopImg: `${EN}/Frame-2147224067-2.png`,
    mobileImg: `${EN}/Bermad-mobile.png`,
  },
  {
    logo: `${EN}/Esences.png`,
    desktopImg: `${EN}/Essence-desktop.png`,
    mobileImg: `${EN}/Essence-mobile.png`,
  },
  {
    logo: `${EN}/Tadiran-1.png`,
    desktopImg: `${EN}/Tadiran.png`,
    mobileImg: `${EN}/Tadiran-mobile.png`,
  },
  {
    logo: `${EN}/noveto-min.png`,
    desktopImg: `${EN}/Novetto-desktop.png`,
    mobileImg: `${EN}/Novetto-mobile.png`,
  },
  {
    logo: `${EN}/ayyeka-min.png`,
    desktopImg: `${EN}/Ayyeka-desktop.png`,
    mobileImg: `${EN}/Ayyeka-mobile.png`,
  },
  {
    logo: `${EN}/arkit-min.png`,
    desktopImg: `${EN}/Arkit-desktop.png`,
    mobileImg: `${EN}/Arkit-mobile.png`,
  },
] as const;

const ITEM_PATHS_HE = [
  {
    logo: `${HE}/bermad-min.png`,
    desktopImg: `${HE}/Frame-2147224067-2.png`,
    mobileImg: `${EN}/Bermad-mobile.png`,
  },
  {
    logo: `${HE}/Esences.png`,
    desktopImg: `${HE}/Essence-desktop-1.png`,
    mobileImg: `${HE}/Essence-mobile.png`,
  },
  {
    logo: `${HE}/Tadiran-1.png`,
    desktopImg: `${HE}/Tadiran.png`,
    mobileImg: `${HE}/Tadiran-mobile-1-1.png`,
  },
  {
    logo: `${HE}/noveto-min.png`,
    desktopImg: `${HE}/Novetto-desktop-1.png`,
    mobileImg: `${HE}/Novetto-mobile.png`,
  },
  {
    logo: `${HE}/ayyeka-min.png`,
    desktopImg: `${HE}/Ayyeka-desktop-1.png`,
    mobileImg: `${HE}/Ayyeka-mobile.png`,
  },
  {
    logo: `${HE}/arkit-min.png`,
    desktopImg: `${HE}/Arkit-desktop-1.png`,
    mobileImg: `${HE}/Arkit-mobile-1.png`,
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
  paths: typeof ITEM_PATHS_EN | typeof ITEM_PATHS_HE,
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

export const DEVICE_IOT_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  companyTicker: DEVICE_IOT_COMPANY_TICKER,
  partnerCount: "50+ Device & IoT platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "Device & IoT",
    subtitle: "Team up with product design specialists who deliver.",
    description:
      "Designing the future of connected devices. Triolla creates seamless IoT experiences across hardware and software...",
    expandedText:
      "IoT products require careful consideration of hardware constraints, connectivity challenges, and cross-platform experiences. Our UX design simplifies device setup and management, creates intuitive interfaces for real-time monitoring and control, and enables seamless communication between physical and digital worlds.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS_EN,
  },
  portfolioItems: buildItems(ITEM_PATHS_EN, ITEM_COPY_EN),
  why: {
    mainTitle: "Why Do IoT companies choose us?",
    items: [
      {
        title: "Hardware-Software Expertise",
        description: "Deep understanding of device constraints and capabilities.",
      },
      {
        title: "Complex Data Visualization",
        description: "Making real-time sensor data intuitive and actionable.",
      },
      {
        title: "Connectivity Awareness",
        description: "Designed for offline-first and unreliable connections.",
      },
      {
        title: "Cross-Platform Mastery",
        description: "Seamless experiences across devices, apps, and web.",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "Trusted by leading IoT innovators",
    logos: logosUnder(EN),
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
      "עיצוב עתיד המכשירים המחוברים. טריאולה יוצרת חוויות IoT חלקות בין חומרה לתוכנה...",
    expandedText:
      "מוצרי IoT דורשים התחשבות במגבלות חומרה, אתגרי קישוריות וחוויות חוצות פלטפורמות. עיצוב ה־UX שלנו מפשט הקמה וניהול מכשירים, יוצר ממשקים לניטור ובקרה בזמן אמת ומאפשר תקשורת חלקה בין הפיזי לדיגיטלי.",
    buttonText: "שותפו איתנו",
    buttonLink: "#contactus",
    ...ASSETS_HE,
  },
  portfolioItems: buildItems(ITEM_PATHS_HE, ITEM_COPY_HE),
  why: {
    mainTitle: "למה חברות IoT בוחרות בנו?",
    items: [
      {
        title: "מומחיות חומרה־תוכנה",
        description: "הבנה מעמיקה במגבלות וביכולות מכשיר.",
      },
      {
        title: "ויזואליזציה של נתונים מורכבים",
        description: "נתוני חיישנים בזמן אמת — ברורים וניתנים לפעולה.",
      },
      {
        title: "מודעות לקישוריות",
        description: "עיצוב שמתחשב בעבודה ללא רשת ובחיבורים לא יציבים.",
      },
      {
        title: "שליטה חוצת פלטפורמות",
        description: "חוויה חלקה בין מכשירים, אפליקציות ואתר.",
      },
    ],
  },
  global: {
    title: "הלקוחות שלנו",
    subtitle:
      "מחברות קטנות ועד גלובליות, שיתפנו פעולה עם כמה חברות מדהימות",
    logos: logosUnder(HE),
    buttonText: "בואו נדבר",
    buttonLink: "#contactus",
  },
};
