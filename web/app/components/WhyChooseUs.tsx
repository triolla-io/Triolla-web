'use client';

import { useEffect, useRef } from 'react';

export interface WhyItem {
  title: string;
  description: string;
  desktopClass?: string; // e.g., 'whydesk2', 'whydesk3' - controls size
  mobileClass?: string;  // e.g., 'why2', 'why3' - controls size
}

interface WhyChooseUsProps {
  heading?: string;
  items?: WhyItem[];
  variant?: 'default' | 'compact' | 'large';
  customContent?: boolean; // If true, expects metadata for content
  metadataKey?: string;    // Key to look up in metadata
}

/**
 * WhyChooseUs Component
 *
 * Flexible, reusable "Why Choose Us" section with dynamic content.
 * Handles variable number of items and customizable rectangle sizes.
 *
 * Consolidates 26 duplicate "portolio_cyber_list" sections found across:
 * - agritech, b2b, b2c, cyber-security, dashboard-design, dev, device-iot
 * - fintech-finance, gaming, medical-healthcare, mobile-apps, saas-platforms
 * - startups-tech, portfolio-page, and all -he (Hebrew) variants
 *
 * Usage:
 * <WhyChooseUs
 *   heading="Why Do IoT Companies Choose Us?"
 *   items={[
 *     { title: "We speak your language", description: "Fluent in IoT..." },
 *     { title: "Battle-tested experience", description: "Over 50 Apps..." },
 *   ]}
 * />
 */
export function WhyChooseUs({
  heading = 'Why Choose Us',
  items,
  variant = 'default',
  customContent = false,
  metadataKey,
}: WhyChooseUsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Default items if none provided
  const defaultItems: WhyItem[] = [
    {
      title: 'We speak your language',
      description: 'Fluent in the terms, flows, and mindset of your industry',
      desktopClass: 'whydesk2',
      mobileClass: 'why2',
    },
    {
      title: 'Battle-tested experience',
      description: 'Proven track record across 50+ apps and SaaS platforms',
      desktopClass: 'whydesk3',
      mobileClass: 'why3',
    },
    {
      title: 'Up to speed from day one',
      description: "We get your world, so we get to work—fast.",
      desktopClass: 'whydesk4',
      mobileClass: 'why4',
    },
    {
      title: 'Security-first thinking',
      description: 'Our UX is built with your users, risks, and compliance in mind.',
      desktopClass: 'whydesk5',
      mobileClass: 'why5',
    },
  ];

  const displayItems = items && items.length > 0 ? items : defaultItems;

  // Initialize animations
  useEffect(() => {
    if (!containerRef.current) return;

    // Trigger animations for reveal-on-scroll
    const elements = containerRef.current.querySelectorAll('li');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('show');
      }, index * 100);
    });
  }, []);

  return (
    <div className="portolio_cyber_list" ref={containerRef}>
      {heading && <h2 className="why-choose-heading">{heading}</h2>}

      {/* Desktop Version */}
      <ul className="pdesktp">
        {displayItems.map((item, index) => {
          const desktopClass = item.desktopClass || `whydesk${index + 2}`;
          return (
            <li key={`desktop-${index}`} className={desktopClass}>
              <div className="port_cyber_con">
                <div className="port_cyber_con_new">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </div>
              <style type="text/css">
                {`.portfolio_why ul li.${desktopClass}{transition:${index + 1}s; -moz-transition:${index + 1}s; -webkit-transition:${index + 1}s; }`}
              </style>
            </li>
          );
        })}
      </ul>

      {/* Mobile Version with Carousel */}
      <ul className="pmobile owl-carousel">
        {displayItems.map((item, index) => {
          const mobileClass = item.mobileClass || `why${index + 2}`;
          return (
            <li key={`mobile-${index}`} className={mobileClass}>
              <div className="port_cyber_con">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
              <style type="text/css">
                {`.portfolio_why ul li.${mobileClass}{transition:${index + 2}s; -moz-transition:${index + 2}s; -webkit-transition:${index + 2}s; }`}
              </style>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
