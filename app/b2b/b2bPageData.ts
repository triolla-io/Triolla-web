import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

/** Portfolio imagery lives in `public/images/` (per-slug `public/assets/b2b/` is not shipped). */
const IMG = "/images";

const ASSETS = {
  bannerGridImg: `${IMG}/banner_grid.svg`,
  bannerLayerImg: `${IMG}/portolio_layer.svg`,
  jumpImg1: `${IMG}/jumping_1-1.svg`,
  jumpImg2: `${IMG}/jumping_2-1.svg`,
  jumpImg3: `${IMG}/jumping_3-1.svg`,
} as const;

const B = IMG;

/** Mirrors `triolla-io-b2b-body.html` `.company_triker`. */
const B2B_COMPANY_TICKER = [
  "Jfrog",
  "Adam Milo",
  "Percepto",
  "Comax",
  "Solar Edge",
] as const;

const ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${B}/jfrog-min.png`,
    desktopImg: `${B}/Jfrog-desktop.png`,
    mobileImg: `${B}/Jfrog-mobile.png`,
    title:
      "Creating a CEO dashboard for quick, clear insights—enabling smarter, faster decisions.",
    description:
      "We designed a streamlined CEO dashboard focused on high-level performance insights, giving executives a clear, real-time view of key business metrics. With smart data visualizations, customizable reports, and intuitive navigation, the dashboard supports quick, informed decision-making at a glance.",
    tags: ["ProductDesign", "UXUI", "UserExperience"],
  },
  {
    logo: `${B}/adam-milo-min.png`,
    desktopImg: `${B}/adam-milo-desktop.png`,
    mobileImg: `${B}/adam-milo-mobile.png`,
    title:
      "Shaping smarter HR decisions, we helped Adam Milo create an intuitive platform for candidate assessments, enabling faster, data-driven decisions.",
    description:
      "We partnered with Adam Milo to design their candidate assessment platform. Our work focused on creating an intuitive interface for conducting skill tests, personality evaluations, and reliability screenings—helping employers make faster, data-driven hiring decisions.",
    tags: ["UXUIDesign", "ProductUI", "UserResearch"],
  },
  {
    logo: `${B}/percepto-min.png`,
    desktopImg: `${B}/Percepto-Desktop.png`,
    mobileImg: `${B}/Percepto-Mobile.png`,
    title:
      "Driving innovation, we enhanced the UX of a global leader’s autonomous drone and industrial inspection platforms.",
    description:
      "Our team designed intuitive dashboards, smart alert systems, and responsive interfaces to make complex drone data clear and actionable.",
    tags: ["DroneDesign", "Dashboards", "SmartSystems"],
  },
  {
    logo: `${B}/Comax-min.png`,
    desktopImg: `${B}/Comax-Desktop-1.png`,
    mobileImg: `${B}/Comax-Mobile.png`,
    title:
      "Transforming retail management, we streamlined COMAX’s ERP and kiosk screens with intuitive UI and seamless integration.",
    description:
      "We worked with Comax to simplify and modernize their ERP and kiosk retail platforms with clean, user-friendly UX/UI. Our design improved daily workflows, from warehouse management to point-of-sale, making complex tasks faster and more intuitive.",
    tags: ["Platforms", "UserFriendly", "POS"],
  },
  {
    logo: `${B}/solar-edge-min.png`,
    desktopImg: `${B}/Solaredge-Desktop.png`,
    mobileImg: `${B}/Solaredge-Mobile.png`,
    title:
      "Supporting smart energy innovation, we collaborated with SolarEdge to enhance their solar system platforms for better user experience and efficiency.",
    description:
      "We partnered with SolarEdge to design intuitive interfaces for their monitoring screens and back-office platform. Our work focused on improving data visualization and streamlining workflows, enabling users to easily track system performance and manage operations efficiently.",
    tags: ["UserEngagement", "IntuitiveDashboards", "ControlTower"],
  },
];

const ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    ...ITEMS_EN[0],
    title:
      "יצירת דאשבורד מנכ״ל לתובנות מהירות וברורות – לקבלת החלטות חכמות ומהירות יותר.",
    description:
      "עיצבנו דאשבורד מנכ״ל ממוקד ויעיל, שמספק להנהלה תצוגה ברורה ובזמן אמת של מדדי הביצוע המרכזיים של הארגון. עם ויזואליזציות נתונים חכמות, דוחות מותאמים אישית וניווט אינטואיטיבי, הדאשבורד מאפשר קבלת החלטות מהירה ומבוססת נתונים – במבט אחד.",
  },
  {
    ...ITEMS_EN[1],
    title:
      "מעצבים החלטות חכמות יותר בתחום משאבי האנוש – סייענו לאדם מילוא ליצור פלטפורמה אינטואיטיבית להערכת מועמדים, המאפשרת קבלת החלטות מהירה ומבוססת נתונים.",
    description:
      "שיתפנו פעולה עם אדם מילוא בעיצוב פלטפורמת הערכת המועמדים שלהם. התמקדנו ביצירת ממשק אינטואיטיבי לביצוע מבחני כישורים, הערכות אישיות ובדיקות אמינות – כדי לאפשר למעסיקים לקבל החלטות גיוס מהירות ומבוססות נתונים.",
  },
  {
    ...ITEMS_EN[2],
    title:
      "שיפרנו את חוויית המשתמש בפלטפורמות הרחפנים האוטונומיים והבקרה התעשייתית של חברה גלובלית מובילה.",
    description:
      "הצוות שלנו עיצב דאשבורדים אינטואיטיביים, מערכות התראות חכמות וממשקים רספונסיביים כדי להפוך נתוני רחפנים מורכבים לברורים, נגישים וברי פעולה.",
  },
  {
    ...ITEMS_EN[3],
    title:
      "מהפכה בניהול הקמעונאי: ייעלנו את מסכי ה־ERP והקיוסקים של COMAX עם ממשק אינטואיטיבי ואינטגרציה חלקה.",
    description:
      "עבדנו עם Comax על פישוט וחידוש פלטפורמות ה־ERP והקיוסקים שלהם, באמצעות עיצוב UX/UI נקי וידידותי למשתמש. התוצאה: שיפור תהליכי העבודה היומיומיים – מניהול מחסן ועד עמדות מכירה – והפיכת משימות מורכבות למהירות ואינטואיטיביות יותר.",
  },
  {
    ...ITEMS_EN[4],
    title:
      "בהובלת חדשנות באנרגיה חכמה, שיתפנו פעולה עם SolarEdge לשדרוג פלטפורמות ניהול המערכות הסולאריות שלהם – לשיפור חוויית המשתמש והיעילות התפעולית.",
    description:
      "עבדנו יחד עם SolarEdge על עיצוב ממשקים אינטואיטיביים למסכי הניטור ולמערכת הניהול האחורית. התמקדנו בשיפור ויזואליזציית הנתונים ובייעול תהליכי העבודה, כך שמשתמשים יוכלו לעקוב בקלות אחר ביצועי המערכת ולנהל את הפעילות ביעילות מרבית.",
  },
];

const LOGOS: PortfolioPageData["global"]["logos"] = [
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

export const B2B_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  companyTicker: [...B2B_COMPANY_TICKER],
  partnerCount: "50+ B2B platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "B2B",
    subtitle: "Work with product design experts who understand you.",
    description:
      "Fluent in B2B, Triolla delivers enterprise tools and efficient workflows....",
    expandedText:
      "We design intuitive interfaces that drive business results, tailoring every solution to the unique challenges of B2B environments. Our product design process focuses on usability, scalability, and seamless integration with enterprise workflows. With Triolla, your business benefits from product design expertise that empowers growth and delivers measurable value.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: ITEMS_EN,
  why: {
    mainTitle: "Why Do B2B companies choose us?",
    items: [
      {
        title: "Enterprise Experience",
        description: "Deep expertise in complex B2B workflows and processes.",
      },
      {
        title: "Team Efficiency",
        description: "We design for multiple user roles and collaboration.",
      },
      {
        title: "ROI-Focused Design",
        description: "Every interface drives measurable business outcomes.",
      },
      {
        title: "Scalable Solutions",
        description: "Platforms that grow with your enterprise needs.",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "Trusted by enterprise companies worldwide",
    logos: LOGOS,
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const B2B_PAGE_DATA_HE: PortfolioPageData = {
  ...B2B_PAGE_DATA_EN,
  dir: "rtl",
  companyTicker: [...B2B_COMPANY_TICKER],
  partnerCount: "מעל 50 פלטפורמות SaaS B2B שפותחו – וממשיכות עוד",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "B2B",
    subtitle: "שתפו פעולה עם מומחי עיצוב מוצר שמבינים אתכם.",
    description:
      "בטריאולה אנו דוברים תקשורת שוטפת בין עסקים (B2B) – החל מכלים ארגוניים ועד זרימות עבודה יעילות....",
    expandedText:
      "אנו מעצבים ממשקים אינטואיטיביים שמניעים תוצאות עסקיות, ומתאימים כל פתרון לאתגרים הייחודיים של סביבות B2B. תהליך עיצוב המוצר שלנו שם דגש על שימושיות, סקיילביליות ואינטגרציה חלקה עם תהליכי עבודה ארגוניים. עם טריאולה, העסק שלכם נהנה ממומחיות בעיצוב מוצר שמעצימה צמיחה ומספקת ערך מדיד.",
    buttonText: "שותפו איתנו",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: ITEMS_HE,
  why: {
    mainTitle: "למה חברות B2B בוחרות בנו?",
    items: [
      {
        title: "ניסיון ארגוני",
        description: "מומחיות בתהליכי B2B מורכבים.",
      },
      {
        title: "יעילות צוותית",
        description: "עיצוב לתפקידים שונים ולשיתוף פעולה.",
      },
      {
        title: "עיצוב ממוקד תשואה",
        description: "כל ממשק תומך בתוצאות עסקיות מדידות.",
      },
      {
        title: "פתרונות סקלאביליים",
        description: "פלטפורמות שגדלות עם צרכי הארגון.",
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
