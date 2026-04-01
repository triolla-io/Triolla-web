# Page Status

> Generated: 2026-03-29  
> Source: pipeline/urls.json (294 total) vs web/app page.tsx files (53 routes)

---

## Summary

| Category | Count |
|---|---|
| English pages live at localhost | 41 |
| English pages in sitemap but NOT live | 103 |
| &nbsp;&nbsp;→ Blog posts (no page.tsx) | 102 |
| &nbsp;&nbsp;→ Services sub-pages (URL mismatch — see note) | 1 |
| &nbsp;&nbsp;→ Other missing | 0 |
| Hebrew pages in sitemap | 12 |
| Hebrew pages served by [lang] routes | 11 |
| Hebrew pages NOT live | 11 (see Hebrew section) |

---

## Live English Pages (respond 200)

| Route | URL |
|---|---|
| `/` | https://triolla.io/ |
| `/service-detail` | https://triolla.io/service-detail/ |
| `/branding-studio` | https://triolla.io/branding-studio/ |
| `/portfolio-page` | https://triolla.io/portfolio-page/ |
| `/terms-of-use` | https://triolla.io/terms-of-use/ |
| `/dev` | https://triolla.io/dev/ |
| `/fintech-finance` | https://triolla.io/fintech-finance/ |
| `/careers` | https://triolla.io/careers/ |
| `/b2b` | https://triolla.io/b2b/ |
| `/b2c` | https://triolla.io/b2c/ |
| `/agritech` | https://triolla.io/agritech/ |
| `/mobile-apps` | https://triolla.io/mobile-apps/ |
| `/gaming` | https://triolla.io/gaming/ |
| `/device-iot` | https://triolla.io/device-iot/ |
| `/saas-platforms` | https://triolla.io/saas-platforms/ |
| `/startups-tech` | https://triolla.io/startups-tech/ |
| `/services-character-design (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/character-design/ |
| `/services-creative-concept (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/creative-concept/ |
| `/services-design-system-creation (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/design-system-creation/ |
| `/services-logo-design (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/logo-design/ |
| `/services-presentations (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/presentations/ |
| `/services-product-ux-ui-design (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/product-ux-ui-design/ |
| `/services-prototyping (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/prototyping/ |
| `/services-user-testing (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/user-testing/ |
| `/services-ux-research (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/ux-research/ |
| `/services-wireframing (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/wireframing/ |
| `/cyber-security` | https://triolla.io/cyber-security/ |
| `/technology` | https://triolla.io/technology/ |
| `/services-front-end-dev (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/front-end-dev/ |
| `/services-back-end-dev (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/back-end-dev/ |
| `/medical-healthcare` | https://triolla.io/medical-healthcare/ |
| `/services-product-stars (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/product-stars/ |
| `/accessibility-statement` | https://triolla.io/accessibility-statement/ |
| `/services-ui-design (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/ui-design/ |
| `/contact-us` | https://triolla.io/contact-us/ |
| `/privacy-policy` | https://triolla.io/privacy-policy/ |
| `/services-motion-design-old (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/motion-design-old/ |
| `/services` | https://triolla.io/services/ |
| `/about-us` | https://triolla.io/about-us/ |
| `/services-motion-design (URL mismatch!)` ⚠️ URL mismatch | https://triolla.io/services/motion-design/ |
| `/dashboard-design` | https://triolla.io/dashboard-design/ |

### [lang] bilingual routes

These serve both English and Hebrew via the `/[lang]/...` dynamic segment.

| Route | English URL | Hebrew URL |
|---|---|---|
| `/[lang]` | https://triolla.io/ | https://triolla.io/he/ |
| `/[lang]/about` | https://triolla.io/about | https://triolla.io/he/about |
| `/[lang]/about-us` | https://triolla.io/about-us | https://triolla.io/he/about-us |
| `/[lang]/agritech` | https://triolla.io/agritech | https://triolla.io/he/agritech |
| `/[lang]/b2c` | https://triolla.io/b2c | https://triolla.io/he/b2c |
| `/[lang]/cyber-security` | https://triolla.io/cyber-security | https://triolla.io/he/cyber-security |
| `/[lang]/fintech-finance` | https://triolla.io/fintech-finance | https://triolla.io/he/fintech-finance |
| `/[lang]/gaming` | https://triolla.io/gaming | https://triolla.io/he/gaming |
| `/[lang]/medical-healthcare` | https://triolla.io/medical-healthcare | https://triolla.io/he/medical-healthcare |
| `/[lang]/services` | https://triolla.io/services | https://triolla.io/he/services |
| `/[lang]/technology` | https://triolla.io/technology | https://triolla.io/he/technology |

---

## Missing Pages (return 404)

### Blog Posts (101 entries — no page.tsx exists)

All blog pages have `web/app/blog-*/` folders with `*-deps.json` only. No React page has been created.

| Path | Title |
|---|---|
| `/blog/six-things-you-need-to-check-before-hiring-a-ux-ui-agency/` | Six Things You Need To Check Before Hiring A Ux Ui Agency |
| `/blog/triollas-mobile-app-ux-mastery-will-make-your-app-a-sensation/` | Triollas Mobile App Ux Mastery Will Make Your App A Sensation |
| `/blog/unleash-the-power-of-your-mvp-to-accelerate-your-growth-ux-design-for-startups/` | Unleash The Power Of Your Mvp To Accelerate Your Growth Ux Design For Startups |
| `/blog/the-essential-guide-to-designing-a-top-performing-cyber-app-mastering-cyber-ux/` | The Essential Guide To Designing A Top Performing Cyber App Mastering Cyber Ux |
| `/blog/why-every-modern-company-needs-a-stellar-dashboard-ui-insights-from-triolla/` | Why Every Modern Company Needs A Stellar Dashboard Ui Insights From Triolla |
| `/blog/navigating-the-future-of-ux-design-2/` | Navigating The Future Of Ux Design 2 |
| `/blog/custom-ux-ui-design-for-power-bi-tableau-qlik-sap-oracle-bi/` | Custom Ux Ui Design For Power Bi Tableau Qlik Sap Oracle Bi |
| `/blog/ahead-of-the-curve-key-ux-ui-developments-to-watch-in-2024/` | Ahead Of The Curve Key Ux Ui Developments To Watch In 2024 |
| `/blog/behind-the-wheel/` | Behind The Wheel |
| `/blog/product-user-fit-comes-before-product-market-fit/` | Product User Fit Comes Before Product Market Fit |
| `/blog/nlp-ux/` | Nlp Ux |
| `/blog/uxui-faqs/` | Uxui Faqs |
| `/blog/f35-ux-vertigo/` | F35 Ux Vertigo |
| `/blog/ux-is-life-design-it-for-humans/` | Ux Is Life Design It For Humans |
| `/blog/triolla-an-industry-leader-is-actually-a-boutique-ux-studio/` | Triolla An Industry Leader Is Actually A Boutique Ux Studio |
| `/blog/7-emerging-ui-ux-design-trends-every-development-team-should-be-aware-of/` | 7 Emerging Ui Ux Design Trends Every Development Team Should Be Aware Of |
| `/blog/navigating-the-future-of-ux-design/` | Navigating The Future Of Ux Design |
| `/blog/saas-product-tour-trends-how-great-companies-onboard-users-in-2018/` | Saas Product Tour Trends How Great Companies Onboard Users In 2018 |
| `/blog/animation-in-ui-design-from-concept-to-reality/` | Animation In Ui Design From Concept To Reality |
| `/blog/best-practices-for-minimalist-design/` | Best Practices For Minimalist Design |
| `/blog/mobile-design-best-practices/` | Mobile Design Best Practices |
| `/blog/best-practices-for-cards/` | Best Practices For Cards |
| `/blog/ux-design-trends-for-2018/` | Ux Design Trends For 2018 |
| `/blog/5-examples-of-web-animation-done-right/` | 5 Examples Of Web Animation Done Right |
| `/blog/go-mobile-conference-7-ui-animation/` | Go Mobile Conference 7 Ui Animation |
| `/blog/the-essential-guide-to-designing-a-top-performing-cyber-app-6/` | The Essential Guide To Designing A Top Performing Cyber App 6 |
| `/blog/clutch-recognizes-triolla-among-the-top-ux-design-companies-for-2021/` | Clutch Recognizes Triolla Among The Top Ux Design Companies For 2021 |
| `/blog/power-up-your-design-system-with-figma-and-triolla/` | Power Up Your Design System With Figma And Triolla |
| `/blog/ux-fintech-expert-what-does-it-mean/` | Ux Fintech Expert What Does It Mean |
| `/blog/how-to-use-animation-to-improve-ux/` | How To Use Animation To Improve Ux |
| `/blog/the-unicorns-secret-to-conquering-product-success/` | The Unicorns Secret To Conquering Product Success |
| `/blog/why-ux-ui-design-matters-in-fintech/` | Why Ux Ui Design Matters In Fintech |
| `/blog/ux-in-medtech-when-trust-is-a-matter-of-life-and-death/` | Ux In Medtech When Trust Is A Matter Of Life And Death |
| `/blog/the-3-most-common-pain-points-when-hiring-ui-ux-agency-for-a-saas-product/` | The 3 Most Common Pain Points When Hiring Ui Ux Agency For A Saas Product |
| `/blog/classical-conditioning-and-user-experience/` | Classical Conditioning And User Experience |
| `/blog/pms-own-your-product-design-process-with-these-simple-steps/` | Pms Own Your Product Design Process With These Simple Steps |
| `/blog/how-to-sync-with-your-product-designer-pros-best-practices/` | How To Sync With Your Product Designer Pros Best Practices |
| `/blog/the-ultimate-product-design-process-the-best-practice-used-by-google-facebook-netflix-etc/` | The Ultimate Product Design Process The Best Practice Used By Google Facebook Netflix Etc |
| `/blog/enhancing-customer-satisfaction-through-positive-user-experience-and-user-delight/` | Enhancing Customer Satisfaction Through Positive User Experience And User Delight |
| `/blog/revolutionizing-healthcare-with-ux-design/` | Revolutionizing Healthcare With Ux Design |
| `/blog/level-up-your-gaming-app-with-triollas-expert-ux-tips-boost-user-engagement-and-retention/` | Level Up Your Gaming App With Triollas Expert Ux Tips Boost User Engagement And Retention |
| `/blog/designing-an-engaging-and-effective-agritech-app/` | Designing An Engaging And Effective Agritech App |
| `/blog/the-fintech-ux-playbook/` | The Fintech Ux Playbook |
| `/blog/designing-intuitive-and-secure-iot-products-for-the-future/` | Designing Intuitive And Secure Iot Products For The Future |
| `/blog/a-comprehensive-guide-to-mastering-mobile-app-design-for-israeli-startups-corporates/` | A Comprehensive Guide To Mastering Mobile App Design For Israeli Startups Corporates |
| `/blog/10-principles-for-using-color-in-ux-ui-design/` | 10 Principles For Using Color In Ux Ui Design |
| `/blog/tadirans-smart-home-app-design-that-makes-innovation-accessible/` | Tadirans Smart Home App Design That Makes Innovation Accessible |
| `/blog/10-ux-ui-design-rules-you-should-never-break/` | 10 Ux Ui Design Rules You Should Never Break |
| `/blog/prototyping-tools-for-ux-designers/` | Prototyping Tools For Ux Designers |
| `/blog/user-journey-how-to-do-it-right/` | User Journey How To Do It Right |
| `/blog/everything-you-need-to-know-about-wireframes/` | Everything You Need To Know About Wireframes |
| `/blog/ux-designer-or-ux-design/` | Ux Designer Or Ux Design |
| `/blog/the-ultimate-product-design-process-the-proven-method-used-by-google-facebook-netflix-and-more/` | The Ultimate Product Design Process The Proven Method Used By Google Facebook Netflix And More |
| `/blog/ftue-first-time-user-experience/` | Ftue First Time User Experience |
| `/blog/amazon-unveils-a-fresh-modern-design-for-the-prime-video-app/` | Amazon Unveils A Fresh Modern Design For The Prime Video App |
| `/blog/in-house-designers-or-a-ux-ui-agency-everything-you-need-to-know/` | In House Designers Or A Ux Ui Agency Everything You Need To Know |
| `/blog/power-users-the-key-to-your-apps-success-how-to-make-it-happen/` | Power Users The Key To Your Apps Success How To Make It Happen |
| `/blog/the-questions-every-entrepreneur-and-product-manager-must-be-able-to-answer-in-a-kickoff-meeting/` | The Questions Every Entrepreneur And Product Manager Must Be Able To Answer In A Kickoff Meeting |
| `/blog/why-is-ux-ui-created-as-a-team-effort/` | Why Is Ux Ui Created As A Team Effort |
| `/blog/how-to-prepare-for-a-product-manager-interview/` | How To Prepare For A Product Manager Interview |
| `/blog/the-hottest-ui-design-tips-for-dashboards/` | The Hottest Ui Design Tips For Dashboards |
| `/blog/why-is-a-ux-survey-a-crucial-step-in-product-definition/` | Why Is A Ux Survey A Crucial Step In Product Definition |
| `/blog/pro-tip-how-to-improve-landing-page-design/` | Pro Tip How To Improve Landing Page Design |
| `/blog/how-will-ux-ui-shape-our-technological-future/` | How Will Ux Ui Shape Our Technological Future |
| `/blog/behind-the-wheel-ux-design-aspects-for-smart-cars/` | Behind The Wheel Ux Design Aspects For Smart Cars |
| `/blog/if-ux-is-life-itself-it-must-be-designed-for-people-everywhere-and-always/` | If Ux Is Life Itself It Must Be Designed For People Everywhere And Always |
| `/blog/product-managers-manage-your-product-design-process-with-these-simple-steps/` | Product Managers Manage Your Product Design Process With These Simple Steps |
| `/blog/the-guide-product-roadmap/` | The Guide Product Roadmap |
| `/blog/the-easy-and-effective-way-to-collect-feedback-from-your-product-users/` | The Easy And Effective Way To Collect Feedback From Your Product Users |
| `/blog/the-essential-questions-to-consider-before-meeting-with-a-ux-ui-design-agency/` | The Essential Questions To Consider Before Meeting With A Ux Ui Design Agency |
| `/blog/the-real-difference-between-a-product-manager-pm-and-a-product-owner-po/` | The Real Difference Between A Product Manager Pm And A Product Owner Po |
| `/blog/user-experience-design-in-agritech-products-for-the-agriculture-industry/` | User Experience Design In Agritech Products For The Agriculture Industry |
| `/blog/how-user-experience-design-drives-startup-success-tips-for-building-winning-digital-products/` | How User Experience Design Drives Startup Success Tips For Building Winning Digital Products |
| `/blog/maximize-the-potential-of-iot-with-user-experience-design-by-triolla-ux/` | Maximize The Potential Of Iot With User Experience Design By Triolla Ux |
| `/blog/beyond-graphics-deep-user-experience-design-for-tomorrows-gaming-apps/` | Beyond Graphics Deep User Experience Design For Tomorrows Gaming Apps |
| `/blog/product-managers-must-understand-why-is-tiktok-so-addictive/` | Product Managers Must Understand Why Is Tiktok So Addictive |
| `/blog/ui-company-boosting-your-products-chances-of-success/` | Ui Company Boosting Your Products Chances Of Success |
| `/blog/user-experience-design-for-apps-thats-nothing-short-of-excellent/` | User Experience Design For Apps Thats Nothing Short Of Excellent |
| `/blog/a-comprehensive-guide-to-mastering-mobile-app-design-for-israeli-startups-and-companies/` | A Comprehensive Guide To Mastering Mobile App Design For Israeli Startups And Companies |
| `/blog/a-complex-project-becomes-simple-with-the-ux-canvas/` | A Complex Project Becomes Simple With The Ux Canvas |
| `/blog/ux-ui-design-the-real-way-to-motivate-your-users/` | Ux Ui Design The Real Way To Motivate Your Users |
| `/blog/how-the-industrys-leading-ux-ui-agency-can-also-be-a-boutique-ux-studio/` | How The Industrys Leading Ux Ui Agency Can Also Be A Boutique Ux Studio |
| `/blog/what-does-it-mean-to-be-a-ux-expert-in-fintech/` | What Does It Mean To Be A Ux Expert In Fintech |
| `/blog/user-experience-ux-design-is-the-design-of-life-itself/` | User Experience Ux Design Is The Design Of Life Itself |
| `/blog/how-to-stay-ahead-key-ux-ui-trends-and-the-future-of-user-experience-in-2024/` | How To Stay Ahead Key Ux Ui Trends And The Future Of User Experience In 2024 |
| `/blog/revolutionizing-healthcare-with-ux-design-2/` | Revolutionizing Healthcare With Ux Design 2 |
| `/blog/why-every-company-today-needs-a-custom-dashboard-for-business-management-and-control/` | Why Every Company Today Needs A Custom Dashboard For Business Management And Control |
| `/blog/nine-examples-of-mobile-ux-innovation-in-2019/` | Nine Examples Of Mobile Ux Innovation In 2019 |
| `/blog/onboarding-process-in-saas-products-how-the-big-companies-do-it/` | Onboarding Process In Saas Products How The Big Companies Do It |
| `/blog/how-to-create-web-animation-the-right-way/` | How To Create Web Animation The Right Way |
| `/blog/how-to-use-animation-to-improve-ux-2/` | How To Use Animation To Improve Ux 2 |
| `/blog/how-a-design-system-can-transform-your-digital-product-essential-insights-for-ux-ui-designers/` | How A Design System Can Transform Your Digital Product Essential Insights For Ux Ui Designers |
| `/blog/can-design-be-too-user-friendly-exploring-the-limits-of-ux-ui-in-product-design/` | Can Design Be Too User Friendly Exploring The Limits Of Ux Ui In Product Design |
| `/blog/lets-talk-microcopy-how-small-words-create-a-big-user-experience-in-ux-ui-design/` | Lets Talk Microcopy How Small Words Create A Big User Experience In Ux Ui Design |
| `/blog/what-is-ooux-understanding-object-oriented-ux-in-product-and-interface-design/` | What Is Ooux Understanding Object Oriented Ux In Product And Interface Design |
| `/blog/prompt-engineering-for-ux-ui-design-how-to-use-prompts-to-elevate-your-design-process/` | Prompt Engineering For Ux Ui Design How To Use Prompts To Elevate Your Design Process |
| `/blog/calcalist-triolla-named-best-ux-ui-agency-in-israel/` | Calcalist Triolla Named Best Ux Ui Agency In Israel |
| `/blog/wisdom-hub-invite/` | Wisdom Hub Invite |
| `/blog/globs-best-agency-in-israel/` | Globs Best Agency In Israel |
| `/blog/iso-27001-2025-2026/` | Iso 27001 2025 2026 |
| `/blog/cybersecurity-design-ux-a-founder-playbook/` | Cybersecurity Design Ux A Founder Playbook |
| `/blog/` | Blog |

### Services Sub-pages (1 entries)

> ⚠️ **URL Mismatch:** triolla.io uses nested paths (`/services/back-end-dev/`) but the Next.js app uses flat paths (`/services-back-end-dev`). The flat routes exist and serve content, but the nested URLs from the sitemap return 404. A redirect should be added in `middleware.ts`.

| Sitemap Path (404) | Actual Route (200) |
|---|---|
| `/services/ai-automation/` | ❌ not built |

---

## Hebrew Coverage

### Served via [lang] routes (✅ live)

| localhost URL | Original triolla.io URL |
|---|---|
| http://localhost:3000/he | https://triolla.io/he |
| http://localhost:3000/he/about | https://triolla.io/he/about |
| http://localhost:3000/he/about-us | https://triolla.io/he/about-us |
| http://localhost:3000/he/agritech | https://triolla.io/he/agritech |
| http://localhost:3000/he/b2c | https://triolla.io/he/b2c |
| http://localhost:3000/he/cyber-security | https://triolla.io/he/cyber-security |
| http://localhost:3000/he/fintech-finance | https://triolla.io/he/fintech-finance |
| http://localhost:3000/he/gaming | https://triolla.io/he/gaming |
| http://localhost:3000/he/medical-healthcare | https://triolla.io/he/medical-healthcare |
| http://localhost:3000/he/services | https://triolla.io/he/services |
| http://localhost:3000/he/technology | https://triolla.io/he/technology |

### Hebrew pages in sitemap NOT yet live

> These 12 URLs use Hebrew-language URL paths (percent-encoded). The [lang] routes only cover English-path URLs.

| Sitemap URL | Decoded Path | Status |
|---|---|---|
| https://triolla.io/he/blog/medical-control-tower/ | `/he/blog/medical-control-tower/` | ❌ 404 |
| https://triolla.io/he/%d7%aa%d7%a0%d7%90%d7%99-%d7%a9%d7%99%d7%9e%d7%95%d7%a9/ | `/he/תנאי-שימוש/` | ❌ 404 |
| https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%95%d7%95%d7%99%d7%a8%d7%a4%d7%a8%d7%99%d7%99%d7%9d/ | `/he/השירותים-שלנו/ווירפריים/` | ❌ 404 |
| https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%99%d7%a6%d7%99%d7%a8%d7%aa-%d7%93%d7%99%d7%96%d7%99%d7%99%d7%9f-%d7%a1%d7%99%d7%a1%d7%98%d7%9d/ | `/he/השירותים-שלנו/יצירת-דיזיין-סיסטם/` | ❌ 404 |
| https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%9e%d7%a6%d7%92%d7%95%d7%aa/ | `/he/השירותים-שלנו/מצגות/` | ❌ 404 |
| https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%a2%d7%99%d7%a6%d7%95%d7%91-%d7%9e%d7%95%d7%a9%d7%9f/ | `/he/השירותים-שלנו/עיצוב-מושן/` | ❌ 404 |
| https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%a4%d7%99%d7%aa%d7%95%d7%97-front-end/ | `/he/השירותים-שלנו/פיתוח-front-end/` | ❌ 404 |
| https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%a4%d7%a8%d7%95%d7%98%d7%95%d7%98%d7%99%d7%99%d7%a4/ | `/he/השירותים-שלנו/פרוטוטייפ/` | ❌ 404 |
| https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%a2%d7%99%d7%a6%d7%95%d7%91-ui/ | `/he/השירותים-שלנו/עיצוב-ui/` | ❌ 404 |
| https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/motion-design2/ | `/he/השירותים-שלנו/motion-design2/` | ❌ 404 |
| https://triolla.io/he/ | `/he/` | ❌ 404 |
| https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/ | `/he/השירותים-שלנו/` | ❌ 404 |

---

## Active Errors (from dev server logs)

| Error | Affected Pages | Fix |
|---|---|---|
| 404: `images/menuarowdesk.svg`, `images/global_layer.svg`, `images/faq_plus.svg` | Every page | Copy from landing-page snapshots |
| 404: `images/win_bg.png`, `images/portfolio_grid_bg-old.png` | / (home) | Copy from landing-page snapshots |
| 404: Hebrew fonts (AlmoniMLv5AAA-*, AlmoniDLAAA-*) | /he/services, /he/* | Copy from triolla-io-services-he/_assets |
| JS: `ForceInlineSVGActive is not defined` | /medical-healthcare | Fix script load order in deps.json |
| JS: `TypeError: Cannot read properties of undefined (reading ‘header’)` | /medical-healthcare | Related to above |
| Deprecated: `middleware` convention | All | Rename `middleware.ts` → `proxy.ts` (low priority) |

---

## Asset Duplication Summary

### `web/public/assets/` CSS (audited)

Report: `pipeline/css_dedup_report.json`

| Metric | Value |
|---|---|
| CSS files scanned | 2,735 |
| Unique CSS content | 27 |
| Duplicate groups | 24 |
| **Total wasted** | **80.9 MB** |

Top duplicates (all are site-wide theme/plugin CSS shared across every page):

| File | Copies | Wasted |
|---|---|---|
| `style.min.css_edabec9e.css` | 148 | 16,702 KB |
| `gdpr-main-nf.css_d6ea100c.css` | 170 | 14,931 KB |
| `style.css_edabec9e.css` | 149 | 11,932 KB |
| `animate.css_edabec9e.css` | 170 | 11,926 KB |
| `responsive.css_edabec9e.css` | 148 | 8,915 KB |

**Fix strategy (requires explicit approval before executing):**
1. Move the 27 unique CSS files into `web/public/assets/_shared/`
2. Update the `next.config.ts` headers to cache `/assets/_shared/*` files aggressively (already done for `/assets/*`)
3. In each page's `*-deps.json`, the shared CSS filenames are already referenced by hash — no deps.json changes needed, only the files need to be moved/symlinked
4. Use symlinks: `ln -s ../../_shared/style.min.css_edabec9e.css web/public/assets/about-us/style.min.css_edabec9e.css` — or consolidate at the Next.js route level

---

### `landing-page/` font SVGs (NOT yet deduped — destructive operation)

Report: `pipeline/duplicate_assets_report.json`

| Metric | Value |
|---|---|
| Duplicate groups | 466 |
| **Total wasted** | **~19 GB** |

Top waste: `SFProText-Medium.svg` — 118 copies, ~1.2 GB each.

**Fix strategy (requires explicit approval before executing):**
1. Create `landing-page/_shared_assets/fonts/`
2. For each duplicate group: move the canonical copy to `_shared_assets/fonts/` and replace originals with symlinks
3. Run: `node pipeline/dedup_landing_fonts.js --dry-run` first to preview changes
4. Only execute after reviewing the dry-run output — this operation is irreversible without git

> ⚠️ The `landing-page/` is the raw snapshot store used by the download pipeline. Symlinking is safer than deleting copies, but should still be approved before running.
