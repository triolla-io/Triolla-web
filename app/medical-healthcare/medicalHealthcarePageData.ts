import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

const H = "/assets/medical-healthcare";

const ASSETS = {
  bannerGridImg: `${H}/banner_grid.svg`,
  bannerLayerImg: `${H}/portolio_layer.svg`,
  jumpImg1: `${H}/jumping_1-1.svg`,
  jumpImg2: `${H}/jumping_2-1.svg`,
  jumpImg3: `${H}/jumping_3-1.svg`,
} as const;

const MEDICAL_COMPANY_TICKER = [
  "MeverickAI",
  "InHouse. Health",
  "DigitalOwl",
  "Elastimed",
  "Anima biotech",
  "Trialog",
  "Kaizen",
  "Medwise App",
  "Human - X",
  "AFC industries",
  "Evogene",
  "Ichilov Hospital",
  "Soroka Hospital",
  "Soroka",
  "One Step",
  "Neuralight",
  "Clewmed",
  "Edwards",
  "Optio",
  "Binah",
  "Calmigo",
  "Muscle & motion",
  "Arkit",
  "Vetpet",
  "Alma",
] as const;

const ITEMS_EN: PortfolioPageData["portfolioItems"] = [
  {
    logo: `${H}/ichilov-min.png`,
    desktopImg: `${H}/Ichilov-image-desktop.png`,
    mobileImg: `${H}/Ichilov-mobile.png`,
    title: "Powering Informed Decisions for Hospital Leaders - Real time control room",
    description:
      "Ichilov Hospital partnered with us to design and build an advanced control room for hospital leadership, enabling real-time visibility across the hospital and empowering better, faster decision-making.",
    tags: ["ProductLeaders", "Medtech", "Controlroom", "UXUI"],
  },
  {
    logo: `${H}/Sweetch-min.png`,
    desktopImg: `${H}/Sweetch-image-desktop.png`,
    mobileImg: `${H}/Sweetch-mobile.png`,
    title: "Redesigning Wellness  Experiences for Greater  Daily Impact",
    description:
      "Sweetch blends behavioral science with innovative technology to provide personalized, real-time health interventions that increase engagement and deliver results. They partnered with us to redesign their app, making it easier for users to stay engaged and active every day.",
    tags: ["AppsDesign", "ProductDesign", "ProductResearch", "Personalization"],
  },
  {
    logo: `${H}/edwards-min.png`,
    desktopImg: `${H}/Edwards-image-desktop.png`,
    mobileImg: `${H}/Edwards-mobile.png`,
    title: "Real-Time Heart Monitoring,  Smarter Decisions",
    description:
      "We partnered with Edwards Lifesciences to help innovate a new product that uses advanced sensors to monitor heart conditions in real time—enabling cardiologists to make informed decisions instantly, based on live data.",
    tags: ["UXUIDesign", "ProductLaunch", "MedtechProduct", "UserInterface"],
  },
  {
    logo: `${H}/elasitmed-min.png`,
    desktopImg: `${H}/Elasitmed-image-desktop.png`,
    mobileImg: `${H}/Elastimed-mobile.png`,
    title: "Enhancing Compression Therapy with Connected Guidance",
    description:
      "We designed a new IoT App for ElastiMed’s smart compression sock. The app guides users on proper use and offers real-time feedback to maximize results.",
    tags: ["AppUX", "AppUI", "IoTforMedical", "DigitalDesign"],
  },
  {
    logo: `${H}/twist-min.png`,
    desktopImg: `${H}/Twist-image-desktop.png`,
    mobileImg: `${H}/Twist-mobile.png`,
    title: "Pioneering Synthetic DNA with Twist Bioscience – Accelerating innovation",
    description:
      "Twist Bioscience partnered with us to redesign their cutting-edge silicon platform, enabling high-precision, scalable DNA synthesis and driving advancements in research, diagnostics, and therapeutics.",
    tags: ["PlatformProduct", "Redesign", "DataAnalytics", "Medical"],
  },
  {
    logo: `${H}/digitalowl-min.png`,
    desktopImg: `${H}/Digitalowl-image-desktop-1.png`,
    mobileImg: `${H}/Digitalowl-mobile.png`,
    title:
      "Transforming Medical Data with DigitalOwl – Delivering precision and efficiency through advanced technology",
    description:
      "DigitalOwl partnered with Triolla to redesign their entire platform, making it easier for companies to search and gain insights from patients’ extensive medical histories—helping them make better, data-driven decisions.",
    tags: ["PlatformDesign", "MedicalProducts", "UX", "UI", "Design"],
  },
  {
    logo: `${H}/soroka-min.png`,
    desktopImg: `${H}/Soroka-image-desktop.png`,
    mobileImg: `${H}/Soroka-mobile.png`,
    title: "Leading Healthcare Innovation in Israel's South – Soroka Medical Center",
    description:
      "We partnered with Soroka Medical Center to revolutionize their healthcare management systems. By implementing advanced data solutions and optimizing workflows, we enhanced patient care, streamlined administrative processes, and empowered their medical teams to focus on delivering exceptional health outcomes for the Negev community.",
    tags: ["DesignSystem", "UserExperience", "UserJourney", "Medical"],
  },
];

