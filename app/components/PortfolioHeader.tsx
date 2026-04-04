"use client";

import { useEffect } from "react";

interface PortfolioHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  description: string;
  expandedText: string;
  buttonText: string;
  buttonLink: string;
  bannerGridImg: string;
  bannerLayerImg: string;
  jumpImg1: string;
  jumpImg2: string;
  jumpImg3: string;
}

export function PortfolioHeader({
  eyebrow = "Product design for",
  title,
  subtitle,
  description,
  expandedText,
  buttonText,
  buttonLink,
  bannerGridImg,
  bannerLayerImg,
  jumpImg1,
  jumpImg2,
  jumpImg3,
}: PortfolioHeaderProps) {
  useEffect(() => {
    const toggleDown = document.querySelector(".ban_toggle_down");
    const toggleUp = document.querySelector(".ban_toggle_up");
    const moreText = document.querySelector(".more_ban_txt");

    if (toggleDown && toggleUp && moreText) {
      toggleDown.addEventListener("click", () => {
        (moreText as HTMLElement).style.display = "block";
        (toggleDown as HTMLElement).style.display = "none";
      });

      toggleUp.addEventListener("click", () => {
        (moreText as HTMLElement).style.display = "none";
        (toggleDown as HTMLElement).style.display = "block";
      });
    }
  }, []);

  return (
    <div className="portfolio_banner">
      <div className="banner_grid">
        <img alt="Triolla" src={bannerGridImg} fetchPriority="high" decoding="async" />
      </div>
      <div className="banner_grid_layer">
        <img alt="" src={bannerLayerImg} />
      </div>
      <div className="portfolio_wrap">
        <div className="portfolio_text show">
          <div className="portfolio_jump_1">
            <img alt="" src={jumpImg1} />
          </div>
          <div className="portfolio_jump_2">
            <img alt="" src={jumpImg2} />
          </div>
          <div className="portfolio_jump_3">
            <img alt="" src={jumpImg3} />
          </div>

          <h4>{eyebrow}</h4>
          <h1 style={{ whiteSpace: "pre-line" }}>{title}</h1>
          <div className="portfolio_con">
            <div className="portfolio_con_bold">{subtitle}</div>
            <p>
              {description}
              <span className="dotshave">...</span>
              <button
                type="button"
                className="ban_toggle_down"
                aria-label="Show more description"
              >
                <svg
                  width="16"
                  height="9"
                  viewBox="0 0 16 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.25749 8.24168L1.25749 2.24168C0.847439 1.83163 0.847439 1.16681 1.25749 0.756757C1.66754 0.346706 2.33236 0.346706 2.74241 0.756757L7.99995 6.01429L13.2575 0.756757C13.6675 0.346706 14.3324 0.346706 14.7424 0.756757C15.1525 1.16681 15.1525 1.83163 14.7424 2.24168L8.74241 8.24168C8.33236 8.65173 7.66754 8.65173 7.25749 8.24168Z"
                    fill="black"
                  />
                </svg>
              </button>
            </p>
            <div className="more_ban_txt" style={{ display: "none" }}>
              <p>
                {expandedText}
                <button
                  type="button"
                  className="ban_toggle_up"
                  aria-label="Show less description"
                >
                  <svg
                    width="16"
                    height="9"
                    viewBox="0 0 16 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.25749 8.24168L1.25749 2.24168C0.847439 1.83163 0.847439 1.16681 1.25749 0.756757C1.66754 0.346706 2.33236 0.346706 2.74241 0.756757L7.99995 6.01429L13.2575 0.756757C13.6675 0.346706 14.3324 0.346706 14.7424 0.756757C15.1525 1.16681 15.1525 1.83163 14.7424 2.24168L8.74241 8.24168C8.33236 8.65173 7.66754 8.65173 7.25749 8.24168Z"
                      fill="black"
                    />
                  </svg>
                </button>
              </p>
            </div>
          </div>

          <div className="postfolio_banner_but">
            <a href={buttonLink}>
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
