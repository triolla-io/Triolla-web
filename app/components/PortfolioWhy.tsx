"use client";

interface WhyItem {
  title: string;
  description: string;
}

interface PortfolioWhyProps {
  mainTitle: string;
  items: WhyItem[];
}

export function PortfolioWhy({ mainTitle, items }: PortfolioWhyProps) {
  return (
    <div className="portfolio_why">
      <div className="why_wrap show">
        <h3>{mainTitle}</h3>
        <div className="portolio_cyber_list">
          <ul className="pdesktp">
            {items.map((item, idx) => (
              <li key={idx} className={`whydesk${idx + 2}`}>
                <div className="port_cyber_con">
                  <div className="port_cyber_con_new">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <ul className="pmobile owl-carousel">
            {items.map((item, idx) => (
              <li key={idx} className={`why${idx + 2}`}>
                <div className="port_cyber_con">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
