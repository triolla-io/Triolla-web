"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import ScrollReveal from "@/components/ScrollReveal";

/** One shared scroll factor on the whole logo layer — avoids logos sliding into each other. */
const LOGO_LAYER_PARALLAX = -0.18;

const globalLogos = [
  { cls: "g_logo1",  src: "/images/microsoft_global.svg",        alt: "Microsoft",         w: 239, h: 274 },
  { cls: "g_logo2",  src: "/images/american_express_global.svg",  alt: "American Express",  w: 159, h: 159 },
  { cls: "g_logo3",  src: "/images/n_gloabl.svg",                 alt: "NI",                w: 125, h: 125 },
  { cls: "g_logo4",  src: "/images/human_global.svg",             alt: "Human",             w: 143, h: 143 },
  { cls: "g_logo5",  src: "/images/passport_cart_global.svg",     alt: "Passport Cart",     w: 115, h: 115 },
  { cls: "g_logo6",  src: "/images/jfrog_global.svg",             alt: "JFrog",             w: 176, h: 176 },
  { cls: "g_logo7",  src: "/images/alam_global.svg",              alt: "Alam",              w: 102, h: 102 },
  { cls: "g_logo8",  src: "/images/taboola_global.svg",           alt: "Taboola",           w: 174, h: 174 },
  { cls: "g_logo9",  src: "/images/is_global.svg",                alt: "IS",                w: 219, h: 219 },
  { cls: "g_logo10", src: "/images/star_global.svg",              alt: "Star",              w: 127, h: 127 },
  { cls: "g_logo11", src: "/images/playtika_global.svg",          alt: "Playtika",          w: 227, h: 227 },
  { cls: "g_logo12", src: "/images/finaro_global.svg",            alt: "Finaro",            w: 121, h: 121 },
];

/** Matches WP: logos hidden 768–1023px; visible on large desktop and again on small mobile (≤767px). NI (g_logo3) only on desktop. ! needed to beat `.global_logos .g_logo{display:none}` in globals.css. */
function logoVisibilityClass(logoCls: string) {
  if (logoCls === "g_logo3") return "hidden lg:!block";
  return "hidden max-[767px]:!block lg:!block";
}

export default function ClientLogosSection({ className }: { className?: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const logosLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const runParallax = () => {
      if (!sectionRef.current || !logosLayerRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      logosLayerRef.current.style.transform = `translate3d(0, ${centerOffset * LOGO_LAYER_PARALLAX}px, 0)`;
    };

    if (mq.matches) return;

    window.addEventListener("scroll", runParallax, { passive: true });
    runParallax();
    return () => window.removeEventListener("scroll", runParallax);
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`portfolio_global relative isolate z-10 w-full min-w-0 overflow-x-hidden${className ? ` ${className}` : ""}`}
    >
      <div
        ref={logosLayerRef}
        className="global_logos pointer-events-none z-[1] will-change-transform"
      >
        {globalLogos.map((logo) => (
          <div
            key={logo.cls}
            className={`g_logo ${logo.cls} ${logoVisibilityClass(logo.cls)}`}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.w}
              height={logo.h}
              className="block h-auto w-full max-w-full"
              sizes="(max-width: 767px) 120px, 240px"
            />
          </div>
        ))}
      </div>
      <div className="global_con relative z-[2] pointer-events-auto">
        <div className="global_wrap">
          <ScrollReveal direction="up">
            <h2>Our Clients</h2>
            <h3>From small to global, we have partnered with some great companies</h3>
            <div className="global_but">
              <a href="#contactus">
                <span className="default-text">Let&apos;s Talk</span>
                <span className="hover-text">Let&apos;s Talk</span>
                <span className="button-overlay"></span>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
