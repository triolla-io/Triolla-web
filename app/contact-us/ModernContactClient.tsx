"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import type { TriollaLangProps } from "../lib/triollaLangProps";

const COPY = {
  en: {
    thanks: "Thanks! We'll be in touch soon.",
    sending: "Sending...",
    send: "Send",
    interested: "I'm interested in...",
    interestOpts: ["UX/ UI Design", "Development", "Career"] as const,
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: false },
      { name: "phone", label: "Phone", type: "tel", required: true },
      { name: "email", label: "Email", type: "email", required: true },
    ] as const,
    heading: "Let's Talk About Your Project",
    hqLabel: "HQ:",
    hqLines: ["Raanana, Zarchin 2 - 6 floor"],
    officesLabel: "Offices:",
    mailSubjectPrefix: "Contact from",
    mailBodyLabels: { name: "Name", email: "Email", phone: "Phone", company: "Company" },
  },
  he: {
    thanks: "תודה! נחזור אליכם בקרוב.",
    sending: "שולחים...",
    send: "שליחה",
    interested: "אנחנו מתעניינים ב...",
    interestOpts: ["עיצוב UX/UI", "פיתוח", "קריירה"] as const,
    fields: [
      { name: "name", label: "שם מלא", type: "text", required: true },
      { name: "company", label: "חברה", type: "text", required: false },
      { name: "phone", label: "טלפון", type: "tel", required: true },
      { name: "email", label: "אימייל", type: "email", required: true },
    ] as const,
    heading: "בואו נדבר על הפרויקט שלכם",
    hqLabel: "משרד ראשי:",
    hqLines: ["רעננה, זרחין 2, קומה 6"],
    officesLabel: "טלפון:",
    mailSubjectPrefix: "פנייה מאת",
    mailBodyLabels: { name: "שם", email: "אימייל", phone: "טלפון", company: "חברה" },
  },
} as const;