const ITEMS_HE: PortfolioPageData["portfolioItems"] = [
  {
    ...ITEMS_EN[0],
    title: "חדר בקרה בזמן אמת שמעניק למנהלי בתי חולים שליטה ותובנות בזמן אמת",
    description:
      "בית החולים איכילוב חבר אלינו לעיצוב ופיתוח חדר בקרה מתקדם עבור הנהלת בית החולים – המעניק תמונת מצב בזמן אמת על כלל המתרחש ומאפשר קבלת החלטות חכמות ומהירות יותר.",
  },
  {
    ...ITEMS_EN[1],
    title: "מחדשים את חוויות הבריאות – כדי ליצור שינוי יומיומי אמיתי",
    description:
      "Sweetch משלבת בין מדעי ההתנהגות לטכנולוגיה חדשנית כדי לספק התערבויות בריאות מותאמות אישית ובזמן אמת – שמגבירות מעורבות ומובילות לתוצאות. הם חברו אלינו לעיצוב מחדש של האפליקציה שלהם, כדי להקל על המשתמשים להישאר פעילים ומחוברים – בכל יום מחדש.",
  },
  {
    ...ITEMS_EN[2],
    title: "ניטור לב בזמן אמת – לקבל החלטות חכמות בדיוק כשזה נדרש",
    description:
      "חברנו ל-Edwards Lifesciences כדי לחדש יחד מוצר פורץ דרך המבוסס על חיישנים מתקדמים לניטור מצבי לב בזמן אמת – מה שמאפשר לקרדיולוגים לקבל החלטות מושכלות באופן מיידי, בהתבסס על נתונים חיים.",
  },
  {
    ...ITEMS_EN[3],
    title: "מהפכה בטיפול הדחיסה – עם הדרכה חכמה בזמן אמת",
    description:
      "עיצבנו אפליקציית IoT חדשה לגרב הדחיסה החכם של ElastiMed. האפליקציה מנחה את המשתמשים לשימוש נכון ומספקת פידבק בזמן אמת – למקסום התוצאות.",
  },
  {
    ...ITEMS_EN[4],
    title: "פורצים דרך ב-DNA סינתטי עם Twist Bioscience – מאיצים חדשנות",
    description:
      "Twist Bioscience חברו אלינו לעיצוב מחדש של הפלטפורמה החדשנית שלהם המבוססת סיליקון – מהלך שאיפשר סינתזת DNA מדויקת וסקיילבילית, והניע קדימה את תחומי המחקר, האבחון והטיפול הרפואי.",
  },
  {
    ...ITEMS_EN[5],
    title: "מהפכה בנתוני הרפואה עם DigitalOwl – דיוק ויעילות בעזרת טכנולוגיה מתקדמת",
    description:
      "DigitalOwl חברו ל-Triolla לעיצוב מחדש כולל של הפלטפורמה שלהם, במטרה להקל על חברות לאתר ולהפיק תובנות מתוך היסטוריית מידע רפואי מקיפה של מטופלים – ולסייע בקבלת החלטות טובות ומבוססות נתונים.",
  },
  {
    ...ITEMS_EN[6],
    title: "מובילים חדשנות רפואית בדרום הארץ – המרכז הרפואי סורוקה",
    description:
      "חברנו למרכז הרפואי סורוקה כדי לחולל מהפכה במערכות ניהול הבריאות שלהם. באמצעות יישום פתרונות מידע מתקדמים ואופטימיזציה של תהליכי עבודה, שיפרנו את הטיפול הרפואי, ייעלנו את הפעילות המנהלית – והעצמנו את הצוותים הרפואיים להתמקד במתן תוצאות בריאות יוצאות דופן עבור קהילת הנגב.",
  },
];

