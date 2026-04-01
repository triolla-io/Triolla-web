"use client";

interface PortfolioItem {
  logo: string;
  desktopImg: string;
  mobileImg: string;
  title: string;
  description: string;
  tags: string[];
}

interface PortfolioListProps {
  items: PortfolioItem[];
  buttonText: string;
  buttonLink: string;
  partnerCount: string;
}

export function PortfolioList({
  items,
  buttonText,
  buttonLink,
  partnerCount,
}: PortfolioListProps) {
  return (
    <div className="portfoli_lists">
      <ul>
        {items.map((item, idx) => (
          <li
            key={idx}
            className={`rownumber${idx + 1} ${idx % 2 === 0 ? "odd" : "even"} cf`}
          >
            <div
              className={`protfolio_img protfolio_img${idx + 1} proheight1 show`}
            >
              <div className="postfol_li_img">
                <img className="one" alt="" src={item.desktopImg} />
                <img className="two" alt="" src={item.mobileImg} />
              </div>
            </div>
            <div className="protfolio_con proheight1 show">
              <div className="protfolio_con_in">
                <div className="protolio_log">
                  <img src={item.logo} alt={item.title} />
                </div>
                <div className="protolio_txt">
                  <div className="portfolio_bold">
                    <p>{item.title}</p>
                  </div>
                  <p>{item.description}</p>
                </div>
                <div className="protolio_tags">
                  {item.tags.map((tag, tagIdx) => (
                    <a key={tagIdx} href="javascript:void(0);">
                      #{tag}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="clr"></div>
          </li>
        ))}
      </ul>
      <div className="clr"></div>

      <div className="partners_with_space">
        <div className="partners_with show">
          <p>{partnerCount}</p>
          <div className="partners_with_but">
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