function ContactForm({ lang }: { lang: "en" | "he" }) {
  const t = COPY[lang];
  const rtl = lang === "he";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<Record<string, boolean>>({});

  const handleFocus = (name: string) => setActive((p) => ({ ...p, [name]: true }));
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.target.value) setActive((p) => ({ ...p, [e.target.name]: false }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    try {
      const res = await fetch("https://formspree.io/f/xpwzbrvy", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setSubmitted(true);
      else throw new Error("Failed");
    } catch {
      const subject = encodeURIComponent(`${t.mailSubjectPrefix} ${data.name ?? ""}`);
      const body = encodeURIComponent(
        `${t.mailBodyLabels.name}: ${data.name}\n${t.mailBodyLabels.email}: ${data.email}\n${t.mailBodyLabels.phone}: ${data.phone || "—"}\n${t.mailBodyLabels.company}: ${data.company || "—"}`,
      );
      window.location.href = `mailto:studio@triolla.io?subject=${subject}&body=${body}`;
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-[20px] font-semibold text-[#FED125] py-8 text-center">{t.thanks}</p>
    );
  }

  const inputClass =
    "block w-full bg-transparent border-0 border-b border-white/35 text-white py-3 text-[18px] min-[480px]:text-[20px] focus:outline-none focus:border-white/70 transition-colors" +
    (rtl ? " text-end" : "");
  const labelClass =
    "absolute top-[10px] start-0 text-[20px] text-white transition-all duration-300 pointer-events-none";
  const activeLabelClass = "!top-[-10px] !text-[14px] opacity-100";

  return (
    <form onSubmit={handleSubmit} dir={lang === "he" ? "rtl" : "ltr"}>
      {t.fields.map((f) => (
        <div key={f.name} className="relative mb-5">
          <label
            htmlFor={`contact_${f.name}`}
            className={`${labelClass} ${active[f.name] ? activeLabelClass : ""}`}
          >
            {f.label}
          </label>
          <input
            id={`contact_${f.name}`}
            name={f.name}
            type={f.type}
            required={f.required}
            className={inputClass}
            onFocus={() => handleFocus(f.name)}
            onBlur={handleBlur}
          />
        </div>
      ))}

      <div className="mt-[30px] mb-10 min-[480px]:mb-[62px]">
        <p className="text-[18px] min-[480px]:text-[20px] text-white mb-4">{t.interested}</p>
        <div
          className={`flex flex-wrap gap-2 min-[480px]:gap-3 ${rtl ? "justify-center min-[480px]:justify-start" : ""}`}
        >
          {t.interestOpts.map((opt, i) => (
            <label
              key={opt}
              className="relative flex min-w-0 max-w-full items-center justify-center px-4 py-2 min-[480px]:px-5 border border-white/35 rounded-full cursor-pointer text-[14px] min-[480px]:text-[16px] font-medium text-white text-center leading-snug hover:border-white transition-colors has-[:checked]:bg-[#FED125] has-[:checked]:text-black has-[:checked]:border-[#FED125]"
            >
              <input
                type="radio"
                name="interested_in"
                value={opt}
                className="sr-only"
                defaultChecked={i === 0}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <a
        onClick={(e) => {
          e.preventDefault();
          (e.currentTarget.closest("form") as HTMLFormElement)?.requestSubmit();
        }}
        href="#"
        className="pill-btn block w-full text-center py-[10px] text-[20px] font-bold text-black bg-[#FED125] border-[#FED125]"
      >
        <span className="default-text">{loading ? t.sending : t.send}</span>
        <span className="hover-text text-white">{loading ? t.sending : t.send}</span>
        <span className="btn-overlay" style={{ background: "#000" }} />
      </a>
    </form>
  );
}

export function ModernContactClient({ lang = "en" }: TriollaLangProps) {
  const t = COPY[lang === "he" ? "he" : "en"];
  const dir = lang === "he" ? "rtl" : "ltr";
  const isHe = lang === "he";

  return (
    <section
      dir={dir}
      lang={isHe ? "he" : "en"}
      className="relative w-full overflow-hidden pb-16 sm:pb-28 lg:pb-[201px] pt-[calc(8.75rem+env(safe-area-inset-top,0px))] min-[640px]:pt-[180px] lg:pt-[262px]"
      style={{ background: "#FED125" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Image
          src="/images/banner_grid.svg"
          alt=""
          fill
          className="object-cover object-top opacity-60"
          priority
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/portolio_layer.svg"
          alt=""
          className={`pointer-events-none absolute top-0 end-0 h-full w-auto opacity-30 max-[480px]:max-h-[50%] max-[480px]:w-auto max-[480px]:opacity-[0.14] ${isHe ? "max-[480px]:hidden" : ""}`}
        />
      </div>

      <div className="relative mx-auto max-w-[1458px] px-5 sm:px-[41px]">
        <div className="flex flex-col lg:flex-row gap-y-10 lg:gap-y-0">
          <div className="relative w-full lg:w-[calc(100%-532px)] pt-0 lg:pt-[100px] lg:pe-[50px] lg:ps-0">
            <motion.div
              className="absolute z-[2] hidden lg:block"
              style={{ left: 50, top: -80 }}
              animate={{ x: [0, -40, 12, 0], y: [0, -10, -20, 0] }}
              transition={{ duration: 6, ease: [0.19, 1, 0.22, 1], repeat: Infinity }}
            >
              <Image src="/images/jumping_1-1.svg" alt="" width={120} height={120} />
            </motion.div>

            <motion.div
              className="absolute z-[2] hidden lg:block"
              style={{ right: 0, top: -50 }}
              animate={{ x: [0, 16, 32, 0], y: [0, 30, -12, 0] }}
              transition={{ duration: 8, ease: [0.19, 1, 0.22, 1], repeat: Infinity }}
            >
              <Image src="/images/jumping_2-1.svg" alt="" width={120} height={120} />
            </motion.div>

            <motion.div
              className="absolute z-[2] hidden lg:block"
              style={{ right: 170, bottom: 75 }}
              animate={{ x: [0, -40, 12, 0], y: [0, -10, -20, 0] }}
              transition={{ duration: 7, ease: [0.19, 1, 0.22, 1], repeat: Infinity }}
            >
              <Image src="/images/jumping_3-1.svg" alt="" width={120} height={120} />
            </motion.div>

            <h1
              className={`font-bold text-black mb-6 lg:mb-[30px] text-[clamp(2rem,9vw,5rem)] min-[480px]:text-[clamp(2.5rem,12vw,5rem)] sm:text-[80px] lg:text-[130px] leading-[1.05] sm:leading-[0.9] lg:leading-[110px] ${isHe ? "normal-case" : "capitalize"}`}
            >
              {t.heading}
            </h1>

            <div>
              <p className="text-black text-[16px] sm:text-[20px] lg:text-[24px] leading-[120%] mb-2">
                <strong>{t.hqLabel}</strong>
                <br />
                {t.hqLines[0]}
              </p>
              <p className="text-black text-[16px] sm:text-[20px] lg:text-[24px] leading-[120%]">
                <strong>{t.officesLabel}</strong>{" "}
                <a href="tel:073-7443322" className="text-black hover:underline">
                  073-7443322
                </a>
              </p>
            </div>
          </div>

          <div className="w-full lg:w-[532px] lg:flex-shrink-0 min-w-0">
            <div className="rounded-[20px] bg-black px-4 py-7 min-[480px]:px-5 min-[480px]:py-8 sm:px-12 sm:py-[60px] lg:px-[48px] lg:pt-[60px] lg:pb-[42px]">
              <ContactForm lang={lang === "he" ? "he" : "en"} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
