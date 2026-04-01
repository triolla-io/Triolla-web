"use client";

import { useEffect, useRef } from "react";

interface ServicePrototypingProps {
  assetBase?: string;
}

export function ServicePrototyping({
  assetBase = "/assets/services-prototyping",
}: ServicePrototypingProps) {
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
    <div className="inner_content servdetail_content">
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
              <h1>Prototyping</h1>
            </div>
          </div>
        </div>

        {/* Feature Image */}
        <div className="post_featureimg">
          <div className="articlemidimg">
            <img
              alt=""
              src={`${assetBase}/Frame-2147224217.png`}
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
            <h2 className="first:mt-1.5">
              <strong>
                A working prototype is the bridge between vision and reality. Our
                prototyping services empower you to experience, test, and refine
                your product before a single line of code is written, giving you a
                clear path from concept to launch.
              </strong>
            </h2>
          </div>

          {/* Normal text content */}
          <div className="artnormtext">
            <h3 className="first:mt-1.5">
              We believe that prototyping is a crucial step in building successful
              digital products. By creating interactive prototypes for both mobile
              and desktop, we allow investors, developers, and real users to engage
              with your product vision early in the process. This hands-on
              experience reveals how the final product will look, feel, and
              function—long before development begins.
            </h3>

            <p className="first:mt-1.5">
              Our UX/UI team specializes in crafting realistic, interactive
              prototypes that bring your ideas to life. These prototypes are
              adaptable across platforms, enabling you to test new concepts, validate
              technical feasibility, and explore innovative features with confidence.
              Whether you're launching a brand-new product or adding functionality to
              an existing one, prototyping is the most efficient and effective way to
              evaluate your ideas and make informed decisions.
            </p>

            <p className="first:mt-1.5">
              Throughout the process, we focus on user experience, gathering feedback
              from real users and stakeholders to fine-tune every detail. Prototyping
              helps identify potential issues early, allowing you to address challenges
              and optimize the user journey before investing in full-scale development.
            </p>

            <p className="first:mt-1.5">
              The benefits of prototyping are clear. It reduces time and costs by
              catching problems early and preventing unnecessary development work. It
              leads to a higher quality product, as issues are resolved before they
              become costly mistakes. Prototypes also provide a powerful tool for
              gathering feedback, ensuring your product meets user needs and
              expectations. For those seeking investment, a working prototype is the
              most compelling way to showcase your vision and demonstrate your
              product's potential in action.
            </p>

            <p className="first:mt-1.5">
              With our prototyping services, you gain more than just a
              preview—you get a strategic advantage that accelerates development,
              improves quality, and increases your chances of success in the market.
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
