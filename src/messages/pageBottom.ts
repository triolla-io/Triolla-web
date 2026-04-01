import type { Locale } from "@/lib/i18n";

export const pageBottomCopy: Record<
  Locale,
  {
    chatTitle: string;
    callTitle: string;
    mailTitle: string;
    trustedTitle: string;
    scheduleTitle: string;
    mobileCallTitle: string;
    submit: string;
    placeholders: { fullName: string; phone: string; email: string };
    tlv: string;
    nySf: string;
    hq: string;
    addressLine: string;
  }
> = {
  en: {
    chatTitle: "Wanna Chat? Get In Touch",
    callTitle: "Give us a call:",
    mailTitle: "Mail:",
    trustedTitle: "Trusted by 1000+ companies:",
    scheduleTitle: "Schedule a\n Free Consultation",
    mobileCallTitle: "Give us a call:",
    submit: "Let's Go!",
    placeholders: { fullName: "Full Name", phone: "Phone", email: "Email" },
    tlv: "TLV",
    nySf: "NY & SF",
    hq: "HQ Address:",
    addressLine: "Zarchin St. 2, Ranana",
  },
  he: {
    chatTitle: "רוצים לדבר? דברו איתנו",
    callTitle: "התקשרו:",
    mailTitle: "מייל:",
    trustedTitle: "מאות חברות סומכות עלינו:",
    scheduleTitle: "קבעו\n ייעוץ חינם",
    mobileCallTitle: "התקשרו:",
    submit: "בואו נדבר!",
    placeholders: { fullName: "שם מלא", phone: "טלפון", email: "אימייל" },
    tlv: "ת״א",
    nySf: "ניו יורק וסן פרנסיסקו",
    hq: "כתובת מטה:",
    addressLine: "זרחין 2, רעננה",
  },
};
