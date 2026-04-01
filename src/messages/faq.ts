import type { Locale } from "@/lib/i18n";

export type FaqItem = {
  img: string;
  q: string;
  a: string;
};

const imgs = [
  "/images/faq_q1.png",
  "/images/faq_q2.png",
  "/images/faq_q3.png",
  "/images/faq_q4.png",
  "/images/faq_q5.png",
  "/images/faq_q6.png",
  "/images/faq_q7.png",
  "/images/aivatar_cir_32.png",
  "/images/aivatar_cir_05.png",
] as const;

const enFaqs: Omit<FaqItem, "img">[] = [
  {
    q: "How much does UX/UI design cost?",
    a: "The cost varies depending on the project scope, interface complexity, number of screens, and unique requirements. Usually, a professional studio will provide a custom quote after an initial assessment. At Triolla, average UX Design varies from $15K-$40K",
  },
  {
    q: "How long does the UX/UI design process take?",
    a: "The duration depends on the project scope, number of screens, and complexity. Typically, UX/UI design for a complex platform or app takes from 6 weeks to 3-4 months. Proper planning, client collaboration, and timely provision of materials speed up the process and ensure a high-quality result.",
  },
  {
    q: "What does the workflow with a UX/UI studio include?",
    a: "The workflow with a UX/UI Triolla studio begins with an introductory meeting to understand the business and user needs. Next comes user experience research, concept design, interface design, prototyping, and usability testing. Triolla supports the client all the way through to delivering development-ready files, maintaining full collaboration throughout the process.",
  },
  {
    q: "What's the difference between UX design and UI design?",
    a: "UX design focuses on the user's journey, system structure, and flow. UI (User Interface) design deals with the visual appearance of the interface—colors, typography, icons, and graphic elements. The right combination of UX and UI creates a product that is convenient, clear, and visually appealing.",
  },
  {
    q: "What are the main stages in a UX/UI design project?",
    a: "At Triolla, the main stages are: research and discovery, wireframing, concept design, interface (UI) design, building an interactive prototype, usability testing, revisions and improvements, and preparing files for development. Each stage is carried out in collaboration with the client, focusing on business and user goals.",
  },
  {
    q: "What does the user research process look like in a UX project?",
    a: "User research is a pivotal stage at any process of product design in Triolla. It includes target audience analysis, persona definition, mapping user journeys, and understanding user needs and pain points. This stage is critical for creating an accurate and tailored user experience and forms the basis for all design and development processes.",
  },
  {
    q: "Do you work with startups, large companies, and small businesses?",
    a: "Yes, Triolla has extensive experience working with all types of clients—startups, large companies, and small businesses. Each client receives a personalized workflow according to their needs, budget, and business goals, while maintaining a high level of professionalism.",
  },
  {
    q: "Can I see examples of your previous projects?",
    a: "Absolutely! A diverse portfolio is an integral part of the selection process. You can review examples of products design, and systems designed by the Triolla studio to get a sense of their style, finish level, and ability to handle various challenges.",
  },
  {
    q: "Do you support the development process or only the design?",
    a: "At Triolla we can take you from concept design to a full product launch. We have a very strong software engineering division that can develops almost all platforms & apps. We support technologies: React, NextJs, Vue, Node.Js and React native. We ensures that the design vision is fully realized and that the final product meets the highest standards.",
  },
];

const heFaqs: Omit<FaqItem, "img">[] = [
  {
    q: "כמה עולה עיצוב UX/UI?",
    a: "העלות משתנה לפי היקף הפרויקט, מורכבות הממשק, מספר המסכים ודרישות ייחודיות. בדרך כלל סטודיו מקצועי ייתן הצעת מחיר אחרי הערכה ראשונית. בטריולה, עיצוב UX ממוצע נע בין 15K$ ל־40K$.",
  },
  {
    q: "כמה זמן נמשך תהליך עיצוב UX/UI?",
    a: "המשך התלוי בהיקף, במספר המסכים ובמורכבות. בדרך כלל עיצוב UX/UI לפלטפורמה או אפליקציה מורכבת לוקח בין 6 שבועות ל־3–4 חודשים. תכנון נכון ושיתוף פעולה עם הלקוח מזרזים את התהליך.",
  },
  {
    q: "מה כלול בשיתוף הפעולה עם סטודיו ל־UX/UI?",
    a: "התהליך מתחיל בפגישת היכרות להבנת הצרכים העסקיים והמשתמש. לאחר מכן מחקר חוויית משתמש, עיצוב קונספט, עיצוב ממשק, אבות טיפוס ובדיקות שימושיות. טריולה מלווה עד למסירת קבצים מוכנים לפיתוח.",
  },
  {
    q: "מה ההבדל בין UX ל־UI?",
    a: "UX מתמקד במסע המשתמש, במבנה ובזרימה. UI עוסק במראה החזותי—צבעים, טיפוגרפיה ואייקונים. השילוב הנכון יוצר מוצר נוח, ברור ומושך.",
  },
  {
    q: "מהם השלבים העיקריים בפרויקט UX/UI?",
    a: "בטריולה: מחקר וגילוי, wireframes, עיצוב קונספט, עיצוב ממשק, אב טיפוס אינטראקטיבי, בדיקות שימושיות, שיפורים והכנת קבצים לפיתוח—בשיתוף מתמיד עם הלקוח.",
  },
  {
    q: "איך נראה מחקר משתמשים בפרויקט UX?",
    a: "מחקר משתמשים הוא שלב מרכזי. הוא כולל ניתוח קהל יעד, פרסונות, מיפוי מסעות והבנת צרכים וכאבים—הבסיס לכל תהליכי העיצוב והפיתוח.",
  },
  {
    q: "האם אתם עובדים עם סטארטאפים וחברות גדולות?",
    a: "כן. לטריולה ניסיון רחב עם סטארטאפים, חברות גדולות ועסקים קטנים. לכל לקוח תהליך מותאם לפי צרכים, תקציב ומטרות.",
  },
  {
    q: "האם אפשר לראות דוגמאות לפרויקטים קודמים?",
    a: "בהחלט. תיק עבודות מגוון הוא חלק מרכזי בתהליך הבחירה. אפשר לעיין במוצרים שעיצבנו כדי להבין את הסגנון ורמת הגימור.",
  },
  {
    q: "האם אתם תומכים גם בפיתוח או רק בעיצוב?",
    a: "בטריולה אפשר ללוות מקונספט ועד השקה מלאה. יש לנו חטיבת הנדסת תוכנה חזקה לפיתוח פלטפורמות ואפליקציות—React, Next.js, Vue, Node.js ו־React Native.",
  },
];

function zipImages(items: Omit<FaqItem, "img">[]): FaqItem[] {
  return items.map((item, i) => ({ ...item, img: imgs[i] ?? imgs[0] }));
}

export const faqByLocale: Record<Locale, FaqItem[]> = {
  en: zipImages(enFaqs),
  he: zipImages(heFaqs),
};

export const faqSectionCopy: Record<Locale, { title: string; subtitle: string }> = {
  en: {
    title: "People Asked us",
    subtitle: "We've gathered some common Q&A to make things easier and save you time",
  },
  he: {
    title: "שאלות נפוצות",
    subtitle: "אספנו תשובות לשאלות נפוצות כדי לחסוך לכם זמן",
  },
};
