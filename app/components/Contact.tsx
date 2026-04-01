'use client';

import { useEffect, useRef } from 'react';
import { initContactFormValidation, reinitializeGravityForm } from '@/app/lib/contactFormInit';

export function Contact() {
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contactRef.current) return;

    // Load contact template
    fetch('/assets/_shared/contact-template.html')
      .then(res => res.text())
      .then(html => {
        if (contactRef.current) {
          contactRef.current.innerHTML = html;
          // Re-initialize Gravity Forms and interactions
          reinitializeGravityForm();
          initContactFormValidation();
        }
      })
      .catch(err => console.error('Failed to load contact template:', err));
  }, []);

  return <div ref={contactRef} />;
}
