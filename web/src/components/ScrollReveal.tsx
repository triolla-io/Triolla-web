"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Framer Motion delay in seconds (e.g. 0.1 = 100ms). */
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "li" | "section";
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
  style,
  as = "div",
}: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const initial = {
    opacity: 0,
    y: direction === "up" ? 40 : 0,
    x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
  };

  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </Component>
  );
}