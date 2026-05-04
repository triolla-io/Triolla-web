'use client';
import { useEffect } from 'react';

export default function FaqReveal() {
  useEffect(() => {
    const sec = document.querySelector<HTMLElement>('.port_faq_sec');
    if (!sec) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        sec.classList.add('faq-revealed');
        obs.disconnect();
      }
    }, { threshold: 0.05 });
    obs.observe(sec);
    return () => obs.disconnect();
  }, []);
  return null;
}