const LOGOS: PortfolioPageData["global"]["logos"] = [
  { img: "/assets/_shared/microsoft_global.svg", alt: "Microsoft" },
  { img: "/assets/_shared/american_express_global.svg", alt: "American Express" },
  { img: "/assets/_shared/n_gloabl.svg", alt: "N" },
  { img: "/assets/_shared/human_global.svg", alt: "Human" },
  { img: "/assets/_shared/passport_cart_global.svg", alt: "Passport" },
  { img: "/assets/_shared/jfrog_global.svg", alt: "JFrog" },
  { img: "/assets/_shared/alam_global.svg", alt: "Alam" },
  { img: "/assets/_shared/taboola_global.svg", alt: "Taboola" },
  { img: "/assets/_shared/is_global.svg", alt: "IS" },
  { img: "/assets/_shared/star_global.svg", alt: "Star" },
  { img: "/assets/_shared/playtika_global.svg", alt: "Playtika" },
  { img: "/assets/_shared/finaro_global.svg", alt: "Finaro" },
];

export const MEDICAL_HEALTHCARE_PAGE_DATA_EN: PortfolioPageData = {
  dir: "ltr",
  bannerColor: "#fed125",
  companyTicker: [...MEDICAL_COMPANY_TICKER],
  partnerCount: "50+ Medical Healthcare platforms and counting",
  header: {
    eyebrow: "Product design for",
    title: "Digital Health",
    subtitle: "Team up with product design pros.",
    description:
      "Triolla’s approach to Medical & Healthcare unites experience and innovation....",
    expandedText:
      "We design clear and accessible interfaces that support patient care and streamline complex medical workflows in the healthcare sector. Our product design process prioritizes usability, regulatory compliance, and seamless integration with healthcare systems to ensure safe and effective user experiences. With Triolla, your medical and healthcare solutions benefit from design expertise that improves outcomes, builds trust, and empowers both patients and professionals.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: ITEMS_EN,
  why: {
    mainTitle: "Why Do healthcare companies choose us?",
    items: [
      {
        title: "Healthcare Expertise",
        description: "Deep understanding of HIPAA compliance and healthcare workflows.",
      },
      {
        title: "Patient-Centered Design",
        description: "We design with patient needs and accessibility at the core.",
      },
      {
        title: "Provider Efficiency",
        description: "Our UX reduces cognitive load and streamlines medical workflows.",
      },
      {
        title: "Regulatory Compliance",
        description: "We navigate complex healthcare regulations with precision.",
      },
    ],
  },
  global: {
    title: "Our Clients",
    subtitle: "Trusted by leading healthcare organizations",
    logos: LOGOS,
    buttonText: "Let's Talk",
    buttonLink: "#contactus",
  },
};

export const MEDICAL_HEALTHCARE_PAGE_DATA_HE: PortfolioPageData = {
  ...MEDICAL_HEALTHCARE_PAGE_DATA_EN,
  dir: "rtl",
  companyTicker: [...MEDICAL_COMPANY_TICKER],
  partnerCount: "מעל 50 פלטפורמות מדיקל, והן ממשיכות להגיע",
  header: {
    eyebrow: "עיצוב מוצר עבור",
    title: "בריאות ורפואה",
    subtitle: "שתפו פעולה עם מומחי עיצוב מוצר שמבינים אתכם.",
    description:
      "בטריאולה משלבים ניסיון רפואי עם חדשנות טכנולוגית – לטובת עולם הבריאות של המחר....",
    expandedText:
      "אנחנו מעצבים ממשקים ברורים ונגישים שתומכים בטיפול רפואי ומייעלים תהליכים רפואיים מורכבים במערכות הבריאות. תהליך עיצוב המוצרים שלנו שם דגש על שימושיות, עמידה בתקנות רגולציה ושילוב חלק עם מערכות רפואיות – כדי להבטיח חוויית משתמש בטוחה, יעילה ואפקטיבית. עם Triolla, פתרונות הבריאות והרפואה שלך נהנים ממומחיות עיצוב שמשפרת תוצאות, בונה אמון, ומעצימה גם מטופלים וגם אנשי מקצוע.",
    buttonText: "בואו נבנה יחד",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: ITEMS_HE,
  why: {
    mainTitle: "למה חברות בריאות בוחרות בנו?",
    items: [
      {
        title: "מומחיות בריאות",
        description: "היכרות עם ציות רגולטורי ותהליכי עבודה קליניים.",
      },
      {
        title: "עיצוב ממוקד מטופל",
        description: "צרכי מטופל ונגישות במרכז.",
      },
      {
        title: "יעילות ספק",
        description: "הפחתת עומס קוגניטיבי וייעול זרימות רפואיות.",
      },
      {
        title: "ציות רגולטורי",
        description: "ניווט מדויק ברגולציית בריאות מורכבת.",
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
