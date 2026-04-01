import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

const M = "/assets/mobile-apps";

const MOBILE_COMPANY_TICKER = [
  "Tadiran",
  "Swetch",
  "Melingo",
  "PassportCard",
  "Hot",
  "CBS Survivor",
  "Overwolf",
  "Playtika",
] as const;

const ASSETS = {
  bannerGridImg: `${M}/banner_grid.svg`,
  bannerLayerImg: `${M}/portolio_layer.svg`,
  jumpImg1: `${M}/jumping_1-1.svg`,
  jumpImg2: `${M}/jumping_2-1.svg`,
  jumpImg3: `${M}/jumping_3-1.svg`,
} as const;

const ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${M}/Tadiran-1.png`,
    desktopImg: `${M}/Tadiran.png`,
    mobileImg: `${M}/Tadiran.png`,
    title:
      "Reimagining climate control—Tadiran’s app lets users manage their indoor environment effortlessly, anytime, anywhere.",
    description:
      "We redesigned the smart climate control app to turn complex functionality into a clean, intuitive, and accessible experience—focusing on clear interactions and seamless connectivity.",
    tags: ["ControlApp", "UserExperience", "ProductDesign"],
  },
  {
    logo: `${M}/Sweetch-min.png`,
    desktopImg: `${M}/Sweetch-desktop.png`,
    mobileImg: `${M}/Sweetch-mobile-1.png`,
    title:
      "Transforming chronic care—Sweetch App delivers personalized interventions tailored to each health journey.",
    description:
      "We collaborated with Sweetch to enhance both the user experience and visual identity of their digital health app. Alongside refining navigation and simplifying complex health data, we developed a warm, approachable illustration style that reinforces motivation and trust.",
    tags: ["HealthApp", "ProductUI", "ProductUX"],
  },
  {
    logo: `${M}/melingo-min.png`,
    desktopImg: `${M}/Melingo-desktop.png`,
    mobileImg: `${M}/Melingo-mobile.png`,
    title:
      "Partnering with Melingo and Britannica to design user-friendly language learning experience —blending conversational AI with intuitive, engaging UI.",
    description:
      "We worked with Melingo and Britannica to design an intuitive, engaging language learning experience.\nWe created a student app and a teacher dashboard for monitoring and student tracking.",
    tags: ["EdTech", "IntuitiveDesign", "LearningExperience"],
  },
  {
    logo: `${M}/Passport-card-1.png`,
    desktopImg: `${M}/Passport-card-desktop.png`,
    mobileImg: `${M}/Passport-card-mobile.png`,
    title:
      "PassportCard offers international health insurance with instant coverage, personalized service, and an innovative user experience—so you can travel with peace of mind.",
    description:
      "We partnered with PassportCard to enhance the user experience and visual design—creating intuitive interfaces and a friendly visual language that supports a clear, accessible, and personalized experience.",
    tags: ["PersonalizedExperience", "UserResearch", "ProductResearch"],
  },
  {
    logo: `${M}/Hot-1.png`,
    desktopImg: `${M}/Hot-desktop.png`,
    mobileImg: `${M}/Hot-mobile.png`,
    title:
      "Redesigning Hot clients club app, offering a seamless experience where users can quickly browse, activate, and redeem offers, all within a clean, intuitive interface.",
    description:
      "Designing Hot’s club card app, focusing on making discounts and offers easily accessible and rewarding. The app offers a seamless experience where users can quickly browse, activate, and redeem offers, all within a clean, intuitive interface",
    tags: ["IntuitiveInterface", "AppDesign", "ExperienceDesign"],
  },
];

const ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    ...ITEMS_EN[0],
    title:
      "מגדירים מחדש שליטה באקלים – האפליקציה של תדיראן מאפשרת למשתמשים לנהל את הסביבה הביתית שלהם בקלות, מכל מקום ובכל זמן.",
    description:
      "עיצבנו מחדש את אפליקציית השליטה החכמה, והפכנו פונקציונליות מורכבת לחוויה נקייה, אינטואיטיבית ונגישה, עם דגש על אינטראקציות ברורות וחיבוריות חלקה.",
  },
  {
    ...ITEMS_EN[1],
    title:
      "מהפכה בניהול מחלות כרוניות – אפליקציית Sweetch מספקת התערבויות מותאמות אישית לכל מסע בריאותי.",
    description:
      "שיתפנו פעולה עם Sweetch לשדרוג חוויית המשתמש והמראה הוויזואלי של אפליקציית הבריאות הדיגיטלית שלהם. לצד שיפור הניווט והפשטת נתוני הבריאות המורכבים, פיתחנו שפה איורית חמה ומזמינה שמגבירה מוטיבציה ואמון.",
  },
  {
    ...ITEMS_EN[2],
    title:
      "שיתוף פעולה עם מלינגו ובריטניקה לעיצוב חוויית למידת שפה ידידותית למשתמש – המשלבת בינה מלאכותית שיחתית עם ממשק אינטואיטיבי ומעורר עניין.",
    description:
      "עבדנו עם Melingo ו-Britannica על עיצוב חוויית למידה אינטואיטיבית ומרתקת, שכללה אפליקציה לתלמידים ודשבורד למורים לניטור ומעקב אחר התקדמות הלמידה.",
  },
  {
    ...ITEMS_EN[3],
    title:
      "PassportCard מציעה ביטוח בריאות בינלאומי עם כיסוי מיידי, שירות אישי וחוויית משתמש חדשנית – כדי שתוכלו לטייל בראש שקט.",
    description:
      "שיתפנו פעולה עם PassportCard לשדרוג חוויית המשתמש והעיצוב הוויזואלי – יצרנו ממשקים אינטואיטיביים ושפה גרפית ידידותית, התומכים בחוויה ברורה, נגישה ומותאמת אישית.",
  },
  {
    ...ITEMS_EN[4],
    title:
      "עיצבנו מחדש את אפליקציית מועדון הלקוחות של HOT, ומציעים חוויה חלקה שבה המשתמשים יכולים לגלוש, להפעיל ולממש הטבות בקלות – הכל בממשק נקי ואינטואיטיבי.",
    description:
      "פיתחנו את אפליקציית מועדון הלקוחות של HOT עם דגש על נגישות ונוחות, כך שההנחות וההטבות זמינות, ברורות ומתגמלות – והכל בחוויה פשוטה ומהנה.",
  },
];

const LOGOS: PortfolioPageData["global"]["logos"] = [
  { img: "/assets/mobile-apps/microsoft_global.svg", alt: "Microsoft" },
  { img: "/assets/mobile-apps/american_express_global.svg", alt: "American Express" },
  { img: "/assets/mobile-apps/n_gloabl.svg", alt: "N" },
  { img: "/assets/mobile-apps/human_global.svg", alt: "Human" },
  { img: "/assets/mobile-apps/passport_cart_global.svg", alt: "Passport" },
  { img: "/assets/mobile-apps/jfrog_global.svg", alt: "JFrog" },
  { img: "/assets/mobile-apps/alam_global.svg", alt: "Alam" },
  { img: "/assets/mobile-apps/taboola_global.svg", alt: "Taboola" },
  { img: "/assets/mobile-apps/is_global.svg", alt: "IS" },
  { img: "/assets/mobile-apps/star_global.svg", alt: "Star" },
  { img: "/assets/mobile-apps/playtika_global.svg", alt: "Playtika" },
  { img: "/assets/mobile-apps/finaro_global.svg", alt: "Finaro" },
];

export const MOBILE_APPS_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  companyTicker: [...MOBILE_COMPANY_TICKER],
  partnerCount: "50+ Mobile Apps platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "Mobile Apps",
    subtitle: "Design a product with experts who understand your needs",
    description:
      "In the world of Mobile Apps, Triolla creates intuitive interfaces and powerful features....",
    expandedText:
      "As mobile experiences become more central to daily life, UX design plays a crucial role in making powerful features accessible and intuitive. In mobile apps, great UX means guiding users through key actions with clarity and ease, without overwhelming them with unnecessary complexity. A well-designed mobile interface builds trust, encourages engagement, and gives users a sense of control on any device. By anticipating user needs and preventing common mistakes, UX design helps create seamless, enjoyable, and reliable app experiences. At Triolla, we specialize in designing mobile apps that are intuitive, engaging, and centered around real user needs.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: ITEMS_EN,
  why: {
    mainTitle: "Why Do mobile app companies choose us?",
    items: [
      {
        title: "We think mobile-first",
        description:
          "We know about user flows, gestures, and the dynamics of mobile experiences.",
      },
      {
        title: "App design expertise",
        description:
          "A proven record designing intuitive and engaging mobile applications.",
      },
      {
        title: "Onboard from day one",
        description: "We understand mobile users, so we deliver value from the very start.",
      },
      {
        title: "Experience in your pocket",
        description:
          "Our UX is crafted for usability, speed, and seamless interaction on any device.",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "Trusted by mobile leaders worldwide",
    logos: LOGOS,
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const MOBILE_APPS_PAGE_DATA_HE: PortfolioPageData = {
  ...MOBILE_APPS_PAGE_DATA_EN,
  dir: "rtl",
  companyTicker: [...MOBILE_COMPANY_TICKER],
  partnerCount: "מעל 50 פלטפורמות מובייל, והן ממשיכות להגיע",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "אפליקציות מובייל",
    subtitle: "שתפו פעולה עם מומחי עיצוב מוצר שמבינים אתכם.",
    description:
      "טריאולה מובילה את עולם המובייל עם חוויות משתמש אינטואיטיביות ופיצ’רים שמייצרים ערך אמיתי....",
    expandedText:
      "באפליקציות מובייל, חוויית משתמש מצוינת היא כזו שמובילה את המשתמשים לפעולות המרכזיות בפשטות ובבהירות, מבלי להעמיס עליהם מורכבות מיותרת. ממשק מובייל מתוכנן היטב בונה אמון, מעודד מעורבות ומעניק למשתמשים תחושת שליטה – בכל מכשיר. בטריאולה אנו מתמחים בעיצוב אפליקציות מובייל אינטואיטיביות, מרתקות וממוקדות בצרכים האמיתיים של המשתמשים.",
    buttonText: "בואו נבנה יחד",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: ITEMS_HE,
  why: {
    mainTitle: "למה חברות אפליקציות מובייל בוחרות בנו?",
    items: [
      {
        title: "אנחנו חושבים mobile-first",
        description: "מכירים כל מחווה, כל זרימה – ואת מה שהופך חוויית מובייל לבלתי נשכחת.",
      },
      {
        title: "ניסיון מוכח בעיצוב אפליקציות",
        description:
          "רקורד מוכח ביצירת אפליקציות מובייל חכמות, קלות לשימוש ומלאות ערך.",
      },
      {
        title: "בקצב מהיום הראשון",
        description: "כשמכירים את המשתמשים לעומק – הערך מורגש מהאינטראקציה הראשונה.",
      },
      {
        title: "חוויה בכף היד",
        description: "UX מדויק שמבטיח שימוש חלק, תגובה מהירה וחוויה מותאמת לכל מסך.",
      },
    ],
  },
  global: {
    title: "הלקוחות שלנו",
    subtitle:
      "מחברות קטנות ועד גלובליות, שיתפנו פעולה עם כמה חברות מדהימות",
    logos: LOGOS,
    buttonText: "בואו נדבר",
    buttonLink: "#contactus",
  },
};
