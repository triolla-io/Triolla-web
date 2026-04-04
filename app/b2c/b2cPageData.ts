import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

/** Portfolio imagery lives in `public/images/` (per-slug `public/assets/b2c/` is not shipped). */
const B = "/images";

const B2C_ASSETS = {
  bannerGridImg: `${B}/banner_grid.svg`,
  bannerLayerImg: `${B}/portolio_layer.svg`,
  jumpImg1: `${B}/jumping_1-1.svg`,
  jumpImg2: `${B}/jumping_2-1.svg`,
  jumpImg3: `${B}/jumping_3-1.svg`,
} as const;

/** Mirrors triolla.io/b2c/ `.company_triker` names. */
const B2C_COMPANY_TICKER = [
  "Tadiran",
  "Intel",
  "Altshuler Shaham",
  "Sweetch",
  "Melingo",
  "Alljobs",
  "Skideal",
  "Comax",
  "PassportCard",
] as const;

const B2C_ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${B}/Tadiran.png`,
    desktopImg: `${B}/Tadiran-1.png`,
    mobileImg: `${B}/Tadiran-mobile-1-1.png`,
    title:
      "Reimagining climate control—Tadiran’s app lets users manage their indoor environment effortlessly, anytime, anywhere.",
    description:
      "We redesigned the smart climate control app to turn complex functionality into a clean, intuitive, and accessible experience—focusing on clear interactions and seamless connectivity.",
    tags: ["MobileApp", "AppDesign", "UserExperience"],
  },
  {
    logo: `${B}/intel-min.png`,
    desktopImg: `${B}/Intel-Desktop.png`,
    mobileImg: `${B}/Intel-mobile.png`,
    title:
      "Intel’s gaming rig builder takes an innovative approach in new compelling touch screen display",
    description:
      "We collaborated with Intel to design a touchscreen experience that lets users intuitively build their ideal gaming rig. A visual customization, guided interactions, created an engaging process for gamers to explore and configure hardware in real time.",
    tags: ["InteractiveUX", "GamingUI", "TouchscreenDesign"],
  },
  {
    logo: `${B}/altshuler-min.png`,
    desktopImg: `${B}/altshuler-desktop1.png`,
    mobileImg: `${B}/Altshuler-mobile-1.png`,
    title:
      "Taking mundane processes with an elevated approach, creating seamless user flows in a vast ecosystem",
    description:
      "the financial house Altshuler Shaham, is our long time partner in creating simple processes, and approachable user flows throughout their products and platforms.",
    tags: ["FintechUX", "InvestmentUI", "MobileDesign"],
  },
  {
    logo: `${B}/Sweetch-min.png`,
    desktopImg: `${B}/Sweetch-image-desktop-1.png`,
    mobileImg: `${B}/Sweetch-mobile-1-1.png`,
    title:
      "Transforming chronic care—Sweetch App delivers personalized interventions tailored to each health journey.",
    description:
      "We collaborated with Sweetch to enhance both the user experience and visual identity of their digital health app. Alongside refining navigation and simplifying complex health data, we developed a warm, approachable illustration style that reinforces motivation and trust.",
    tags: ["UserExperience", "DigitalApp", "B2C"],
  },
  {
    logo: `${B}/melingo-min.png`,
    desktopImg: `${B}/melingo-desktop1.png`,
    mobileImg: `${B}/melingo-mobile1.png`,
    title:
      "Partnering with Melingo and Britannica to design user-friendly language learning experience —blending conversational AI with intuitive, engaging UI.",
    description:
      "We worked with Melingo and Britannica to design an intuitive, engaging language learning experience. We created a student app and a teacher dashboard for monitoring and student tracking.",
    tags: ["AIUXDesign", "EdTechUX", "LanguageTechUI"],
  },
  {
    logo: `${B}/all-jobs-min.png`,
    desktopImg: `${B}/all-jobs-desktop-1.png`,
    mobileImg: `${B}/all-jobs-mobile-1.png`,
    title:
      "A user friendly concept to a professional questionnaire, elevating a simplified process with fun, engaging elements.",
    description:
      "customized illustrations a clean look while maintaining brand identity, created a unique outlook to a seemingly “boring” process.",
    tags: ["JobTechDesign", "UserFriendlyDesign"],
  },
  {
    logo: `${B}/skideal-min.png`,
    desktopImg: `${B}/Skideal-desktop-1.png`,
    mobileImg: `${B}/Skideal-mobile-1.png`,
    title:
      "Our long time partner entrusted us with defining the user experience of their brand both on desktop and mobile.",
    description:
      "Designing SkiDeal’s main flows with a fresh visual identity, a user-friendly interface that simplifies complex trip planning into a smooth, step-by-step experience.",
    tags: ["VacationBookingUX", "SeamlessCheckout", "UXForTravel"],
  },
  {
    logo: `${B}/Comax-min.png`,
    desktopImg: `${B}/Comax-Desktop-1.png`,
    mobileImg: `${B}/Comax-Mobile.png`,
    title: "An ERP & Retail platform given a fresh approach to UI UX",
    description:
      "Simplified and modernized ERP and retail platforms with clean, user-friendly designs and flows.",
    tags: ["SmartERPDesign", "RetailUX", "EnterpriseUI"],
  },
  {
    logo: `${B}/Passport-card-1.png`,
    desktopImg: `${B}/Passport-card-desktop-1.png`,
    mobileImg: `${B}/Passport-card-mobile-1-1.png`,
    title:
      "Designing a user-friendly app for PassportCard, making travelers easily claim tax refunds on shopping abroad.",
    description:
      "We created a user-friendly app for PassportCard that simplifies claiming tax refunds on international purchases. Designed for ease and speed, it guides travelers step-by-step—from uploading receipts to tracking their refunds—using a clean interface, clear prompts, and real-time updates to make the process smooth and hassle-free.",
    tags: ["InsurTech", "MicroAnimation", "TravelApp"],
  },
];

const B2C_ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    ...B2C_ITEMS_EN[0],
    title:
      "מגדירים מחדש שליטה באקלים – האפליקציה של תדיראן מאפשרת למשתמשים לנהל את הסביבה הביתית שלהם בקלות, מכל מקום ובכל זמן.",
    description:
      "עיצבנו מחדש את אפליקציית השליטה החכמה, והפכנו פונקציונליות מורכבת לחוויה נקייה, אינטואיטיבית ונגישה – עם דגש על אינטראקציות ברורות וחיבוריות חלקה.",
  },
  {
    ...B2C_ITEMS_EN[1],
    title:
      "פתרון בניית מחשבי הגיימינג של Intel מציג גישה חדשנית במסך מגע אינטראקטיבי ומרשים.",
    description:
      "שיתפנו פעולה עם Intel בעיצוב חוויית מסך מגע שמאפשרת למשתמשים להרכיב בקלות את מערכת הגיימינג המושלמת עבורם. תהליך ויזואלי ואינטראקטיבי הופך את בחירת הרכיבים וההתאמה האישית לחוויה מהנה, אינטואיטיבית ומיידית עבור גיימרים.",
  },
  {
    ...B2C_ITEMS_EN[2],
    title:
      "לוקחים תהליכים יומיומיים ומרימים אותם לרמה חדשה – יוצרים חוויות משתמש חלקות במערכת אקולוגית רחבה.",
    description:
      "בית ההשקעות אלטשולר שחם הוא שותף ותיק שלנו בפישוט תהליכים ובבניית מסלולי משתמש נגישים וברורים בכל המוצרים והפלטפורמות שלהם.",
  },
  {
    ...B2C_ITEMS_EN[3],
    title:
      "מהפכה בניהול מחלות כרוניות – אפליקציית Sweetch מספקת התערבויות מותאמות אישית לכל מסע בריאותי.",
    description:
      "שיתפנו פעולה עם Sweetch לשדרוג חוויית המשתמש והמראה הוויזואלי של אפליקציית הבריאות הדיגיטלית שלהם. לצד שיפור הניווט והפשטת נתוני הבריאות המורכבים, פיתחנו שפה איורית חמה ומזמינה שמגבירה מוטיבציה ואמון.",
  },
  {
    ...B2C_ITEMS_EN[4],
    title:
      "שיתוף פעולה עם מלינגו ובריטניקה לעיצוב חוויית למידת שפה ידידותית למשתמש – המשלבת בינה מלאכותית שיחתית עם ממשק אינטואיטיבי ומעורר עניין.",
    description:
      "עבדנו עם Melingo ו-Britannica על עיצוב חוויית למידה אינטואיטיבית ומרתקת, שכללה אפליקציה לתלמידים ודשבורד למורים לניטור ומעקב אחר התקדמות הלמידה.",
  },
  {
    ...B2C_ITEMS_EN[5],
    title:
      "קונספט ידידותי למשתמש לשאלון מקצועי – הופך תהליך פשוט לחוויה מהנה ומעורבת.",
    description:
      "איורים מותאמים אישית ועיצוב נקי, תוך שמירה על זהות המותג, יצרו זווית ייחודית גם עבור תהליך שנחשב \"משעמם\" לכאורה.",
  },
  {
    ...B2C_ITEMS_EN[6],
    title:
      "השותף הוותיק שלנו בחר בנו להוביל את חוויית המשתמש של המותג – בדסקטופ ובמובייל.",
    description:
      "עיצבנו עבור SkiDeal את המסלולים המרכזיים באתר ובאפליקציה, עם שפה ויזואלית רעננה וממשק ידידותי, שהופכים תכנון חופשה מורכב לתהליך פשוט, ברור ומדורג.",
  },
  {
    ...B2C_ITEMS_EN[7],
    title: "פלטפורמת ERP וקמעונאות שקיבלה גישה חדשה לעיצוב UI/UX",
    description:
      "פישטנו וחידשנו את מערכות ה-ERP והקמעונאות עם עיצוב נקי, מודרני וידידותי למשתמש, המאפשר תהליכי עבודה ברורים ויעילים.",
  },
  {
    ...B2C_ITEMS_EN[8],
    title:
      "עיצוב אפליקציה ידידותית ל-PassportCard, המאפשרת לנוסעים להגיש החזרי מס על קניות בחו\"ל בקלות.",
    description:
      "פיתחנו אפליקציה נוחה ופשוטה ל-PassportCard, שמפשטת את תהליך הגשת החזרי המס על רכישות בחו\"ל. האפליקציה מלווה את המשתמשים שלב אחר שלב – מהעלאת קבלות ועד מעקב אחר ההחזרים – באמצעות ממשק נקי, הנחיות ברורות ועדכונים בזמן אמת, והופכת את התהליך למהיר, נוח וללא טרחה.",
  },
];

const B2C_GLOBAL_LOGOS: PortfolioPageData["global"]["logos"] = [
  { img: `${B}/microsoft_global.svg`, alt: "Microsoft" },
  { img: `${B}/american_express_global.svg`, alt: "American Express" },
  { img: `${B}/n_gloabl.svg`, alt: "N" },
  { img: `${B}/human_global.svg`, alt: "Human" },
  { img: `${B}/passport_cart_global.svg`, alt: "Passport" },
  { img: `${B}/jfrog_global.svg`, alt: "JFrog" },
  { img: `${B}/alam_global.svg`, alt: "Alam" },
  { img: `${B}/taboola_global.svg`, alt: "Taboola" },
  { img: `${B}/is_global.svg`, alt: "IS" },
  { img: `${B}/star_global.svg`, alt: "Star" },
  { img: `${B}/playtika_global.svg`, alt: "Playtika" },
  { img: `${B}/finaro_global.svg`, alt: "Finaro" },
];

export const B2C_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  companyTicker: [...B2C_COMPANY_TICKER],
  partnerCount: "50+ B2C apps and counting",
  header: {
    eyebrow: "Product design for",
    title: "B2C",
    subtitle: "Collaborate with product design leaders.",
    description:
      "Triolla’s approach to B2C unites advanced tools and efficient workflows....",
    expandedText:
      "We craft engaging and intuitive interfaces that elevate the user experience and connect directly with your customers. Our product design process for B2C brands focuses on usability, visual appeal, and seamless interaction across all digital touchpoints. With Triolla, your consumer products benefit from design expertise that drives loyalty, boosts satisfaction, and sets your brand apart in a competitive market.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...B2C_ASSETS,
  },
  portfolioItems: B2C_ITEMS_EN,
  why: {
    mainTitle: "Why Do B2C companies choose us?",
    items: [
      {
        title: "We get your audience",
        description:
          "Aligned with the habits, journeys, and expectations of B2C users",
      },
      {
        title: "Consumer-focused expertise",
        description:
          "Dozens of digital products designed for top B2C brands",
      },
      {
        title: "Quick to connect",
        description:
          "We understand your market, so we create impact from day one",
      },
      {
        title: "Experience-first approach",
        description:
          "Our UX is shaped around your customers, their needs, and their lifestyle",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "From small to global, we have partnered with some great companies",
    logos: B2C_GLOBAL_LOGOS,
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const B2C_PAGE_DATA_HE: PortfolioPageData = {
  ...B2C_PAGE_DATA_EN,
  dir: "rtl",
  companyTicker: [...B2C_COMPANY_TICKER],
  partnerCount: "בנינו כבר למעלה מ-50 אפליקציות B2C",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "B2C",
    subtitle: "שתפו פעולה עם מומחי עיצוב מוצר שמבינים את זה.",
    description:
      "בטריאולה, אנחנו דוברים שוטף את שיטת B2C - החל ממסעות לקוח ועד לחוויות דיגיטליות חלקות....",
    expandedText:
      "אנחנו יוצרים ממשקים מרתקים ואינטואיטיביים שמעצימים את חוויית המשתמש ומתחברים ישירות ללקוחות שלך. תהליך עיצוב המוצר שלנו עבור מותגי B2C מתמקד בשמישות, באסתטיקה ויזואלית ובאינטראקציה חלקה בכל נקודות המגע הדיגיטליות. עם Triolla, מוצרי הצריכה שלך נהנים ממומחיות עיצובית שמגבירה נאמנות, משפרת שביעות רצון ומבדלת את המותג שלך בשוק תחרותי.",
    buttonText: "בוא נדבר",
    buttonLink: "#contactus",
    ...B2C_ASSETS,
  },
  portfolioItems: B2C_ITEMS_HE,
  why: {
    mainTitle: "למה חברות B2C בוחרות בנו?",
    items: [
      {
        title: "אנחנו מבינים את הקהל שלך",
        description: "מתואמים להרגלים, למסעות ולציפיות של משתמשי B2C",
      },
      {
        title: "מומחיות ממוקדת צרכן",
        description: "עשרות מוצרים דיגיטליים שעוצבו עבור מותגי B2C מובילים",
      },
      {
        title: "יוצרים חיבור מהיר",
        description: "אנחנו מכירים את השוק שלך – ומייצרים השפעה מהיום הראשון",
      },
      {
        title: "גישה ממוקדת חוויה",
        description:
          "חוויית המשתמש שלנו נבנית סביב הלקוחות שלך, הצרכים שלהם ואורח החיים שלהם",
      },
    ],
  },
  global: {
    title: "הלקוחות שלנו",
    subtitle: "מחברות קטנות ועד גלובליות, שיתפנו פעולה עם כמה חברות מדהימות",
    logos: B2C_GLOBAL_LOGOS,
    buttonText: "בוא נדבר",
    buttonLink: "#contactus",
  },
};
