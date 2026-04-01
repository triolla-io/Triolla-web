"use client";

import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { contactFormCopy } from "@/messages/contact";

interface ContactFormProps {
  dark?: boolean;
  heading?: string;
  showPhone?: boolean;
}

export default function ContactForm({
  dark = false,
  heading: headingProp,
  showPhone = false,
}: ContactFormProps) {
  const locale = useLocale();
  const c = contactFormCopy[locale];
  const heading = headingProp ?? c.heading;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass = dark
    ? "block w-full bg-transparent border-0 border-b border-black/30 text-black placeholder-black/40 py-2.5 text-[15px] focus:outline-none focus:border-black/60 transition-colors font-inherit"
    : "block w-full bg-transparent border-0 border-b border-black/20 text-black placeholder-black/40 py-2.5 text-[15px] focus:outline-none focus:border-black/60 transition-colors font-inherit";

  const labelClass = dark
    ? "block text-[11px] font-medium mb-0.5 text-black/55 uppercase tracking-wider"
    : "block text-[11px] font-medium mb-0.5 text-black/50 uppercase tracking-wider";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Use Formspree or mailto fallback
    const formspreeEndpoint = "https://formspree.io/f/xpwzbrvy";

    try {
      const res = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        // Fallback: open mailto
        const subject = encodeURIComponent(`Contact from ${data.name}`);
        const body = encodeURIComponent(
          `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "—"}\nMessage: ${data.message || "—"}`
        );
        window.location.href = `mailto:studio@triolla.io?subject=${subject}&body=${body}`;
      }
    } catch {
      const subject = encodeURIComponent(`Contact from ${data.name}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "—"}\nMessage: ${data.message || "—"}`
      );
      window.location.href = `mailto:studio@triolla.io?subject=${subject}&body=${body}`;
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <p
          className={`text-[17px] sm:text-[18px] font-semibold ${dark ? "text-[#FED125]" : "text-black"}`}
        >
          {c.thanks}
        </p>
      </div>
    );
  }

  return (
    <div>
      {heading && (
        <h4 className="text-[20px] sm:text-[22px] lg:text-[28px] font-bold leading-snug tracking-tight mb-4 sm:mb-5 text-black">
          {heading}
        </h4>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project type radio buttons (dark form only) */}
        {dark && (
          <div className="mb-3">
            <label className={labelClass}>{c.iNeed}</label>
            <div className="flex gap-1.5 flex-wrap mt-1.5">
              {c.projectTypes.map((opt) => (
                <label
                  key={opt}
                  className="relative flex min-h-[36px] items-center justify-center px-3 py-1.5 border border-black/25 rounded-full cursor-pointer text-[12px] font-medium text-black/90 hover:bg-black/5 transition-colors has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black"
                >
                  <input
                    type="radio"
                    name="project_type"
                    value={opt}
                    className="sr-only"
                    defaultChecked={opt === c.projectTypes[0]}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <input
            type="text"
            name="name"
            placeholder={c.fullName}
            required
            className={inputClass}
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder={c.email}
            required
            className={inputClass}
          />
        </div>

        {showPhone && (
          <div>
            <input
              type="tel"
              name="phone"
              placeholder={c.phone}
              className={inputClass}
            />
          </div>
        )}

        <div>
          <input
            type="text"
            name="company"
            placeholder={c.company}
            className={inputClass}
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`pill-btn min-h-[42px] px-6 py-2 text-[14px] font-bold ${
              dark
                ? "bg-black text-white border-black w-full justify-center"
                : "bg-black text-white border-black"
            }`}
          >
            <span className="default-text">{loading ? c.sending : c.send}</span>
            <span
              className="hover-text"
              style={{ color: dark ? "#000" : "#fff" }}
            >
              {loading ? c.sending : c.send}
            </span>
            <span
              className="btn-overlay"
              style={{ background: dark ? "#FED125" : "#FED125" }}
            />
          </button>
        </div>
      </form>
    </div>
  );
}
