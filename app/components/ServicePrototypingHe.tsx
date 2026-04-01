"use client";

import { useEffect, useRef } from "react";

interface ServicePrototypingHeProps {
  assetBase?: string;
}

export function ServicePrototypingHe({
  assetBase = "/assets/services-prototyping-he",
}: ServicePrototypingHeProps) {
  const bannerRef = useRef<HTMLDivElement>(null);
  const articleMidRef = useRef<HTMLDivElement>(null);
  const gridImageRef = useRef<HTMLDivElement>(null);

  const sharedAssetBase = "/assets/_shared";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (bannerRef.current) observer.observe(bannerRef.current);
    if (articleMidRef.current) observer.observe(articleMidRef.current);
    if (gridImageRef.current) observer.observe(gridImageRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div dir="rtl" className="inner_content servdetail_content">
      {/* Portfolio Banner Section */}
      <div
        ref={bannerRef}
        className="portfolio_banner show"
        style={{
          opacity: 1,
          transition: "opacity 0.6s ease-in-out",
          color: "#fff",
        }}
      >
        <div className="banner_grid">
          <img
            alt="Triolla"
            src={`${sharedAssetBase}/banner_grid.svg`}
          />
        </div>

        <div className="portfolio_wrap">
          <div className="portfolio_text">
            {/* Jumping animation elements */}
            <div className="portfolio_jump_1">
              <img
                alt=""
                src={`${assetBase}/jumping_1-1.svg`}
              />
            </div>
            <div className="portfolio_jump_2">
              <img
                alt=""
                src={`${assetBase}/jumping_2-1.svg`}
              />
            </div>
            <div className="portfolio_jump_3">
              <img
                alt=""
                src={`${assetBase}/jumping_3-1.svg`}
              />
            </div>

            {/* Title */}
            <div className="artoptext">
              <h1>יצירת אב טיפוס &#8211; פרוטוטייפ</h1>
            </div>
          </div>
        </div>

        {/* Feature Image */}
        <div className="post_featureimg">
          <div className="articlemidimg">
            <img
              alt=""
              src={`${assetBase}/Frame-213673.jpg`}
            />
          </div>
        </div>
      </div>

      {/* Article Mid Content Section */}
      <div
        ref={articleMidRef}
        className="articlemid show"
        style={{
          opacity: 1,
          transition: "opacity 0.6s ease-in-out",
          color: "#fff",
        }}
      >
        <div className="artlemidtxt">
          {/* Bold introduction */}
          <div className="artbold">
            <h2 style={{ direction: "rtl" }}>
              כל מותג בלתי נשכח מתחיל ברעיון יצירתי נועז. הצוות שלנו מתמחה בהפיכת
              ניצוצות של השראה לרעיונות מגובשים שמושכים תשומת לב ומייצרים מעורבות
              אמיתית. באמצעות שילוב של אינטואיציה יצירתית עם הכלים המתקדמים ביותר
              בתחום המחקר והעיצוב מונעי AI, אנו עוזרים לך לגלות את הסיפור הייחודי של
              המותג שלך.
            </h2>
          </div>

          {/* Normal text content */}
          <div className="artnormtext">
            <h3 style={{ direction: "rtl" }}>
              אנחנו מאמינים שיצירת פרוטוטייפ היא שלב חיוני בבניית מוצרים דיגיטליים
              מצליחים. באמצעות יצירת פרוטוטייפים אינטראקטיביים למובייל ולדסקטופ,
              נאפשר למשקיעים, למפתחים ולמשתמשים אמיתיים לחוות את החזון של המוצר שלך כבר
              בשלבים מוקדמים. החוויה המעשית הזו תחשוף כיצד המוצר הסופי ייראה, ירגיש
              ויתפקד &#8211; הרבה לפני שהפיתוח יתחיל.
            </h3>

            <p>&nbsp;</p>

            <p style={{ textAlign: "right" }}>
              במהלך התהליך אנו שומרים על תהליך יצירתי פתוח ודינמי, תוך שימוש במערכות
              עיצוב חכמות ובתובנות מבוססות נתונים. הצוות שלנו בוחן, מנסה ומשכלל רעיונות,
              עד שכל קונספט מגיע לרמת הביצוע הגבוהה ביותר. בין אם אנו מפתחים סיפור מותג,
              יוצרים שפה חזותית חדשה או מנסחים את המסר המרכזי שלך, כל מהלך נשען על
              שילוב בין יצירתיות אסטרטגית לבין הבנה עמוקה של הצרכים העסקיים שלך.
            </p>

            <p style={{ textAlign: "right" }}>
              בסיום התהליך תקבל כיוון קריאייטיבי ברור ומערך רעיונות מגובש, שייתן השראה
              לצוות שלך, יעניק אנרגיה חדשה לפעילות השיווקית ויחזק את הנוכחות של המותג
              שלך בעולם.
            </p>

            <p>&nbsp;</p>
            <p>&nbsp;</p>

            {/* Related Services Section */}
            <p style={{ textAlign: "center" }}>
              <strong>שירותים נוספים שיכולים לעזור לכם:</strong>
            </p>

            <p style={{ textAlign: "center" }}>
              <a href="https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%9e%d7%97%d7%a7%d7%a8-ux/">
                <span style={{ fontWeight: 400 }}>מחקר חווית משתמש</span>
              </a>
              <span style={{ fontWeight: 400 }}> | </span>
              <a href="https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%a2%d7%99%d7%a6%d7%95%d7%91-ui/">
                <span style={{ fontWeight: 400 }}>עיצוב UI</span>
              </a>
              <span style={{ fontWeight: 400 }}> | </span>
              <a href="https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/wireframing/">
                <span style={{ fontWeight: 400 }}>אפיון Wireframe</span>
              </a>
              <span style={{ fontWeight: 400 }}> | </span>
              <a href="https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%a4%d7%a8%d7%95%d7%98%d7%95%d7%98%d7%99%d7%99%d7%a4/">
                <span style={{ fontWeight: 400 }}>יצירת פרוטוטייפ</span>
              </a>
              <span style={{ fontWeight: 400 }}> | </span>
              <a href="https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%91%d7%93%d7%99%d7%a7%d7%95%d7%aa-%d7%a9%d7%9e%d7%99%d7%a9%d7%95%d7%aa/">
                <span style={{ fontWeight: 400 }}>בדיקות משתמשים</span>
              </a>
              <span style={{ fontWeight: 400 }}> | </span>
              <a href="https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/%d7%99%d7%a6%d7%99%d7%a8%d7%aa-%d7%93%d7%99%d7%96%d7%99%d7%99%d7%9f-%d7%a1%d7%99%d7%a1%d7%98%d7%9d-2/">
                <span style={{ fontWeight: 400 }}>בניית Design System</span>
              </a>
              <span style={{ fontWeight: 400 }}> | </span>
              <a href="https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/product-stars/">
                <span style={{ fontWeight: 400 }}>ייעוץ ניהול מוצר</span>
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Grid Images Section */}
      <div
        className="bottom_com_sec show"
        ref={gridImageRef}
        style={{
          opacity: 1,
          transition: "opacity 0.6s ease-in-out",
          color: "#fff",
        }}
      >
        <div className="port_gridimage_sec">
          <div className="port_gridimage_space"></div>
          <div className="port_gridimage_sec_inner">
            <div className="port_gridimage_in">
              <div className="gridmain">
                <div className="grid">
                  <div className="gridimgs grid__item">
                    <div className="grid__item-img">
                      <img
                        alt=""
                        src={`${assetBase}/grid_all.png`}
                        data-speed="-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
