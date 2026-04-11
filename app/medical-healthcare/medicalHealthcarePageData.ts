import type { PortfolioPageData } from "../components/PortfolioPageWithCSS";

/** Portfolio imagery lives in `public/images/` (per-slug `public/assets/medical-healthcare/` is not shipped). */
const H = "/images";

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
    mobileImg: `${H}/Edwards-image-mobile.png`,
    title: "Real-Time Heart Monitoring,  Smarter Decisions",
    description:
      "We partnered with Edwards Lifesciences to help innovate a new product that uses advanced sensors to monitor heart conditions in real time—enabling cardiologists to make informed decisions instantly, based on live data.",
    tags: ["UXUIDesign", "ProductLaunch", "MedtechProduct", "UserInterface"],
  },
  {
    logo: `${H}/elasitmed-min.png`,
    desktopImg: `${H}/Elasitmed-image-desktop.png`,
    mobileImg: `${H}/Elasitmed-image-mobile.png`,
    title: "Enhancing Compression Therapy with Connected Guidance",
    description:
      "We designed a new IoT App for ElastiMed’s smart compression sock. The app guides users on proper use and offers real-time feedback to maximize results.",
    tags: ["AppUX", "AppUI", "IoTforMedical", "DigitalDesign"],
  },
  {
    logo: `${H}/twist-min.png`,
    desktopImg: `${H}/Twist-image-desktop.png`,
    mobileImg: `${H}/Twist-image-mobile.png`,
    title: "Pioneering Synthetic DNA with Twist Bioscience – Accelerating innovation",
    description:
      "Twist Bioscience partnered with us to redesign their cutting-edge silicon platform, enabling high-precision, scalable DNA synthesis and driving advancements in research, diagnostics, and therapeutics.",
    tags: ["PlatformProduct", "Redesign", "DataAnalytics", "Medical"],
  },
  {
    logo: `${H}/digitalowl-min.png`,
    desktopImg: `${H}/Digitalowl-image-desktop-1.png`,
    mobileImg: `${H}/Digitalowl-image-mobile.png`,
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
  { img: "/images/microsoft_global.svg", alt: "Microsoft" },
  { img: "/images/american_express_global.svg", alt: "American Express" },
  { img: "/images/n_gloabl.svg", alt: "N" },
  { img: "/images/human_global.svg", alt: "Human" },
  { img: "/images/passport_cart_global.svg", alt: "Passport" },
  { img: "/images/jfrog_global.svg", alt: "JFrog" },
  { img: "/images/alam_global.svg", alt: "Alam" },
  { img: "/images/taboola_global.svg", alt: "Taboola" },
  { img: "/images/is_global.svg", alt: "IS" },
  { img: "/images/star_global.svg", alt: "Star" },
  { img: "/images/playtika_global.svg", alt: "Playtika" },
  { img: "/images/finaro_global.svg", alt: "Finaro" },
];

const MEDICAL_WHY: PortfolioPageData["why"] = {
  mainTitle: "Why Do <br />Medical companies <br />choose us?",
  items: [
    {
      title: "We understand <br />healthcare",
      description:
        "Fluent in clinical workflows, patient needs, and regulatory standards",
    },
    {
      title: "Healthcare design expertise",
      description: "Over 70 digital solutions for medical and health organizations",
    },
    {
      title: "Ready to care from day one",
      description: "We know your environment, so we deliver meaningful results quickly",
    },
    {
      title: "High end design",
      description:
        "Our UX focuses on accessibility and empowering both patients and professionals",
    },
  ],
};

/**
 * Hebrew cards 1–3 aligned with https://triolla.io/he/בריאות-ורפואה/; H3 corrected (live wrongly said “אגריטק”).
 * Card 4 title matches EN “High end design”; live used wrong security-first wording and English body.
 */
const MEDICAL_WHY_HE: PortfolioPageData["why"] = {
  mainTitle: "למה <br />חברות בריאות <br />בוחרות בנו?",
  items: [
    {
      title: "אנחנו מדברים <br />בשפה שלך",
      description:
        "שולטים בשפה של הרפואה – מהתהליכים הקליניים ועד צרכי המטופלים והרגולציה.",
    },
    {
      title: "ניסיון שנבחן בקרב",
      description:
        "יותר מ-70 פתרונות דיגיטליים שמקדמים את עולם הבריאות והרפואה",
    },
    {
      title: "בקצב מהיום הראשון",
      description:
        "כשההיכרות עם התחום עמוקה – התוצאות מגיעות מהר ובדיוק למטרה.",
    },
    {
      title: "עיצוב ברמה הגבוהה ביותר",
      description:
        "ה-UX שלנו מתמקד בנגישות ובהעצמת מטופלים ואנשי מקצוע כאחד.",
    },
  ],
};

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
      "Triolla’s approach to Medical & Healthcare unites experience and innovation.",
    expandedText:
      "We design clear and accessible interfaces that support patient care and streamline complex medical workflows in the healthcare sector.\n\nOur product design process prioritizes usability, regulatory compliance, and seamless integration with healthcare systems to ensure safe and effective user experiences.\n\nWith Triolla, your medical and healthcare solutions benefit from design expertise that improves outcomes, builds trust, and empowers both patients and professionals.",
    buttonText: "Partner with us",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: ITEMS_EN,
  why: MEDICAL_WHY,
  global: {
    title: "Our Clients",
    subtitle: "From small to global, we have partnered with some great companies",
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
      "בטריאולה משלבים ניסיון רפואי עם חדשנות טכנולוגית – לטובת עולם הבריאות של המחר",
    expandedText:
      "אנחנו מעצבים ממשקים ברורים ונגישים שתומכים בטיפול רפואי ומייעלים תהליכים רפואיים מורכבים במערכות הבריאות.\n\nתהליך עיצוב המוצרים שלנו שם דגש על שימושיות, עמידה בתקנות רגולציה ושילוב חלק עם מערכות רפואיות – כדי להבטיח חוויית משתמש בטוחה, יעילה ואפקטיבית.\n\nעם Triolla, פתרונות הבריאות והרפואה שלך נהנים ממומחיות עיצוב שמשפרת תוצאות, בונה אמון, ומעצימה גם מטופלים וגם אנשי מקצוע.",
    buttonText: "בואו נבנה יחד",
    buttonLink: "#contactus",
    ...ASSETS,
  },
  portfolioItems: ITEMS_HE,
  why: MEDICAL_WHY_HE,
  global: {
    title: "הלקוחות שלנו",
    subtitle:
      "מחברות קטנות ועד גלובליות, שיתפנו פעולה עם כמה חברות מדהימות",
    logos: LOGOS,
    buttonText: "בואו נדבר",
    buttonLink: "#contactus",
  },
};
