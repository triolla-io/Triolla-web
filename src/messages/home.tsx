import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

export type HomeMessages = {
  heroEyebrow: string;
  heroH1Line1: string;
  heroH1Line2: string;
  heroSub: string;
  whyTitle: string;
  whySub: string;
  whyCards: { title: string; text: string }[];
  winnersTitle: string;
  winnersSubtitle: string;
  winnerBoxes: { title: string }[];
  designSteps: string[];
  designTitle: ReactNode;
  designDescription: string;
};

export const home: Record<Locale, HomeMessages> = {
  en: {
    heroEyebrow: "Product UX/UI design for",
    heroH1Line1: "Creative Design Attracts People.",
    heroH1Line2: "Smart UX Makes Them Stay",
    heroSub:
      "Product Design for Tech, Gaming, Medical, Cyber, IoT, Agritech, Mobile, SaaS Platforms & Startups",
    whyTitle: "Why startups\n and global high-tech partner with us...",
    whySub:
      "Thanks to our exceptionally talented & experienced product designers, we provide customized UX/UI and product design services to most industries: Fintech, Cyber, Medical, Agro & Gaming.",
    whyCards: [
      { title: "Design a new product", text: "Design and develop an industry-leading product" },
      { title: "Improve an existing product", text: "Upgrade and redesign your product to become a category leader" },
      { title: "First Steps for Start-ups", text: "Take your vision from concept to launch" },
      { title: "Product consulting", text: "Accelerate your strategic planning process" },
    ],
    winnersTitle: "Global winners in Product UX/UI Design 2025",
    winnersSubtitle: "Triolla has stood out among the industry's biggest players",
    winnerBoxes: [
      { title: "#1\nHealth &\nMedical UX/UI" },
      { title: "#1\nCyber Security\nUX/UI" },
      { title: "#2\nFintech\nUX/UI" },
    ],
    designSteps: [
      "Kickoff\nMeeting",
      "Research &\nCompetitive\nanalysis",
      "User\ninterviews",
      "Brainstorming\nIdeate phase\nBuild use case\n+ Flow",
      "Detailed\nWireframes",
      "User\nTesting",
      "Concepts\nDesign",
      "Detailed\nDesign",
    ],
    designTitle: (
      <>
        Our unique <span>Design</span> Process
      </>
    ),
    designDescription:
      "Our unique design process blends deep user insight with creative strategy to craft digital experiences that truly stand out.",
  },
  he: {
    heroEyebrow: "עיצוב UX/UI למוצר עבור",
    heroH1Line1: "עיצוב יצירתי מושך אנשים.",
    heroH1Line2: "חוויית משתמש חכמה גורמת להם להישאר",
    heroSub:
      "עיצוב מוצר לטק, גיימינג, רפואה, סייבר, IoT, אגריטק, מובייל, פלטפורמות SaaS וסטארטאפים",
    whyTitle: "למה סטארטאפים\n וחברות הייטק גלובליות בוחרים בנו...",
    whySub:
      "בזכות מעצבי המוצר המוכשרים והמנוסים שלנו, אנחנו מספקים שירותי UX/UI ועיצוב מוצר מותאמים אישית למרבית התעשיות: פינטק, סייבר, רפואה, אגרו וגיימינג.",
    whyCards: [
      { title: "לעצב מוצר חדש", text: "לעצב ולפתח מוצר מוביל בתעשייה" },
      { title: "לשפר מוצר קיים", text: "לשדרג ולעצב מחדש את המוצר שלכם כדי להפוך למוביל קטגוריה" },
      { title: "צעדים ראשונים לסטארטאפים", text: "מהחזון ועד השקה" },
      { title: "ייעוץ מוצר", text: "להאיץ את תהליך התכנון האסטרטגי" },
    ],
    winnersTitle: "זוכים גלובליים בעיצוב UX/UI למוצר 2025",
    winnersSubtitle: "טריולה בלטה בין השחקנים הגדולים בתעשייה",
    winnerBoxes: [
      { title: "#1\nבריאות ו\nרפואה UX/UI" },
      { title: "#1\nסייבר\nUX/UI" },
      { title: "#2\nפינטק\nUX/UI" },
    ],
    designSteps: [
      "פגישת\nהתנעה",
      "מחקר ו\nניתוח\nתחרות",
      "ראיונות\nמשתמשים",
      "סיעור מוחין\nאפיון\nתרחישי שימוש\n+ זרימה",
      "Wireframes\nמפורטים",
      "בדיקות\nמשתמשים",
      "קונספטים\nעיצוב",
      "עיצוב\nמפורט",
    ],
    designTitle: (
      <>
        תהליך ה<span>עיצוב</span> הייחודי שלנו
      </>
    ),
    designDescription:
      "תהליך העיצוב הייחודי שלנו משלב תובנות משתמש עמוקות עם אסטרטגיה יצירתית כדי ליצור חוויות דיגיטליות שבאמת בולטות.",
  },
};
