"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

function ContactForm() {
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
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("https://formspree.io/f/xpwzbrvy", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setSubmitted(true);
      else throw new Error("Failed");
    } catch {
      const subject = encodeURIComponent(`Contact from ${data.name}`);
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "—"}\nCompany: ${data.company || "—"}`
      );
      window.location.href = `mailto:studio@triolla.io?subject=${subject}&body=${body}`;
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-[20px] font-semibold text-[#FED125] py-8 text-center">
        Thanks! We&apos;ll be in touch soon.
      </p>
    );
  }

  const inputClass =
    "block w-full bg-transparent border-0 border-b border-white/35 text-white py-3 text-[20px] focus:outline-none focus:border-white/70 transition-colors";
  const labelClass =
    "absolute top-[10px] left-0 text-[20px] text-white transition-all duration-300 pointer-events-none";
  const activeLabelClass = "!top-[-10px] !text-[14px] opacity-100";

  return (
    <form onSubmit={handleSubmit}>
      {/* Fields */}
      {(
        [
          { name: "name", label: "Full Name", type: "text", required: true },
          { name: "company", label: "Company", type: "text", required: false },
          { name: "phone", label: "Phone", type: "tel", required: true },
          { name: "email", label: "Email", type: "email", required: true },
        ] as { name: string; label: string; type: string; required: boolean }[]
      ).map((f) => (
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

      {/* Radio: I'm interested in… */}
      <div className="mt-[30px] mb-[62px]">
        <p className="text-[20px] text-white mb-4">I&apos;m interested in...</p>
        <div className="flex flex-wrap gap-3">
          {["UX/ UI Design", "Development", "Career"].map((opt, i) => (
            <label
              key={opt}
              className="relative flex items-center justify-center px-5 py-2 border border-white/35 rounded-full cursor-pointer text-[16px] font-medium text-white hover:border-white transition-colors has-[:checked]:bg-[#FED125] has-[:checked]:text-black has-[:checked]:border-[#FED125]"
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

      {/* Submit */}
      <a
        onClick={(e) => {
          e.preventDefault();
          (e.currentTarget.closest("form") as HTMLFormElement)?.requestSubmit();
        }}
        href="#"
        className="pill-btn block w-full text-center py-[10px] text-[20px] font-bold text-black bg-[#FED125] border-[#FED125]"
      >
        <span className="default-text">{loading ? "Sending..." : "Send"}</span>
        <span className="hover-text text-white">{loading ? "Sending..." : "Send"}</span>
        <span className="btn-overlay" style={{ background: "#000" }} />
      </a>
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* Banner section — yellow bg */}
      <section
        className="relative w-full overflow-hidden pt-[100px] pb-16 sm:pt-[180px] sm:pb-28 lg:pt-[262px] lg:pb-[201px]"
        style={{ background: "#FED125" }}
      >
        {/* Grid + glow — same as portfolio heroes: grid full-bleed; portolio natural aspect (no object-cover on wide SVG) */}
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
            className="absolute top-0 right-0 h-full w-auto opacity-30"
          />
        </div>

        <div className="relative mx-auto max-w-[1458px] px-5 sm:px-[41px]">
          <div className="flex flex-col lg:flex-row gap-y-10 lg:gap-y-0">
            {/* Left column */}
            <div className="relative w-full lg:w-[calc(100%-532px)] pt-0 lg:pt-[100px] lg:pr-[50px]">
              {/* Jumping SVGs — hidden on mobile */}
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

              {/* Heading */}
              <motion.h1
                className="font-bold text-black capitalize mb-6 lg:mb-[30px] text-[clamp(2.5rem,12vw,5rem)] sm:text-[80px] lg:text-[130px] leading-[0.9] lg:leading-[110px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                Let&apos;s Talk About Your Project
              </motion.h1>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
              >
                <p className="text-black text-[16px] sm:text-[20px] lg:text-[24px] leading-[120%] mb-2">
                  <strong>HQ:</strong>
                  <br />
                  Raanana, Zarchin 2 - 6 floor
                </p>
                <p className="text-black text-[16px] sm:text-[20px] lg:text-[24px] leading-[120%]">
                  <strong>Offices:</strong>{" "}
                  <a href="tel:073-7443322" className="text-black hover:underline">
                    073-7443322
                  </a>
                </p>
              </motion.div>
            </div>

            {/* Right column — dark form box */}
            <div className="w-full lg:w-[532px] lg:flex-shrink-0">
              <motion.div
                className="rounded-[20px] bg-black px-5 py-8 sm:px-12 sm:py-[60px] lg:px-[48px] lg:pt-[60px] lg:pb-[42px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
              >
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
