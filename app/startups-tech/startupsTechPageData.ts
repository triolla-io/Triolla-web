import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

const STG = "/assets/startups-tech";

const STARTUPS_TECH_ASSETS = {
  bannerGridImg: `${STG}/banner_grid.svg`,
  bannerLayerImg: `${STG}/portolio_layer.svg`,
  jumpImg1: `${STG}/jumping_1-1.svg`,
  jumpImg2: `${STG}/jumping_2-1.svg`,
  jumpImg3: `${STG}/jumping_3-1.svg`,
} as const;

const STARTUPS_COMPANY_TICKER = [
  "Natural Intelligence",
  "IronSource",
  "Jfrog",
  "Taboola",
  "Electreon",
  "Walkme",
] as const;

const ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${STG}/natural.png`,
    desktopImg: `${STG}/Natiral-Intelligence-Desktop.png`,
    mobileImg: `${STG}/Natiral-Intelligence-Mobile.png`,
    title:
      "Enhancing flows and user experience in Natural Intelligence platforms. Refining and improving the ux and ui across their products.",
    description:
      "We focused on improving decision-making flows, visual clarity, and responsiveness across devices. Working on websites and platforms, in order to achieve a smoother, more trustworthy experience that boosted user confidence and engagement.",
    tags: ["StartupProduct", "ProductResearch", "Platforms"],
  },
  {
    logo: `${STG}/ironsource-min.png`,
    desktopImg: `${STG}/Iron-Source-Desktop.png`,
    mobileImg: `${STG}/Iron-Source-Mobile.png`,
    title:
      "ironSource partnered with us to elevate the UX of their monetization platform and align multiple products under one cohesive design system.",
    description:
      "Working to design complex workflows for advertisers and publishers, creating a cleaner, more intuitive experience. Our unified design approach improved usability, strengthened brand consistency, and laid the groundwork for future growth under Unity’s expanding ecosystem.",
    tags: ["Ecosystem", "Workflow", "UserDesign"],
  },
  {
    logo: `${STG}/jfrog-min.png`,
    desktopImg: `${STG}/Jfrog-desktop-1.png`,
    mobileImg: `${STG}/Jfrog-mobile-1.png`,
    title: "Creating a CEO dashboard for quick, clear insights—enabling smarter, faster decisions.",
    description:
      "We designed a streamlined CEO dashboard focused on high-level performance insights, giving executives a clear, real-time view of key business metrics. With smart data visualizations, customizable reports, and intuitive navigation, the dashboard supports quick, informed decision-making at a glance.",
    tags: ["CEODashboard", "DataAnlytics", "PerformanceInshights"],
  },
  {
    logo: `${STG}/taboola-min.png`,
    desktopImg: `${STG}/Taboola-desktop-2.png`,
    mobileImg: `${STG}/Taboola-mobile-2.png`,
    title:
      "A collaboration with Taboola  to redesign key parts of their publisher and advertiser platforms, improving clarity and control at scale.",
    description:
      "Focused on data-heavy interfaces, we worked to simplify the user journey for campaign setup, analytics, and content recommendations. The updated experience delivers faster insights, easier navigation, and a more consistent design across their suite of tools.",
    tags: ["DataIntereface", "DesignTool", "UserJourney"],
  },
  {
    logo: `${STG}/electreon-min.png`,
    desktopImg: `${STG}/Electreon-Desktop.png`,
    mobileImg: `${STG}/Electreon-Mobile.png`,
    title:
      "Electreon chose us to revamp their wireless charging platform with a unified, scalable design.",
    description:
      "We collaborated with Electreon’s product and field teams to create a scalable, intuitive platform that supports operations from installation to maintenance. Our design system streamlined user flows, surfaced real-time insights, and empowered every team member—from field techs to operations managers.",
    tags: ["ProductTeam", "DesignSystem", "TechProduct"],
  },
  {
    logo: `${STG}/walkme-min.png`,
    desktopImg: `${STG}/WalkMe-Deskop.png`,
    mobileImg: `${STG}/WalkMe-Mobile.png`,
    title:
      "Enhancing the builder experience, we worked with WalkMe to make creating in-app guidance more intuitive and efficient for teams.",
    description:
      "We helped streamline the platform’s core workflows and refined the UI to better support enterprise-scale usage. The new design system improved navigation, reduced friction, and made it easier for users to create and manage guidance flows.",
    tags: ["WorkFlow", "UserFlow", "Enterprise"],
  },
];

const ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    ...ITEMS_EN[0],
    title:
      "שיפור זרימות וחוויית משתמש בפלטפורמות של Natural Intelligence. ליטוש ושדרוג חוויית המשתמש והממשק לאורך כלל מוצרי החברה.",
    description:
      "התמקדנו בשיפור זרימות קבלת ההחלטות, בהירות ויזואלית ותגובתיות במגוון מכשירים. עבדנו על אתרים ופלטפורמות במטרה ליצור חוויית שימוש חלקה ואמינה יותר, שהובילה להגברת תחושת הביטחון של המשתמשים ולשיפור המעורבות.",
  },
  {
    ...ITEMS_EN[1],
    title:
      "ironSource שיתפה איתנו פעולה לשיפור חוויית המשתמש בפלטפורמת המונטיזציה שלה, וליצירת שפה עיצובית אחידה שמחברת בין מספר מוצרים תחת מערכת עיצוב אחת מגובשת.",
    description:
      "עבדנו על עיצוב תהליכי עבודה מורכבים עבור מפרסמים ושותפים, במטרה ליצור חוויה נקייה ואינטואיטיבית יותר. הגישה העיצובית האחידה שלנו שיפרה את השימושיות, חיזקה את אחידות המותג, והניחה את הבסיס לצמיחה עתידית במסגרת המערכת המתרחבת של Unity.",
  },
  {
    ...ITEMS_EN[2],
    title:
      "יצירת לוח מחוונים למנכ״ל לקבלת תובנות מהירות וברורות – מאפשר קבלת החלטות חכמות ומהירות יותר.",
    description:
      "עיצבנו לוח מחוונים ממוקד למנכ״ל, המספק תובנות ביצועים ברמה גבוהה ומבט ברור בזמן אמת על מדדי מפתח עסקיים. בעזרת ויזואליזציות חכמות של נתונים, דוחות מותאמים אישית וניווט אינטואיטיבי – הלוח מאפשר קבלת החלטות מהירה ומבוססת נתונים במבט אחד.",
  },
  {
    ...ITEMS_EN[3],
    title:
      "שיתוף פעולה עם Taboola לעיצוב מחדש של חלקים מרכזיים בפלטפורמות המפרסמים והשותפים שלהם, במטרה לשפר את הבהירות ואת רמת השליטה – גם בהיקפים גדולים.",
    description:
      "התמקדנו בממשקים עתירי-נתונים, ופישטנו את מסלול המשתמש בהגדרת קמפיינים, ניתוח נתונים והמלצות תוכן. החוויה המעודכנת מספקת תובנות מהירות יותר, ניווט נוח יותר, ועיצוב עקבי בכל מערכת הכלים של Taboola.",
  },
  {
    ...ITEMS_EN[4],
    title:
      "Electreon בחרה בנו לעצב מחדש את פלטפורמת הטעינה האלחוטית שלה, עם שפה עיצובית אחידה ופתרון שמאפשר סקייל מהיר ויעיל.",
    description:
      "שיתפנו פעולה עם צוותי המוצר והשטח של Electreon כדי ליצור פלטפורמה אינטואיטיבית וניתנת להרחבה, שתומכת בתהליכי העבודה משלב ההתקנה ועד התחזוקה. מערכת העיצוב שפיתחנו פישטה תהליכים, הציפה תובנות בזמן אמת, והעניקה לכלל המשתמשים – מטכנאי שטח ועד מנהלי תפעול – כלים אפקטיביים ונוחים לעבודה.",
  },
  {
    ...ITEMS_EN[5],
    title:
      "שיפרנו את חוויית היוצר ועבדנו עם WalkMe כדי להפוך את יצירת ההדרכה בתוך האפליקציה לאינטואיטיבית ויעילה יותר עבור הצוותים.",
    description:
      "עזרנו לייעל את זרימות העבודה המרכזיות של הפלטפורמה ושיפרנו את הממשק כך שיתמוך טוב יותר בשימוש בקנה מידה ארגוני. מערכת העיצוב החדשה שיפרה את הניווט, צמצמה חיכוכים והקלה על המשתמשים ליצור ולנהל זרימות הדרכה.",
  },
];

const GLOBAL_LOGOS: PortfolioPageData["global"]["logos"] = [
  { img: "/assets/startups-tech/microsoft_global.svg", alt: "Microsoft" },
  { img: "/assets/startups-tech/american_express_global.svg", alt: "American Express" },
  { img: "/assets/startups-tech/n_gloabl.svg", alt: "N" },
  { img: "/assets/startups-tech/human_global.svg", alt: "Human" },
  { img: "/assets/startups-tech/passport_cart_global.svg", alt: "Passport" },
  { img: "/assets/startups-tech/jfrog_global.svg", alt: "JFrog" },
  { img: "/assets/startups-tech/alam_global.svg", alt: "Alam" },
  { img: "/assets/startups-tech/taboola_global.svg", alt: "Taboola" },
  { img: "/assets/startups-tech/is_global.svg", alt: "IS" },
  { img: "/assets/startups-tech/star_global.svg", alt: "Star" },
  { img: "/assets/startups-tech/playtika_global.svg", alt: "Playtika" },
  { img: "/assets/startups-tech/finaro_global.svg", alt: "Finaro" },
];

export const STARTUPS_TECH_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  companyTicker: [...STARTUPS_COMPANY_TICKER],
  partnerCount: "50+ Startups apps and platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "Startups & Tech",
    subtitle: "Partner with product design experts who get it.",
    description:
      "At Triolla, we speak fluent Startups & Tech — from MVPs to scalable digital solutions....",
    expandedText:
      "As startups and tech companies drive innovation, UX design is essential for turning bold ideas into products people love to use. In the fast-paced world of technology, great UX means guiding users through new features and experiences with clarity, making even complex solutions feel simple and approachable. A well-designed interface builds trust, accelerates adoption, and empowers users to get the most out of your product. By anticipating user needs and reducing friction, UX design helps startups deliver seamless, engaging, and memorable experiences. At Triolla, we specialize in designing intuitive, scalable, and user-focused products that help startups and tech companies succeed.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...STARTUPS_TECH_ASSETS,
  },
  portfolioItems: ITEMS_EN,
  why: {
    mainTitle: "Why Do startup founders choose us?",
    items: [
      {
        title: "Speed to Market",
        description: "We deliver high-quality design at startup velocity.",
      },
      {
        title: "Product-Market Fit Focus",
        description: "Design that drives user validation and adoption.",
      },
      {
        title: "Investor Appeal",
        description: "Polished product design that impresses VCs and users alike.",
      },
      {
        title: "Growth-Minded Design",
        description: "UX that scales from MVP through Series A and beyond.",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "Trusted by innovative startups and tech leaders",
    logos: GLOBAL_LOGOS,
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const STARTUPS_TECH_PAGE_DATA_HE: PortfolioPageData = {
  ...STARTUPS_TECH_PAGE_DATA_EN,
  dir: "rtl",
  companyTicker: [...STARTUPS_COMPANY_TICKER],
  partnerCount: "למעלה מ־50 אפליקציות ופלטפורמות לסטארטאפים כבר מאחורינו",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "סטארטאפים & טק",
    subtitle: "הצטרפו למומחי עיצוב מוצר שמבינים אתכם באמת.",
    description:
      "בטריאולה אנחנו דוברים סטארט-אפים וטכנולוגיה שוטף – ממוצרי MVP ועד פתרונות דיגיטליים גמישים וגדלים....",
    expandedText:
      "כשהחדשנות מובילה את עולם הסטארט-אפים והטכנולוגיה, עיצוב חוויית משתמש (UX) הוא המפתח להפיכת רעיונות נועזים למוצרים שאנשים אוהבים להשתמש בהם. בעולם הטכנולוגי המהיר, UX מצוין פירושו להוביל משתמשים בפשטות ובבהירות דרך פיצ'רים וחוויות חדשות, ולהפוך גם פתרונות מורכבים לנגישים וידידותיים. בטריאולה אנו מתמחים בעיצוב מוצרים אינטואיטיביים, גמישים וממוקדי משתמש שמסייעים לסטארט-אפים וחברות טכנולוגיה להצליח.",
    buttonText: "הצטרפו אלינו",
    buttonLink: "#contactus",
    ...STARTUPS_TECH_ASSETS,
  },
  portfolioItems: ITEMS_HE,
  why: {
    mainTitle: "למה מייסדי סטארט-אפ בוחרים בנו?",
    items: [
      {
        title: "מהירות לשוק",
        description: "אנו מספקים עיצוב איכותי במהירות שמתאימה לסטארט-אפ.",
      },
      {
        title: "מיקוד ב־product-market fit",
        description: "עיצוב שמניע אימות משתמשים ואימוץ.",
      },
      {
        title: "משיכה למשקיעים",
        description: "עיצוב מלוטש שמספק רושם גם לוונצ'ור וגם למשתמשים.",
      },
      {
        title: "עיצוב חושב צמיחה",
        description: "חוויית משתמש שמתאימה מ־MVP ועד סיבובי גיוס ומעלה.",
      },
    ],
  },
  global: {
    title: "הלקוחות שלנו",
    subtitle:
      "מחברות קטנות ועד גלובליות, שיתפנו פעולה עם כמה חברות מדהימות",
    logos: GLOBAL_LOGOS,
    buttonText: "בואו נדבר",
    buttonLink: "#contactus",
  },
};
