/**
 * WordPress Hebrew blog URLs sometimes use a Hebrew slug path segment.
 * Canonical in-app URLs use the same English slug as /blog/<slug>/ (and triolla.io/blog/...).
 * Keys: decoded pathname segment (e.g. כיצד-להשתמש-באנימציה-כדי-לשפר-את-ה-ux).
 */
export const HEBREW_BLOG_SLUG_TO_ENGLISH_SLUG: Record<string, string> = {
  // Numeric / Latin-prefix slugs
  "10-כללי-עיצוב-ממשק-משתמש-ux-ui-שאסור-להפר":
    "10-ux-ui-design-rules-you-should-never-break",
  "10-עקרונות-לשימוש-בצבעים-בעיצוב-ממשק-משת":
    "10-principles-for-using-color-in-ux-ui-design",
  "5-דוגמאות-לאנימציה-נכונה-באתרי-אינטרנט":
    "5-examples-of-web-animation-done-right",
  "amazon-מציגה-עיצוב-חדש-ועדכני-לאפליקציית-prime-video":
    "amazon-unveils-a-fresh-modern-design-for-the-prime-video-app",
  "clutch-מכירה-ב-triolla-כאחת-מחברות-עיצוב-חוויית-המ":
    "clutch-recognizes-triolla-among-the-top-ux-design-companies-for-2021",
  "go-mobile-conference-7-אנימציה-בממשקי-משתמש-ui-animation":
    "go-mobile-conference-7-ui-animation",
  "power-users-ההצלחה-של-האפליקציה-שלכם-איך-עושים-א":
    "power-users-the-key-to-your-apps-success-how-to-make-it-happen",
  "prompt-engineering-לעיצוב-ux-ui-איך-להשתמש-בפרומפטים-כדי-ל":
    "prompt-engineering-for-ux-ui-design-how-to-use-prompts-to-elevate-your-design-process",
  "prompt-engineering-לעיצוב-ux-ui-איך-להשתמש-בפרומפטים-כדי-ל-2":
    "prompt-engineering-for-ux-ui-design-how-to-use-prompts-to-elevate-your-design-process",
  "user-journey-איך-עושים-את-זה-נכון": "user-journey-how-to-do-it-right",
  // Hebrew-initial slugs (א–ת)
  "איך-design-system-הופך-כל-מוצר-דיגיטלי-למכונה-משומ":
    "how-a-design-system-can-transform-your-digital-product-essential-insights-for-ux-ui-designers",
  "איך-ux-ui-ישפיע-על-העתיד-הטכנולוגי-שלנו":
    "how-will-ux-ui-shape-our-technological-future",
  "איך-להקדים-את-כולם-סקירת-מגמות-עיקריות":
    "ahead-of-the-curve-key-ux-ui-developments-to-watch-in-2024",
  "איך-ליצור-אנימציה-באינטרנט-בצורה-נכונ":
    "how-to-create-web-animation-the-right-way",
  "איך-סוכנות-ה-ux-ui-המובילה-בתעשייה-יכולה-לה":
    "how-the-industrys-leading-ux-ui-agency-can-also-be-a-boutique-ux-studio",
  "איך-תוכלו-להתכונן-לראיון-מנהל-מוצר":
    "how-to-prepare-for-a-product-manager-interview",
  "אם-ux-זה-החיים-עצמם-צריך-לעצב-אותו-עבור-בנ":
    "if-ux-is-life-itself-it-must-be-designed-for-people-everywhere-and-always",
  "אנימציה-בעיצוב-ממשק-משתמש-מרעיון-למצי":
    "animation-in-ui-design-from-concept-to-reality",
  "בואו-נדבר-על-microcopy-איך-טקסטים-קטנים-יוצרים":
    "lets-talk-microcopy-how-small-words-create-a-big-user-experience-in-ux-ui-design",
  "האם-עיצוב-יכול-להיות-ידידותי-מדי-בודקי":
    "can-design-be-too-user-friendly-exploring-the-limits-of-ux-ui-in-product-design",
  "האפליקציה-החכמה-של-תדיראן-חדשנות-פורצ":
    "tadirans-smart-home-app-design-that-makes-innovation-accessible",
  "הדרך-הקלה-והפשוטה-לקבל-משוב-ממשתמשי-המ":
    "the-easy-and-effective-way-to-collect-feedback-from-your-product-users",
  "ההבדל-האמיתי-בין-pm-ל-po":
    "the-real-difference-between-a-product-manager-pm-and-a-product-owner-po",
  "ההמלצות-הכי-חמות-לעיצוב-ui-לדשבורד":
    "the-hottest-ui-design-tips-for-dashboards",
  "המדריך-product-roadmap": "the-guide-product-roadmap",
  "המדריך-המלא-לעיצוב-אפליקציות-סייבר-מצ":
    "the-essential-guide-to-designing-a-top-performing-cyber-app-mastering-cyber-ux",
  "השאלות-החשובות-לבחינהלפני-פגישה-עם-חב":
    "the-essential-questions-to-consider-before-meeting-with-a-ux-ui-design-agency",
  "חברת-ui-משפרים-את-סיכויי-ההצלחה-של-המוצר":
    "ui-company-boosting-your-products-chances-of-success",
  "חוויית-משתמש-ראשונית-ftue": "ftue-first-time-user-experience",
  "טיפ-של-מקצוענים-איך-לשפר-עיצוב-דפי-נחית":
    "pro-tip-how-to-improve-landing-page-design",
  "כיצד-להשתמש-באנימציה-כדי-לשפר-את-ה-ux":
    "how-to-use-animation-to-improve-ux",
  "כיצד-עיצוב-חווית-משתמש-משפר-את-הצלחת-סט":
    "how-user-experience-design-drives-startup-success-tips-for-building-winning-digital-products",
  "כל-מה-שרציתם-לדעת-על-ux-ui-שאלות-ותשובות": "uxui-faqs",
  "כל-מה-שרציתם-לדעת-על-wireframes":
    "everything-you-need-to-know-about-wireframes",
  "כלי-prototyping-למעצבי-חווית-משתמש":
    "prototyping-tools-for-ux-designers",
  "לגזור-ולשמור-השאלות-שכל-יזם-ומנהל-מוצר":
    "the-questions-every-entrepreneur-and-product-manager-must-be-able-to-answer-in-a-kickoff-meeting",
  "להיות-מומחה-ux-בתחום-הפינטק-מה-זה-אומר":
    "ux-fintech-expert-what-does-it-mean",
  "למה-ux-survey-הוא-שלב-הכרחי-באפיון":
    "why-is-a-ux-survey-a-crucial-step-in-product-definition",
  "מאחורי-ההגה-היבטים-בעיצוב-חווית-משתמש":
    "behind-the-wheel-ux-design-aspects-for-smart-cars",
  "מגמות-סיור-מוצרים-של-saas-כיצד-חברות-מעולו":
    "saas-product-tour-trends-how-great-companies-onboard-users-in-2018",
  "מגמות-עיצוב-ux-לשנת-2018": "ux-design-trends-for-2018",
  "מדוע-ux-ui-יוצרים-בצוות": "why-is-ux-ui-created-as-a-team-effort",
  "מדוע-כל-חברה-כיום-נדרשת-לדשבורד-מותאם-ל":
    "why-every-company-today-needs-a-custom-dashboard-for-business-management-and-control",
  "מדריך-מקיף-לשליטה-בעיצוב-אפליקציות-מו":
    "a-comprehensive-guide-to-mastering-mobile-app-design-for-israeli-startups-and-companies",
  "מה-זה-ooux-היכרות-עם-עקרונות-object-oriented-ux-בעיצוב-מוצ":
    "what-is-ooux-understanding-object-oriented-ux-in-product-and-interface-design",
  "מהפכה-בתחום-הבריאות-עם-עיצוב-ux":
    "revolutionizing-healthcare-with-ux-design",
  "מומחה-ux-לפינטק-מה-זה-בעצם-אומר":
    "what-does-it-mean-to-be-a-ux-expert-in-fintech",
  "מנהלי-מוצר-חייבים-להבין-איך-טיקטוק-כה":
    "product-managers-must-understand-why-is-tiktok-so-addictive",
  "מנהלי-מוצר-חייבים-להבין-איך-טיקטוק-כה-מ":
    "product-managers-must-understand-why-is-tiktok-so-addictive",
  "מנהלי-מוצר-נהלו-את-תהליך-עיצוב-המוצר-ש":
    "product-managers-manage-your-product-design-process-with-these-simple-steps",
  "מעבר-לגרפיקה-עיצוב-חווית-משתמש-מעמיקה":
    "beyond-graphics-deep-user-experience-design-for-tomorrows-gaming-apps",
  "מעצב-ux-או-ux-design": "ux-designer-or-ux-design",
  "מעצבים-in-house-או-חברת-ux-ui-כל-מה-שאתם-צריכים-לד":
    "in-house-designers-or-a-ux-ui-agency-everything-you-need-to-know",
  "מקסם-את-הפוטנציאל-של-iot-עם-עיצוב-חווית-מש":
    "maximize-the-potential-of-iot-with-user-experience-design-by-triolla-ux",
  "עיצוב-ux-ui-הדרך-האמיתית-להצליח-להניע-את-הי":
    "ux-ui-design-the-real-way-to-motivate-your-users",
  "עיצוב-חווית-משתמש-ux-זה-עיצוב-החיים-עצמם":
    "user-experience-ux-design-is-the-design-of-life-itself",
  "עיצוב-חווית-משתמש-בעולם-האגריטק-מוצרי":
    "user-experience-design-in-agritech-products-for-the-agriculture-industry",
  "עיצוב-חווית-משתמש-לאפליקציות-שהיא-לא-פ":
    "user-experience-design-for-apps-thats-nothing-short-of-excellent",
  "פרויקט-מורכב-הופך-לפשוט-עם-ux-canvas":
    "a-complex-project-becomes-simple-with-the-ux-canvas",
  "שיטות-עבודה-מומלצות-לעיצוב-כרטיסים": "best-practices-for-cards",
  "שיטות-עבודה-מומלצות-לעיצוב-מובייל": "mobile-design-best-practices",
  "שיטות-עבודה-מומלצות-לעיצוב-מינימליסט":
    "best-practices-for-minimalist-design",
  "תהליך-onboarding-במוצרי-saas-איך-החברות-הגדולות-עו":
    "onboarding-process-in-saas-products-how-the-big-companies-do-it",
  "תהליך-עיצוב-המוצר-האולטימטיבי-השיטה-ה":
    "the-ultimate-product-design-process-the-best-practice-used-by-google-facebook-netflix-etc",
  "תנו-בוסט-למערכת-העיצוב-שלכם-עם-figma-ו-triolla":
    "power-up-your-design-system-with-figma-and-triolla",
  "תשע-דוגמאות-לחדשנות-בעיצוב-ux-למובייל-ב-2019":
    "nine-examples-of-mobile-ux-innovation-in-2019",
};
