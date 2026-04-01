"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

interface DesignProcessSectionProps {
  title: ReactNode;
  description: string;
  steps: string[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

function AnimatedStepList({
  steps,
  reduceMotion,
}: {
  steps: string[];
  reduceMotion: boolean | null;
}) {
  const stagger = reduceMotion ? 0 : 0.08;
  const duration = reduceMotion ? 0 : 0.6;

  return (
    <motion.ul
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {steps.map((step, i) => (
        <motion.li
          key={i}
          variants={{
            hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 30 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration, ease: EASE }}
        >
          <span />
          <p className="whitespace-pre-line">{step}</p>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function MobileCarousel({
  steps,
  reduceMotion,
}: {
  steps: string[];
  reduceMotion: boolean | null;
}) {
  // Group steps into pairs — 2 per slide, matching WP Owl Carousel
  const slides: string[][] = [];
  for (let i = 0; i < steps.length; i += 2) {
    slides.push(steps.slice(i, i + 2));
  }

  return (
    <motion.div
      className="flex overflow-x-scroll snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      initial={{ opacity: reduceMotion ? 1 : 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: EASE }}
    >
      {slides.map((pair, si) => (
        <div
          key={si}
          className="flex-none w-full snap-start grid grid-cols-2 gap-5 pr-5"
        >
          {pair.map((step, ii) => (
            <div key={ii} className="flex items-start gap-3">
              <span className="flex-none mt-1 w-4 h-4 bg-black rounded-full" />
              <p className="text-[14px] leading-[1.3] text-black/70 whitespace-pre-line">
                {step}
              </p>
            </div>
          ))}
        </div>
      ))}
    </motion.div>
  );
}

export default function DesignProcessSection({
  title,
  description,
  steps,
}: DesignProcessSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="unique_design relative z-[1] w-full overflow-x-hidden">
      <div className="design_wrap min-w-0">
        <ScrollReveal direction="up">
          <div className="top_design_text max-sm:pr-5">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </ScrollReveal>

        <div className="design_bullets desktopbullets">
          <div className="design_line" />
          <AnimatedStepList steps={steps} reduceMotion={reduceMotion} />
        </div>

        <div className="design_bullets mobilebullets">
          <MobileCarousel steps={steps} reduceMotion={reduceMotion} />
        </div>
      </div>
    </div>
  );
}
