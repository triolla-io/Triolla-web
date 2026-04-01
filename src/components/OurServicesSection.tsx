"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export type OurServicesSectionProps = {
  className?: string;
};

/** Stateless; each mount gets its own ScrollReveal observers — safe to use more than once per page. */
export default function OurServicesSection({ className }: OurServicesSectionProps) {
  const rootClass = className ? `about_service ${className}` : "about_service";

  return (
    <div className={rootClass}>
      <div className="abservwrap">
        <ScrollReveal direction="up">
          <div className="abservtop">
            <h3>Our Services</h3>
            <p>We build powerful brands and design digital products engineered for success</p>
          </div>
        </ScrollReveal>
        <div className="abservlist">
          <ScrollReveal direction="up">
            <div className="abservlistdiv abservlistdiv1">
              <div className="abservllft abseheight"><span>Product Design</span></div>
              <div className="abservlrgt abseheight">
                <div className="abservlrgtin">
                  <ul>
                    <li><Link href="/services/ux-research/">UX Research</Link></li>
                    <li><Link href="/services/ui-design/">UI Design</Link></li>
                    <li><Link href="/services/wireframing/">Wireframes</Link></li>
                    <li><Link href="/services/prototyping/">Prototyping</Link></li>
                    <li><Link href="/services/user-testing/">User Testing</Link></li>
                    <li><Link href="/services/design-system-creation/">Design System Creation</Link></li>
                    <li><Link href="/services/product-stars/">Product Starts</Link></li>
                  </ul>
                </div>
              </div>
              <div className="clr"></div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            <div className="abservlistdiv abservlistdiv2">
              <div className="abservllft abseheight"><span>Product Development</span></div>
              <div className="abservlrgt abseheight">
                <div className="abservlrgtin">
                  <ul>
                    <li><Link href="/services/ai-automation/">AI &amp; Automation</Link></li>
                    <li><a href="#">React.js</a></li>
                    <li><a href="#">Angular</a></li>
                    <li><a href="#">Vue.js</a></li>
                    <li><a href="#">Next.js</a></li>
                    <li><a href="#">Node.js</a></li>
                    <li><a href="#">Express.js</a></li>
                    <li><a href="#">Django</a></li>
                    <li><a href="#">Python</a></li>
                  </ul>
                </div>
              </div>
              <div className="clr"></div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <div className="abservlistdiv abservlistdiv3">
              <div className="abservllft abseheight"><span>Branding &amp; Studio</span></div>
              <div className="abservlrgt abseheight">
                <div className="abservlrgtin">
                  <ul>
                    <li><Link href="/services/creative-concept/">Creative concept</Link></li>
                    <li><Link href="/services/logo-design/">Logo Design</Link></li>
                    <li><Link href="/services/character-design/">Character Design</Link></li>
                    <li><Link href="/services/presentations/">Presentations</Link></li>
                    <li><Link href="/services/motion-design/">Motion Design</Link></li>
                  </ul>
                </div>
              </div>
              <div className="clr"></div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
