'use client';

import { useEffect, useRef } from 'react';

interface ProcessStep {
  title: string;
  description?: string;
}

interface ProcessFlowProps {
  title?: string;
  subtitle?: string;
  steps?: ProcessStep[];
  variant?: 'default' | 'compact' | 'vertical';
  showDesktopOnly?: boolean;
  showMobileOnly?: boolean;
  animationDelay?: boolean;
  customMetadataKey?: string; // For loading from metadata
}

/**
 * ProcessFlow Component
 *
 * Renders a design process flow with 8 steps in desktop/mobile variations.
 * Can be used as a shared component across multiple pages.
 *
 * Consolidates the duplicate "unique_design" sections found across 30+ files.
 *
 * Example:
 * <ProcessFlow customMetadataKey="home" />
 */
export default function ProcessFlow({
  title,
  subtitle,
  steps,
  variant = 'default',
  showDesktopOnly = false,
  showMobileOnly = false,
  animationDelay = true,
  customMetadataKey,
}: ProcessFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Default steps if not provided
  const defaultSteps: ProcessStep[] = [
    {
      title: 'Kickoff Meeting',
      description: 'Initial project kickoff and requirements gathering',
    },
    {
      title: 'Research & Competitive analysis',
      description: 'In-depth market and competitor analysis',
    },
    {
      title: 'User interviews',
      description: 'Direct user research and insights',
    },
    {
      title: 'Brainstorming Ideate phase Build use case + Flow',
      description: 'Creative ideation and user flow mapping',
    },
    {
      title: 'Detailed Wireframes',
      description: 'Low-fidelity wireframe creation',
    },
    {
      title: 'User Testing',
      description: 'Usability testing with real users',
    },
    {
      title: 'Concepts Design',
      description: 'High-fidelity design concepts',
    },
    {
      title: 'Detailed Design',
      description: 'Final polished design specifications',
    },
  ];

  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;
  const displayTitle = title || 'Our unique Design Process';
  const displaySubtitle = subtitle || 'Our unique design process blends deep user insight with creative strategy to craft digital experiences that truly stand out.';

  // Initialize animations when component mounts
  useEffect(() => {
    if (!containerRef.current) return;

    // Add animation observer for reveal-on-scroll effect
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show-me');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current.querySelectorAll('.show-me');
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  // Desktop version with horizontal timeline
  const renderDesktopBullets = () => (
    <div className="design_bullets desktopbullets">
      <div className="design_line" />
      <ul className="show-me">
        {displaySteps.map((step, index) => (
          <li
            key={index}
            className={`enter-y ${animationDelay ? `delay-${index + 2}` : ''}`}
          >
            <span />
            <p dangerouslySetInnerHTML={{ __html: step.title }} />
          </li>
        ))}
      </ul>
    </div>
  );

  // Mobile version with carousel
  const renderMobileBullets = () => (
    <div className="design_bullets mobilebullets">
      <div className="bullet_slider owl-carousel">
        {displaySteps.map((step, index) => (
          <div
            key={index}
            className={`bullet_slider_item enter-y ${animationDelay ? 'delay-10' : ''}`}
          >
            <div className="bullet_txt">
              <p dangerouslySetInnerHTML={{ __html: step.title }} />
            </div>
            <span />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div
      className="unique_design"
      data-component="ProcessFlow"
      data-variant={variant}
      ref={containerRef}
    >
      <div className="design_wrap show-me">
        <div className="top_design_text enter-y delay-1">
          <h3>
            {displayTitle.split(/(<br>|\n)/)[0]}
            {displayTitle.includes('Design') && (
              <>
                <br />
                <span>
                  {displayTitle.split(/(<br>|\n)/)[displayTitle.split(/(<br>|\n)/).length - 1]}
                </span>
              </>
            )}
          </h3>
          <p>{displaySubtitle}</p>
        </div>

        {!showMobileOnly && renderDesktopBullets()}
        {!showDesktopOnly && renderMobileBullets()}
      </div>

      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: displayTitle,
            description: displaySubtitle,
            step: displaySteps.map((step, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: step.title,
              text: step.description || step.title,
            })),
          }),
        }}
      />
    </div>
  );
}
