"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

const learningItems = [
  { img: "/images/learn1.png", txt: "AI-Driven Product Design: Integrate machine learning for innovative digital experiences" },
  { img: "/images/learn2.png", txt: "Advanced UX Research: Master user interviews and testing for lovable products." },
  { img: "/images/learn3.png", txt: "Secure Product Development: Cybersecurity essentials for building safe digital platforms." },
  { img: "/images/learn4.png", txt: "Branding for Digital Products: Craft compelling stories and visual identities." },
  { img: "/images/learn1.png", txt: "Rapid Prototyping: Fast iteration and validation of product ideas." },
  { img: "/images/learn2.png", txt: "Fintech UX: Design user-friendly financial products with security." },
  { img: "/images/learn3.png", txt: "Data Visualization: Transform complex data into engaging, clear visuals." },
  { img: "/images/learn4.png", txt: "Persuasive Design: Ethically influence user behavior through thoughtful UX." },
];

export default function LearnExploreGrowSection() {
  const SLIDE_DURATION = 900; // ms — matches WP feel
  const SLIDE_EASE = `transform ${SLIDE_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  const [learnOffset, setLearnOffset] = useState(0);
  const [learnTransition, setLearnTransition] = useState(SLIDE_EASE);
  const learnBusy = useRef(false);
  const learnOffsetRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const dragXRef = useRef(0);
  const [dragX, setDragX] = useState(0);

  const slide = (offset: number) => {
    learnBusy.current = true;
    setLearnTransition(SLIDE_EASE);
    setLearnOffset(offset);
    learnOffsetRef.current = offset;
    if (offset >= 8) {
      setTimeout(() => {
        setLearnTransition("none");
        setLearnOffset(0);
        learnOffsetRef.current = 0;
        setTimeout(() => {
          learnBusy.current = false;
        }, 20);
      }, SLIDE_DURATION + 20);
    } else if (offset < 0) {
      setTimeout(() => {
        setLearnTransition("none");
        setLearnOffset(7);
        learnOffsetRef.current = 7;
        setTimeout(() => {
          learnBusy.current = false;
        }, 20);
      }, SLIDE_DURATION + 20);
    } else {
      setTimeout(() => {
        learnBusy.current = false;
      }, SLIDE_DURATION + 20);
    }
  };

  const learnNext = () => {
    if (learnBusy.current) return;
    slide(learnOffsetRef.current + 1);
  };

  const learnPrev = () => {
    if (learnBusy.current) return;
    const cur = learnOffsetRef.current;
    if (cur === 0) {
      // Jump to clone position 8 (same visual), then animate to 7.
      setLearnTransition("none");
      setLearnOffset(8);
      learnOffsetRef.current = 8;
      setTimeout(() => slide(7), 20);
    } else {
      slide(cur - 1);
    }
  };

  const onDragStart = (e: React.PointerEvent) => {
    if (learnBusy.current) return;
    dragStartX.current = e.clientX;
    dragXRef.current = 0;
    setDragX(0);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDragMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragXRef.current = delta;
    setDragX(delta);
  };

  const onDragEnd = () => {
    if (dragStartX.current === null) return;
    const delta = dragXRef.current;
    const threshold = (viewportRef.current?.offsetWidth ?? 400) * 0.15;
    dragStartX.current = null;
    dragXRef.current = 0;
    setDragX(0);
    if (delta < -threshold) learnNext();
    else if (delta > threshold) learnPrev();
  };

  return (
    <div className="about_leargrow">
      <div className="ablearwrap">
        <ScrollReveal direction="up">
          <div className="ableartop">
            <h4>Learn. Explore. Grow</h4>
            <p>At Triolla, growth is a mindset. That&apos;s why we fuel our culture with year-round talks, expert sessions, and nonstop learning.</p>
          </div>
        </ScrollReveal>
        <div className="ablearlist">
          <div
            className="learslider-viewport"
            ref={viewportRef}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerLeave={onDragEnd}
            style={{ cursor: dragX !== 0 ? "grabbing" : "grab" }}
          >
            <div
              className="learslider-track"
              style={{
                transform: dragX !== 0
                  ? `translateX(calc(-${learnOffset} * 6.25% + ${dragX}px))`
                  : `translateX(calc(-${learnOffset} * 6.25%))`,
                transition: dragX !== 0 ? "none" : learnTransition,
              }}
            >
              {[...learningItems, ...learningItems].map((item, i) => (
                <div key={i} className="learslider-item">
                  <div className="ablealistimg">
                    <Image src={item.img} alt="" width={387} height={709} style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                  <div className="ablealisttxt"><p>{item.txt}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="learslider-nav">
            <button className="learslider-btn learslider-btn--prev" aria-label="Previous" onClick={learnPrev}>
              <svg width="19" height="33" viewBox="0 0 19 33" fill="none"><path d="M4.75136 16.4333L17.4405 29.1224C17.8721 29.554 18.0807 30.0576 18.0663 30.633C18.0519 31.2085 17.829 31.7121 17.3973 32.1437C16.9657 32.5753 16.4622 32.7911 15.8867 32.7911C15.3113 32.7911 14.8077 32.5753 14.3761 32.1437L1.08272 18.8934C0.737441 18.5481 0.478479 18.1597 0.305837 17.7281C0.133196 17.2965 0.046875 16.8649 0.046875 16.4333C0.046875 16.0017 0.133196 15.5701 0.305837 15.1385C0.478479 14.7069 0.737441 14.3184 1.08272 13.9731L14.3761 0.679744C14.8077 0.24814 15.3185 0.039532 15.9083 0.0539188C16.4982 0.0683056 17.0089 0.291301 17.4405 0.722905C17.8721 1.15451 18.0879 1.65805 18.0879 2.23352C18.0879 2.80899 17.8721 3.31253 17.4405 3.74413L4.75136 16.4333Z" fill="#FFB337" /></svg>
            </button>
            <button className="learslider-btn learslider-btn--next" aria-label="Next" onClick={learnNext}>
              <svg width="19" height="33" viewBox="0 0 19 33" fill="none"><path d="M14.2467 16.4349L1.55754 3.74573C1.12594 3.31413 0.917331 2.81059 0.931718 2.23512C0.946105 1.65964 1.1691 1.15611 1.6007 0.724501C2.03231 0.292899 2.53584 0.0770974 3.11132 0.0770975C3.68679 0.0770975 4.19033 0.292899 4.62193 0.724501L17.9153 13.9747C18.2606 14.32 18.5196 14.7085 18.6922 15.1401C18.8649 15.5717 18.9512 16.0033 18.9512 16.4349C18.9512 16.8665 18.8649 17.2981 18.6922 17.7297C18.5196 18.1613 18.2606 18.5497 17.9153 18.895L4.62193 32.1884C4.19032 32.62 3.67959 32.8286 3.08973 32.8142C2.49988 32.7999 1.98915 32.5769 1.55754 32.1453C1.12594 31.7137 0.910135 31.2101 0.910135 30.6346C0.910136 30.0592 1.12594 29.5556 1.55754 29.124L14.2467 16.4349Z" fill="#FFB337" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
