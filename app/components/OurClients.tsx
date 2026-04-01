'use client';

import { useEffect, useRef } from 'react';

export interface ClientLogo {
  name: string;
  src: string;
  className?: string;
  alt?: string;
}

interface OurClientsProps {
  heading_en?: string;
  heading_he?: string;
  subtitle_en?: string;
  subtitle_he?: string;
  clients?: ClientLogo[];
  assetPath?: string;
  locale?: 'en' | 'he';
  buttonText_en?: string;
  buttonText_he?: string;
  buttonHref?: string;
}

/**
 * OurClients Component
 *
 * Flexible client logo grid with dynamic content and bilingual support.
 * Displays company logos in responsive grid with optional descriptions.
 *
 * Consolidates 34 duplicate "portfolio_global" sections found across:
 * - All industry pages (agritech, b2b, b2c, cyber-security, fintech, gaming, etc.)
 * - And their Hebrew variants
 *
 * Features:
 * - Dynamic logo grid (12 or custom count)
 * - Responsive desktop + mobile grid
 * - Bilingual (English + Hebrew)
 * - Customizable logo URLs per page/industry
 * - Optional button CTA
 *
 * Usage:
 * <OurClients
 *   heading_en="Our Clients"
 *   subtitle_en="From small to global..."
 *   clients={[
 *     { name: "Microsoft", src: "/assets/b2b/microsoft.svg" },
 *     { name: "Google", src: "/assets/b2b/google.svg" },
 *   ]}
 *   locale="en"
 * />
 */
export function OurClients({
  heading_en = 'Our Clients',
  heading_he = 'הלקוחות שלנו',
  subtitle_en = 'From small to global, we have partnered with some great companies',
  subtitle_he = 'מחברות קטנות ועד גלובליות, שיתפנו פעולה עם חברות מעולות',
  clients,
  assetPath = '/assets/default',
  locale = 'en',
  buttonText_en = "Let's Talk",
  buttonText_he = 'בואו נדבר',
  buttonHref = '#contactus',
}: OurClientsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Default clients (generic, can be overridden per page)
  const defaultClients: ClientLogo[] = [
    { name: 'Client 1', src: `${assetPath}/client_1.svg`, className: 'g_logo1' },
    { name: 'Client 2', src: `${assetPath}/client_2.svg`, className: 'g_logo2' },
    { name: 'Client 3', src: `${assetPath}/client_3.svg`, className: 'g_logo3' },
    { name: 'Client 4', src: `${assetPath}/client_4.svg`, className: 'g_logo4' },
    { name: 'Client 5', src: `${assetPath}/client_5.svg`, className: 'g_logo5' },
    { name: 'Client 6', src: `${assetPath}/client_6.svg`, className: 'g_logo6' },
    { name: 'Client 7', src: `${assetPath}/client_7.svg`, className: 'g_logo7' },
    { name: 'Client 8', src: `${assetPath}/client_8.svg`, className: 'g_logo8' },
    { name: 'Client 9', src: `${assetPath}/client_9.svg`, className: 'g_logo9' },
    { name: 'Client 10', src: `${assetPath}/client_10.svg`, className: 'g_logo10' },
    { name: 'Client 11', src: `${assetPath}/client_11.svg`, className: 'g_logo11' },
    { name: 'Client 12', src: `${assetPath}/client_12.svg`, className: 'g_logo12' },
  ];

  const displayClients = clients && clients.length > 0 ? clients : defaultClients;
  const isHebrewLayout = locale === 'he';
  const heading = locale === 'he' ? heading_he : heading_en;
  const subtitle = locale === 'he' ? subtitle_he : subtitle_en;
  const buttonText = locale === 'he' ? buttonText_he : buttonText_en;

  // Initialize animations
  useEffect(() => {
    if (!containerRef.current) return;

    // Animate logo grid on scroll
    const logos = containerRef.current.querySelectorAll('.g_logo');
    logos.forEach((logo, index) => {
      setTimeout(() => {
        logo.classList.add('show');
      }, index * 50);
    });
  }, []);

  return (
    <div
      className={`portfolio_global ${isHebrewLayout ? 'rtl' : 'ltr'}`}
      ref={containerRef}
      dir={isHebrewLayout ? 'rtl' : 'ltr'}
    >
      <div className="global_logos grid">
        {displayClients.map((client, index) => {
          const className = client.className || `g_logo${index + 1}`;
          return (
            <div
              key={`client-${index}`}
              className={`${className} grid__item g_logo`}
            >
              <div className="grid__item-img">
                <img
                  src={client.src}
                  alt={client.alt || client.name}
                  data-speed="-5"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="global_con">
        <div className="global_wrap">
          <h2>{heading}</h2>
          <h3>{subtitle}</h3>
          <div className="global_but">
            <a href={buttonHref}>
              <span className="default-text">{buttonText}</span>
              <span className="hover-text">{buttonText}</span>
              <span className="button-overlay"></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
