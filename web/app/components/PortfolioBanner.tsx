'use client';

import { useEffect, useRef } from 'react';

interface PortfolioBannerProps {
  title?: string;
  assetPath?: string;
  bannerGridSrc?: string;
  jumping1Src?: string;
  jumping2Src?: string;
  jumping3Src?: string;
  featureImgSrc?: string;
}

export function PortfolioBanner({
  title = 'Portfolio',
  assetPath = '/assets/default',
  bannerGridSrc,
  jumping1Src,
  jumping2Src,
  jumping3Src,
  featureImgSrc,
}: PortfolioBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  // Default asset paths if not provided
  const gridSrc = bannerGridSrc || `${assetPath}/banner_grid.svg`;
  const jump1Src = jumping1Src || `${assetPath}/jumping_1-1.svg`;
  const jump2Src = jumping2Src || `${assetPath}/jumping_2-1.svg`;
  const jump3Src = jumping3Src || `${assetPath}/jumping_3-1.svg`;
  const featureSrc = featureImgSrc || `${assetPath}/Frame-2147224204.png`;

  useEffect(() => {
    if (bannerRef.current) {
      // Trigger any animations or interactions tied to portfolio banner
      const elements = bannerRef.current.querySelectorAll('[class*="enter-y"]');
      elements.forEach((el) => {
        el.classList.add('show');
      });
    }
  }, []);

  return (
    <div className="portfolio_banner" ref={bannerRef}>
      <div className="banner_grid">
        <img alt="Triolla" src={gridSrc} />
      </div>
      <div className="portfolio_wrap">
        <div className="portfolio_text">
          <div className="portfolio_jump_1">
            <img alt="" src={jump1Src} />
          </div>
          <div className="portfolio_jump_2">
            <img alt="" src={jump2Src} />
          </div>
          <div className="portfolio_jump_3">
            <img alt="" src={jump3Src} />
          </div>
          <div className="artoptext">
            <h1>{title}</h1>
          </div>
        </div>
      </div>
      <div className="post_featureimg">
        <div className="articlemidimg">
          <img alt="" src={featureSrc} />
        </div>
      </div>
    </div>
  );
}
