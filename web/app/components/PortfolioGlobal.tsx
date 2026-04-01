"use client";

interface ClientLogo {
  img: string;
  alt: string;
}

interface PortfolioGlobalProps {
  title: string;
  subtitle: string;
  logos: ClientLogo[];
  buttonText: string;
  buttonLink: string;
}

export function PortfolioGlobal({
  title,
  subtitle,
  logos,
  buttonText,
  buttonLink,
}: PortfolioGlobalProps) {
  return (
    <div className="portfolio_global">
      <div className="global_logos grid">
        {logos.map((logo, idx) => (
          <div key={idx} className={`g_logo g_logo${idx + 1} grid__item`}>
            <div className="grid__item-img">
              <img src={logo.img} alt={logo.alt} data-speed="-5" />
            </div>
          </div>
        ))}
      </div>
      <div className="global_con show">
        <div className="global_wrap">
          <h2>{title}</h2>
          <h3>{subtitle}</h3>
          <div className="global_but">
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
