"use client";

import { motion } from "framer-motion";

export type HeroImage = {
  src: string;
  w: number;
  h: number;
  cls: string;
  delay: number;
  from: "left" | "right" | "up";
  float?: boolean;
};

export default function HeroCollage({ images }: { images: HeroImage[] }) {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      {images.map((img, i) => (
        <motion.div
          key={i}
          className={`hometopimage ${img.cls}`}
          initial={{
            opacity: 0,
            x: img.from === "left" ? -60 : img.from === "right" ? 60 : 0,
            y: img.from === "up" ? 50 : 0,
          }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.9, delay: img.delay, ease: [0.22, 1, 0.36, 1] }}
        >
          {img.float ? (
            <motion.div
              animate={{ y: [0, -18, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: img.delay + 1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/${img.src}`} alt="" />
            </motion.div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={`/images/${img.src}`} alt="" />
          )}
        </motion.div>
      ))}
      <div style={{ clear: "both" }} />
    </div>
  );
}
