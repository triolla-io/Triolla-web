import type { Locale } from "@/lib/i18n";

export const contactSectionCopy: Record<
  Locale,
  {
    title: string;
    callUs: string;
    email: string;
    tlv: string;
    office: string;
    trusted: string;
  }
> = {
  en: {
    title: "Let's create something great",
    callUs: "Call Us",
    email: "Email",
    tlv: "TLV",
    office: "Office: Raanana, Zarchin 2 - 6th floor",
    trusted: "Trusted by leading companies",
  },
  he: {
    title: "בואו ניצור משהו גדול יחד",
    callUs: "התקשרו",
    email: "אימייל",
    tlv: "ת״א",
    office: "משרד: רעננה, זרחין 2 — קומה 6",
    trusted: "חברות מובילות סומכות עלינו",
  },
};

export const contactFormCopy: Record<
  Locale,
  {
    heading: string;
    thanks: string;
    iNeed: string;
    projectTypes: string[];
    fullName: string;
    email: string;
    phone: string;
    company: string;
    send: string;
    sending: string;
  }
> = {
  en: {
    heading: "Let's Talk",
    thanks: "Thanks! We'll be in touch soon.",
    iNeed: "I need",
    projectTypes: ["UX/UI Design", "Development", "Branding"],
    fullName: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    company: "Company",
    send: "Send",
    sending: "Sending...",
  },
  he: {
    heading: "בואו נדבר",
    thanks: "תודה! נחזור אליכם בקרוב.",
    iNeed: "אני צריך/ה",
    projectTypes: ["עיצוב UX/UI", "פיתוח", "מיתוג"],
    fullName: "שם מלא",
    email: "כתובת אימייל",
    phone: "טלפון",
    company: "חברה",
    send: "שליחה",
    sending: "שולחים...",
  },
};
