import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

/** Header / decorative SVGs live under `public/images/`. */
const IMG = "/images";
/** Portfolio screenshots and logos (deduped mirrors live in `public/assets/_shared/`). */
const SHARED = "/assets/_shared";

const ASSETS = {
  bannerGridImg: `${IMG}/banner_grid.svg`,
  bannerLayerImg: `${IMG}/portolio_layer.svg`,
  jumpImg1: `${IMG}/jumping_1-1.svg`,
  jumpImg2: `${IMG}/jumping_2-1.svg`,
  jumpImg3: `${IMG}/jumping_3-1.svg`,
} as const;

const SAAS_COMPANY_TICKER = [
  "Jfrog",
  "Playtika",
  "Taboola",
  "Juxta",
  "LayerX",
  "Melingo",
  "PlainID",
] as const;

const ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${SHARED}/jfrog-min.png`,
    desktopImg: `${SHARED}/Jfrog-desktop.png`,
    mobileImg: `${SHARED}/Jfrog-mobile.png`,
    title:
      "Creating a CEO dashboard for quick, clear insights—enabling smarter, faster decisions.",
    description:
      "We designed a streamlined CEO dashboard focused on high-level performance insights, giving executives a clear, real-time view of key business metrics. With smart data visualizations, customizable reports, and intuitive navigation, the dashboard supports quick, informed decision-making at a glance.",
    tags: ["ProductUI", "Research", "Interview"],
  },
  {
    logo: `${SHARED}/playtika-min.png`,
    desktopImg: `${SHARED}/Playtika-desktop-2.png`,
    mobileImg: `${SHARED}/Playtika-mobile-2.png`,
    title:
      "Redefining game intelligence by enhancing user engagement and performance through Playtika’s management and analytics platforms.",
    description:
      "A long and successful collaborations with Playtika on their internal platforms, focusing on analysis solutions, marketing, game experience, user satisfaction, data and more.",
    tags: ["ProductUX", "ProductResearch", "UserInterview"],
  },
  {
    logo: `${SHARED}/taboola-min.png`,
    desktopImg: `${SHARED}/Taboola-desktop.png`,
    mobileImg: `${SHARED}/Taboola-mobile.png`,
    title:
      "A collaboration with Taboola to redesign key parts of their publisher and advertiser platforms, improving clarity and control at scale.",
    description:
      "Focused on data-heavy interfaces, we worked to simplify the user journey for campaign setup, analytics, and content recommendations. The updated experience delivers faster insights, easier navigation, and a more consistent design across their suite of tools.",
    tags: ["Product", "UserPlatform", "DataInterfaces"],
  },
  {
    logo: `${SHARED}/Juxta.png`,
    desktopImg: `${SHARED}/Juxta-desktop.png`,
    mobileImg: `${SHARED}/Juxta-mobile.png`,
    title:
      "We teamed up with Juxta to design a clear, efficient platform for store management—simplifying inventory, malfunction reports, and daily operations.",
    description:
      "a collaboration with Juxta to design a streamlined platform for store management, covering inventory tracking, malfunction reporting, and daily operations. Focused on clarity and efficiency, the UI helps managing accurately and efficiently —improving store performance and reducing downtime.",
    tags: ["ProductDesign", "ProductUI", "UXUI"],
  },
  {
    logo: `${SHARED}/layerx-min.png`,
    desktopImg: `${SHARED}/Layer-x-desktop.png`,
    mobileImg: `${SHARED}/Layer-x-mobile.png`,
    title:
      "working with Layer X to simplify their security platform, designing clear dashboards and workflows, making threat data more accessible and actionable.",
    description:
      "In a collaboration with LayerX, we delivered an intuitive dashboards and smart data visuals to help IT teams easily monitor, manage, and respond to security events in real time.",
    tags: ["UXUI", "IntuitivDesign", "DashboardDesign"],
  },
  {
    logo: `${SHARED}/melingo-min.png`,
    desktopImg: `${SHARED}/melingo-desktop-1-1.png`,
    mobileImg: `${SHARED}/melingo-mobile-1-1.png`,
    title:
      "Partnering with Melingo and Britannica to design user-friendly language learning experience —blending conversational AI with intuitive, engaging UI.",
    description:
      "We worked with Melingo and Britannica to design an intuitive, engaging language learning experience.\nWe created a student app and a teacher dashboard for monitoring and student tracking.",
    tags: ["SystemDesign", "UserExperience", "DigitalDesign"],
  },
  {
    logo: `${SHARED}/plainid-min.png`,
    desktopImg: `${SHARED}/plain-id-desktop.png`,
    mobileImg: `${SHARED}/plain-id-mobile.png`,
    title: "We partnered with PlainID, elevating their platform user experience and design approach.",
    description:
      "Designing PlainID new system—from dashboards to inner screens—creating a seamless, intuitive UX that simplifies complex authorization workflows for security teams.",
    tags: ["UXDesign", "UI", "Product"],
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
      "מגדירים מחדש אינטליגנציה במשחקים – משפרים מעורבות וביצועים באמצעות פלטפורמות הניהול והאנליטיקה של Playtika.",
    description:
      "שיתוף פעולה ארוך ומוצלח עם Playtika בפיתוח פלטפורמות פנימיות, עם דגש על פתרונות אנליזה, שיווק, חוויית משחק, שביעות רצון משתמשים, ניהול נתונים ועוד.",
  },
  {
    ...ITEMS_EN[2],
    title:
      "שיתוף פעולה עם Taboola לעיצוב מחדש של חלקים מרכזיים בפלטפורמות המפרסמים והשותפים, במטרה לשפר את הבהירות והשליטה – גם בהיקפים גדולים.",
    description:
      "התמקדנו בממשקים עתירי נתונים, ופישטנו את מסלול המשתמש בהגדרת קמפיינים, ניתוח נתונים והמלצות תוכן. החוויה החדשה מספקת תובנות מהירות יותר, ניווט קל ועיצוב עקבי בכל מערך הכלים של Taboola.",
  },
  {
    ...ITEMS_EN[3],
    title:
      "שיתפנו פעולה עם Juxta לעיצוב פלטפורמה ברורה ויעילה לניהול חנויות – המפשטת את ניהול המלאי, הדיווח על תקלות והתפעול היומיומי.",
    description:
      "הפלטפורמה שפותחה כוללת כלים לניהול מלאי, דיווח תקלות ותהליכים שוטפים, עם ממשק ממוקד בבהירות וביעילות. כך ניתן לנהל את החנות בדיוק ובקלות, לשפר את הביצועים ולהפחית זמני השבתה.",
  },
  {
    ...ITEMS_EN[4],
    title:
      "עבדנו עם Layer X על פישוט פלטפורמת האבטחה שלהם, תוך עיצוב דאשבורדים ברורים ותהליכי עבודה יעילים – כדי להפוך נתוני איומים לנגישים וברי פעולה.",
    description:
      "במסגרת שיתוף הפעולה, יצרנו עבור LayerX לוחות בקרה אינטואיטיביים וויזואליזציות נתונים חכמות, המאפשרים לצוותי IT לנטר, לנהל ולהגיב לאירועי אבטחה בקלות ובזמן אמת.",
  },
  {
    ...ITEMS_EN[5],
    title:
      "שיתפנו פעולה עם מלינגו ובריטניקה לעיצוב חוויית למידת שפה ידידותית למשתמש – המשלבת בינה מלאכותית שיחתית עם ממשק אינטואיטיבי ומעורר עניין.",
    description:
      "עבדנו עם Melingo ו-Britannica על עיצוב חוויית למידה אינטואיטיבית ומרתקת, שכללה אפליקציה לתלמידים ודשבורד למורים לניטור ומעקב אחר התקדמות הלמידה.",
  },
  {
    ...ITEMS_EN[6],
    title:
      "שיתפנו פעולה עם PlainID ושדרגנו את חוויית המשתמש והגישה העיצובית של הפלטפורמה שלהם.",
    description:
      "עיצבנו את המערכת החדשה של PlainID – מדאשבורדים ועד מסכים פנימיים – ויצרנו חוויית משתמש חלקה ואינטואיטיבית שמפשטת תהליכי הרשאות מורכבים עבור צוותי אבטחה.",
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

export const SAAS_PLATFORMS_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  companyTicker: [...SAAS_COMPANY_TICKER],
  partnerCount: "50+ SaaS platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "SaaS Platforms",
    subtitle: "Partner with product design experts who get it.",
    description:
      "We speak fluent SaaS platforms — from onboarding flows to robust dashboards",
    expandedText:
      "As SaaS platforms become essential tools for businesses and individuals, UX design is key to making complex capabilities accessible and user-friendly.\n\nIn SaaS, great UX means guiding users through workflows and features with clarity, helping them achieve their goals efficiently without unnecessary friction. A well-designed SaaS interface builds trust, drives adoption, and empowers users to take full advantage of the platform. By anticipating user needs and minimizing common errors, UX design ensures a seamless, productive, and enjoyable experience.\n\nAt Triolla, we specialize in designing SaaS platforms that are intuitive, scalable, and focused on real user success.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: ITEMS_EN,
  why: {
    mainTitle: "Why Do <br />SaaS companies <br />choose us?",
    items: [
      {
        title: "SaaS Expertise<br />Delivered",
        description:
          "We understand the unique challenges, workflows, and expectations of SaaS users.",
      },
      {
        title: "Proven Results Across the Industry",
        description:
          "Our team has crafted high-performing SaaS platforms for top tech companies.",
      },
      {
        title: "Seamless Onboarding, Rapid Impact",
        description:
          "We quickly align with your product vision and hit the ground running from day one.",
      },
      {
        title: "UX That Drives Adoption and Growth",
        description:
          "Our design approach puts your users, scalability, and business objectives at the center of every decision.",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "Trusted by leading SaaS innovators",
    logos: LOGOS,
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const SAAS_PLATFORMS_PAGE_DATA_HE: PortfolioPageData = {
  ...SAAS_PLATFORMS_PAGE_DATA_EN,
  dir: "rtl",
  companyTicker: [...SAAS_COMPANY_TICKER],
  partnerCount: "מעל 50 פלטפורמות SaaS, והן ממשיכות להגיע",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "פלטפורמות SaaS",
    subtitle: "הצטרפו למומחי עיצוב מוצר שמבינים אתכם באמת.",
    description:
      "ב-טריאולה אנחנו דוברים SaaS שוטף – מהתהליכי קליטה (Onboarding) ועד לדשבורדים מתקדמים",
    expandedText:
      "ככל שפלטפורמות SaaS הופכות לכלי עבודה חיוניים לעסקים ולאנשים פרטיים, עיצוב חוויית משתמש (UX) הוא המפתח להנגשת יכולות מורכבות בצורה פשוטה ונוחה.\n\nב-SaaS, UX מצוין פירושו להוביל את המשתמשים בתהליכים ובפיצ'רים בצורה ברורה, לעזור להם להשיג את מטרותיהם ביעילות וללא חיכוך מיותר. ממשק SaaS מעוצב היטב בונה אמון, מגביר את האימוץ ומעצים את המשתמשים למצות את מלוא הפוטנציאל של הפלטפורמה. על ידי חיזוי צרכי המשתמש וצמצום טעויות נפוצות, עיצוב UX מבטיח חוויה חלקה, פרודוקטיבית ומהנה.\n\nב-Triolla אנו מתמחים בעיצוב פלטפורמות SaaS אינטואיטיביות, גמישות וממוקדות בהצלחת המשתמשים האמיתית.",
    buttonText: "הצטרפו אלינו",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: ITEMS_HE,
  /** Live https://triolla.io/he/saas-platforms/ still serves English in this block; Hebrew is a faithful translation of EN. */
  why: {
    mainTitle: "למה <br />חברות SaaS <br />בוחרות בנו?",
    items: [
      {
        title: "מומחיות SaaS <br />במימוש",
        description:
          "אנחנו מבינים את האתגרים, זרימות העבודה והציפיות הייחודיות של משתמשי SaaS",
      },
      {
        title: "תוצאות מוכחות בתעשייה",
        description:
          "הצוות שלנו בנה פלטפורמות SaaS בביצועים גבוהים לחברות טכנולוגיה מובילות",
      },
      {
        title: "קליטה חלקה, השפעה מהירה",
        description:
          "מתיישרים במהירות לחזון המוצר ויוצאים לדרך כבר מהיום הראשון",
      },
      {
        title: "UX שמניע אימוץ וצמיחה",
        description:
          "גישת העיצוב שלנו שמה במרכז את המשתמשים, הסקיילביליות ומטרות העסק בכל החלטה",
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
