"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface FooterHeProps {
  assetBase?: string;
}

/**
 * Hebrew Footer Component
 * Generated from home-he-body.html footer structure
 * Includes RTL layout and Hebrew content
 */
export function FooterHe({ assetBase = "/assets/about-us-he" }: FooterHeProps) {
  const footerTopRef = useRef<HTMLDivElement>(null);
  const footerMenuWrapRef = useRef<HTMLDivElement>(null);
  const footerBottomRef = useRef<HTMLDivElement>(null);

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

    if (footerTopRef.current) observer.observe(footerTopRef.current);
    if (footerMenuWrapRef.current) observer.observe(footerMenuWrapRef.current);
    if (footerBottomRef.current) observer.observe(footerBottomRef.current);

    return () => {
      if (footerTopRef.current) observer.unobserve(footerTopRef.current);
      if (footerMenuWrapRef.current) observer.unobserve(footerMenuWrapRef.current);
      if (footerBottomRef.current) observer.unobserve(footerBottomRef.current);
    };
  }, []);

  return (
    <footer className="footer" dir="rtl">
      <div className="footer_inner">
        <div className="footer_wrap">
          {/* Mobile CTA Section */}
          <div className="footmobdiv">
            <h5>דברו איתנו</h5>
            <div className="footmobdivin">
              <div className="fmobinlft">
                <a
                  className="one"
                  href="https://calendly.com/triolla/pitangoux-introductory-meeting-clone"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img alt="" src={`/assets/_shared/calenderimg.svg`} /> קבעו שיחה
                </a>
                <a
                  className="two"
                  href="https://triolla.io/he/contact-us/"
                >
                  צור קשר
                </a>
              </div>
              <div className="fmobinright">
                <a
                  className="one"
                  href="https://wa.me/+972525956644?text="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img alt="" src={`/assets/_shared/footerwhatsmob.svg`} />
                </a>
                <a
                  className="two"
                  href="tel:+972-73-744-3322"
                >
                  <img alt="" src={`/assets/_shared/footerphmob.svg`} />
                </a>
              </div>
              <div className="clr"></div>
            </div>
          </div>

          {/* Footer Top - Mentions Section */}
          <div className="footer_top cf" ref={footerTopRef}>
            <div className="footer_logo_label">אזכורים:</div>
            <div className="footer_logos">
              <ul>
                <li>
                  <a href="https://13tv.co.il/item/special/recommended/economy/k2fy3-902776824/" target="_blank" rel="noopener noreferrer">
                    <span>
                      <img src={`/assets/_shared/logo_736.svg`} alt="" />
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://www.bizportal.co.il/BizTech/news/article/20015580" target="_blank" rel="noopener noreferrer">
                    <span>
                      <img src={`/assets/_shared/logo_biz_735.svg`} alt="" />
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://www.themarker.com/labels/2021-04-05/ty-article-labels/0000017f-f88a-d044-adff-fbfb48ad0000" target="_blank" rel="noopener noreferrer">
                    <span>
                      <img src={`/assets/_shared/logo_marker_731.svg`} alt="" />
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://www.globes.co.il/news/article.aspx?did=1001450720" target="_blank" rel="noopener noreferrer">
                    <span>
                      <img src={`/assets/_shared/logo_732.svg`} alt="" />
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://www.pc.co.il/featured/420350/" target="_blank" rel="noopener noreferrer">
                    <span>
                      <img src={`/assets/_shared/logo_733.svg`} alt="" />
                    </span>
                  </a>
                </li>
                <li>
                  <a href="https://www.mako.co.il/special-articles/Article-c2a83bbe7224d71026.htm" target="_blank" rel="noopener noreferrer">
                    <span>
                      <img src={`/assets/_shared/logo_mako_734.svg`} alt="" />
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Menu Section */}
          <div className="footer_all_menus" ref={footerMenuWrapRef}>
            <div className="footer_menu_wrap cf">
              <div className="footer_menu_inall">
                {/* Services Column */}
                <div className="footer_menu_col footer_menu_1">
                  <h5>שירותים</h5>
                  <ul>
                    <li><a href="https://triolla.io/he/%d7%9e%d7%95%d7%99%d7%a2%d7%93-%d7%a2%d7%99%d7%a6%d7%95%d7%91-%d7%9e%d7%95%d7%a9%d7%9f/">עיצוב ממשק משתמש</a></li>
                    <li><a href="https://triolla.io/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/">שירותים</a></li>
                    <li><a href="https://triolla.io/he/">בית</a></li>
                  </ul>
                </div>

                {/* Portfolio Column */}
                <div className="footer_menu_col footer_menu_2">
                  <h5>פורטפוליו</h5>
                  <ul>
                    <li><a href="https://triolla.io/he/%d7%a1%d7%99%d7%99%d7%91%d7%a8/">אבטחת סייבר</a></li>
                    <li><a href="https://triolla.io/he/%d7%92%d7%99%d7%99%d7%9e%d7%99%d7%a0%d7%92/">גיימינג</a></li>
                    <li><a href="https://triolla.io/he/b2c/">B2C</a></li>
                  </ul>
                </div>

                {/* Technology Column */}
                <div className="footer_menu_col footer_menu_3">
                  <h5>טכנולוגיה</h5>
                  <ul>
                    <li><a href="https://triolla.io/he/technology/">פיתוח מערכות</a></li>
                    <li><a href="https://triolla.io/he/">בית</a></li>
                  </ul>
                </div>

                {/* About Column */}
                <div className="footer_menu_col footer_menu_4">
                  <h5>אודות החברה</h5>
                  <ul>
                    <li><a href="https://triolla.io/he/about/">אודותינו</a></li>
                    <li><a href="https://triolla.io/he/">בית</a></li>
                  </ul>
                </div>

                {/* Blog Column */}
                <div className="footer_menu_col footer_menu_5">
                  <h5>הבלוג שלנו</h5>
                  <ul>
                    <li><a href="https://triolla.io/he/blog/">הבלוג</a></li>
                    <li><a href="https://triolla.io/he/">בית</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Social Section */}
          <div className="footer_socail">
            <h3><span>מדיה חברתית</span></h3>
            <ul>
              <li><a href="https://www.facebook.com/triollaofficial" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://www.linkedin.com/company/triolla-official/" target="_blank" rel="noopener noreferrer">Linkedin</a></li>
              <li><a href="https://www.instagram.com/triollaofficial/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.tiktok.com/@triolla.io" target="_blank" rel="noopener noreferrer">Tiktok</a></li>
              <li><a href="https://dribbble.com/Triolla" target="_blank" rel="noopener noreferrer">Dribble</a></li>
              <li><a href="https://www.behance.net/asaf8ac9" target="_blank" rel="noopener noreferrer">Behance</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="footer_contact">
            <h3><span>דברו איתנו</span></h3>
            <div className="footcondvin">
              <div className="foo_email">דוא"ל: <a href="mailto:fun@triolla.io">Fun@triolla.io</a></div>
              <div className="foo_office_no">משרדי TLV: <a href="tel:+972-73-744-3322">+972-73-744-3322</a></div>
              <div className="foo_office_no">משרדי ניו יורק: <a href="tel:+1-408-627-7350">+1-408-627-7350</a></div>
              <div className="foo_book">
                <a href="https://calendly.com/triolla/pitangoux-introductory-meeting-clone" target="_blank" rel="noopener noreferrer">
                  <span className="default-text">📅 קבעו שיחה</span>
                  <span className="hover-text">📅 קבעו שיחה</span>
                  <span className="button-overlay"></span>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Logos Section */}
          <div className="footmoblogos">
            <ul>
              <li><a href="https://13tv.co.il/item/special/recommended/economy/k2fy3-902776824/" target="_blank" rel="noopener noreferrer"><span><img src={`/assets/_shared/logo_736.svg`} alt="" /></span></a></li>
              <li><a href="https://www.bizportal.co.il/BizTech/news/article/20015580" target="_blank" rel="noopener noreferrer"><span><img src={`/assets/_shared/logo_biz_735.svg`} alt="" /></span></a></li>
              <li><a href="https://www.themarker.com/labels/2021-04-05/ty-article-labels/0000017f-f88a-d044-adff-fbfb48ad0000" target="_blank" rel="noopener noreferrer"><span><img src={`/assets/_shared/logo_marker_731.svg`} alt="" /></span></a></li>
              <li><a href="https://www.globes.co.il/news/article.aspx?did=1001450720" target="_blank" rel="noopener noreferrer"><span><img src={`/assets/_shared/logo_732.svg`} alt="" /></span></a></li>
              <li><a href="https://www.pc.co.il/featured/420350/" target="_blank" rel="noopener noreferrer"><span><img src={`/assets/_shared/logo_733.svg`} alt="" /></span></a></li>
              <li><a href="https://www.mako.co.il/special-articles/Article-c2a83bbe7224d71026.htm" target="_blank" rel="noopener noreferrer"><span><img src={`/assets/_shared/logo_mako_734.svg`} alt="" /></span></a></li>
            </ul>
          </div>

          {/* Footer Bottom */}
          <div className="footer_bottom cf" ref={footerBottomRef}>
            <div className="footer_logo_site">
              <Link href="/he/">
                <img src={`/assets/_shared/triolla.svg`} alt="" />
              </Link>
            </div>
            <div className="footer_copywright">
              <p>
                All rights reserved to Triolla LTD |
                <Link href="/he/%d7%9e%d7%93%d7%99%d7%a0%d7%99%d7%95%d7%aa-%d7%a4%d7%a8%d7%98%d7%99%d7%95%d7%aa/">
                  מדיניות פרטיות
                </Link>
                {" | "}
                <Link href="/he/%d7%aa%d7%a0%d7%90%d7%99-%d7%a9%d7%99%d7%9e%d7%95%d7%a9/">
                  תנאי שימוש
                </Link>
              </p>
            </div>

            {/* Mobile Social Icons */}
            <div className="footmobsocial">
              <ul>
                <li className="f_tiktok">
                  <a href="https://www.tiktok.com/@triolla.io" target="_blank" rel="noopener noreferrer">
                    <svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_473_10074)">
                        <circle cx="17.3764" cy="18.433" r="11.1635" fill="white"/>
                        <path d="M17.375 0C8.05519 0 0.5 7.55519 0.5 16.875C0.5 26.1948 8.05519 33.75 17.375 33.75C26.6948 33.75 34.25 26.1948 34.25 16.875C34.25 7.55519 26.6948 0 17.375 0ZM25.9193 15.3181C24.1274 15.3181 22.3838 14.7366 21.0414 13.7526L21.0307 20.4433C21.0296 21.683 20.6504 22.893 19.9438 23.9116C19.2371 24.9303 18.2366 25.7092 17.0758 26.1444C15.915 26.5797 14.649 26.6506 13.4468 26.3476C12.2447 26.0447 11.1635 25.3823 10.3475 24.4489C9.5316 23.5155 9.01973 22.3555 8.88023 21.1236C8.74073 19.8917 8.98023 18.6466 9.56678 17.5544C10.1533 16.4621 11.059 15.5748 12.163 15.0107C13.267 14.4466 14.5167 14.2326 15.7455 14.3972V17.6829C15.1659 17.5117 14.547 17.5273 13.9768 17.7275C13.4065 17.9277 12.9138 18.3024 12.5684 18.7984C12.2231 19.2945 12.0427 19.8866 12.0528 20.4909C12.0629 21.0953 12.263 21.681 12.6248 22.1652C12.9866 22.6494 13.4916 23.0074 14.0682 23.1884C14.6449 23.3694 15.2639 23.3643 15.8375 23.1738C16.411 22.9832 16.9101 22.6169 17.2638 22.1268C17.6174 21.6367 17.8078 21.0477 17.8079 20.4433V7.20701H21.1879C21.1879 7.82832 21.3103 8.44354 21.548 9.01755C21.7858 9.59156 22.1343 10.1131 22.5736 10.5524C23.013 10.9918 23.5345 11.3403 24.1085 11.578C24.6826 11.8158 25.2978 11.9381 25.9191 11.9381L25.9193 15.3181Z" fill="#4B4545"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_473_10074">
                          <rect width="33.75" height="33.75" fill="white" transform="translate(0.5)"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </li>
                <li className="f_instagram">
                  <a href="https://www.instagram.com/triollaofficial/" target="_blank" rel="noopener noreferrer">
                    <img src={`/assets/_shared/instagram.svg`} alt="" />
                  </a>
                </li>
                <li className="f_facebook">
                  <a href="https://www.facebook.com/triollaofficial" target="_blank" rel="noopener noreferrer">
                    <svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_473_10083)">
                        <path d="M34.25 16.875C34.25 7.55519 26.6948 0 17.375 0C8.05519 0 0.5 7.55519 0.5 16.875C0.5 25.2978 6.67098 32.279 14.7383 33.545V21.7529H10.4536V16.875H14.7383V13.1572C14.7383 8.92793 17.2576 6.5918 21.1122 6.5918C22.9585 6.5918 24.8896 6.92139 24.8896 6.92139V11.0742H22.7617C20.6655 11.0742 20.0117 12.375 20.0117 13.7095V16.875H24.6919L23.9437 21.7529H20.0117V33.545C28.0791 32.279 34.25 25.2978 34.25 16.875Z" fill="#1877F2"/>
                        <path d="M23.9452 21.7529L24.6934 16.875H20.0132V13.7095C20.0132 12.375 20.6669 11.0742 22.7632 11.0742H24.8911V6.92139C24.8911 6.92139 22.9599 6.5918 21.1137 6.5918C17.2591 6.5918 14.7397 8.92793 14.7397 13.1572V16.875H10.4551V21.7529H14.7397V33.545C15.5989 33.6798 16.4795 33.75 17.3765 33.75C18.2735 33.75 19.154 33.6798 20.0132 33.545V21.7529H23.9452Z" fill="white"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_473_10083">
                          <rect width="33.75" height="33.75" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            {/* Bottom Footer Social */}
            <div className="footer_bot_socail">
              <div className="footlangmenu">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.995 0C4.47 0 0 4.475 0 10C0 15.525 4.47 20 9.995 20C15.52 20 20 15.525 20 10C20 4.475 15.52 0 9.995 0ZM16.92 6H13.97C13.645 4.75 13.19 3.55 12.59 2.44C14.43 3.07 15.96 4.345 16.92 6ZM10 2.035C10.835 3.235 11.485 4.57 11.91 6H8.09C8.515 4.57 9.165 3.235 10 2.035ZM2.26 12C2.095 11.36 2 10.69 2 10C2 9.31 2.095 8.64 2.26 8H5.635C5.555 8.655 5.5 9.32 5.5 10C5.5 10.68 5.555 11.345 5.64 12H2.26ZM3.075 14H6.025C6.35 15.25 6.805 16.45 7.405 17.565C5.565 16.935 4.035 15.655 3.075 14ZM6.025 6H3.075C4.035 4.345 5.565 3.065 7.405 2.435C6.805 3.55 6.35 4.75 6.025 6ZM10 17.965C9.17 16.765 8.52 15.43 8.09 14H11.91C11.48 15.43 10.83 16.765 10 17.965ZM12.34 12H7.66C7.565 11.345 7.5 10.68 7.5 10C7.5 9.32 7.565 8.655 7.66 8H12.34C12.435 8.655 12.5 9.32 12.5 10C12.5 10.68 12.435 11.345 12.34 12ZM12.595 17.56C13.195 16.445 13.65 15.25 13.975 14H16.925C15.96 15.655 14.43 16.93 12.595 17.56ZM14.36 12C14.44 11.345 14.5 10.68 14.5 10C14.5 9.32 14.445 8.655 14.36 8H17.735C17.9 8.64 18 9.31 18 10C18 10.69 17.905 11.36 17.735 12H14.36Z" fill="#808080"/>
                </svg>
                <div className="menu-language-menu-container">
                  <ul className="menu">
                    <li><a href="/" role="menuitem"><span>Eng</span></a></li>
                    <li><a href="/he/" title="עברית" role="menuitem"><span>עברית</span></a></li>
                  </ul>
                </div>
              </div>
              <div className="foo_bot_socail_label">
                <a href="https://www.sqlink.com/" target="_blank" rel="noopener noreferrer">
                  חלק מ <img src={`/assets/_shared/sqlink_icon.png`} alt="" />
                </a>
              </div>
              <ul>
                <li className="f_linkedin">
                  <a href="https://www.linkedin.com/company/triolla-official/" target="_blank" rel="noopener noreferrer">
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_473_10063)">
                        <path d="M16.875 33.75C7.55662 33.75 0 26.1934 0 16.875C0 7.55662 7.55662 0 16.875 0C26.1934 0 33.75 7.55662 33.75 16.875C33.75 26.1934 26.1934 33.75 16.875 33.75Z" fill="#007EBB"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M27.8598 26.9164H23.5906V19.6451C23.5906 17.6515 22.8331 16.5374 21.2552 16.5374C19.5386 16.5374 18.6417 17.6968 18.6417 19.6451V26.9164H14.5274V13.0646H18.6417V14.9304C18.6417 14.9304 19.8788 12.6414 22.8182 12.6414C25.7563 12.6414 27.8598 14.4356 27.8598 18.1463V26.9164ZM9.61906 11.2508C8.21764 11.2508 7.08203 10.1063 7.08203 8.69474C7.08203 7.28319 8.21764 6.13867 9.61906 6.13867C11.0205 6.13867 12.1554 7.28319 12.1554 8.69474C12.1554 10.1063 11.0205 11.2508 9.61906 11.2508ZM7.49461 26.9164H11.7848V13.0646H7.49461V26.9164Z" fill="white"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_473_10063">
                          <rect width="34" height="34" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </li>
                <li className="f_tiktok">
                  <a href="https://www.tiktok.com/@triolla.io" target="_blank" rel="noopener noreferrer">
                    <svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_473_10074)">
                        <circle cx="17.3764" cy="18.433" r="11.1635" fill="white"/>
                        <path d="M17.375 0C8.05519 0 0.5 7.55519 0.5 16.875C0.5 26.1948 8.05519 33.75 17.375 33.75C26.6948 33.75 34.25 26.1948 34.25 16.875C34.25 7.55519 26.6948 0 17.375 0ZM25.9193 15.3181C24.1274 15.3181 22.3838 14.7366 21.0414 13.7526L21.0307 20.4433C21.0296 21.683 20.6504 22.893 19.9438 23.9116C19.2371 24.9303 18.2366 25.7092 17.0758 26.1444C15.915 26.5797 14.649 26.6506 13.4468 26.3476C12.2447 26.0447 11.1635 25.3823 10.3475 24.4489C9.5316 23.5155 9.01973 22.3555 8.88023 21.1236C8.74073 19.8917 8.98023 18.6466 9.56678 17.5544C10.1533 16.4621 11.059 15.5748 12.163 15.0107C13.267 14.4466 14.5167 14.2326 15.7455 14.3972V17.6829C15.1659 17.5117 14.547 17.5273 13.9768 17.7275C13.4065 17.9277 12.9138 18.3024 12.5684 18.7984C12.2231 19.2945 12.0427 19.8866 12.0528 20.4909C12.0629 21.0953 12.263 21.681 12.6248 22.1652C12.9866 22.6494 13.4916 23.0074 14.0682 23.1884C14.6449 23.3694 15.2639 23.3643 15.8375 23.1738C16.411 22.9832 16.9101 22.6169 17.2638 22.1268C17.6174 21.6367 17.8078 21.0477 17.8079 20.4433V7.20701H21.1879C21.1879 7.82832 21.3103 8.44354 21.548 9.01755C21.7858 9.59156 22.1343 10.1131 22.5736 10.5524C23.013 10.9918 23.5345 11.3403 24.1085 11.578C24.6826 11.8158 25.2978 11.9381 25.9191 11.9381L25.9193 15.3181Z" fill="#4B4545"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_473_10074">
                          <rect width="33.75" height="33.75" fill="white" transform="translate(0.5)"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </li>
                <li className="f_instagram">
                  <a href="https://www.instagram.com/triollaofficial/" target="_blank" rel="noopener noreferrer">
                    <img src={`/assets/_shared/instagram.svg`} alt="" />
                  </a>
                </li>
                <li className="f_facebook">
                  <a href="https://www.facebook.com/triollaofficial" target="_blank" rel="noopener noreferrer">
                    <svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#clip0_473_10083)">
                        <path d="M34.25 16.875C34.25 7.55519 26.6948 0 17.375 0C8.05519 0 0.5 7.55519 0.5 16.875C0.5 25.2978 6.67098 32.279 14.7383 33.545V21.7529H10.4536V16.875H14.7383V13.1572C14.7383 8.92793 17.2576 6.5918 21.1122 6.5918C22.9585 6.5918 24.8896 6.92139 24.8896 6.92139V11.0742H22.7617C20.6655 11.0742 20.0117 12.375 20.0117 13.7095V16.875H24.6919L23.9437 21.7529H20.0117V33.545C28.0791 32.279 34.25 25.2978 34.25 16.875Z" fill="#1877F2"/>
                        <path d="M23.9452 21.7529L24.6934 16.875H20.0132V13.7095C20.0132 12.375 20.6669 11.0742 22.7632 11.0742H24.8911V6.92139C24.8911 6.92139 22.9599 6.5918 21.1137 6.5918C17.2591 6.5918 14.7397 8.92793 14.7397 13.1572V16.875H10.4551V21.7529H14.7397V33.545C15.5989 33.6798 16.4795 33.75 17.3765 33.75C18.2735 33.75 19.154 33.6798 20.0132 33.545V21.7529H23.9452Z" fill="white"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_473_10083">
                          <rect width="33.75" height="33.75" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
