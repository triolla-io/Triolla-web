"use client";

import { Fragment } from "react";

interface WhyItem {
  title: string;
  description: string;
}

interface PortfolioWhyProps {
  mainTitle: string;
  items: WhyItem[];
}

/** Matches Triolla snapshot headings that use `<br>` / `<br />` for line breaks. */
function textWithOptionalBr(text: string) {
  const parts = text.split(/<br\s*\/?>/i);
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 ? <br /> : null}
      {part}
    </Fragment>
  ));
}

export function PortfolioWhy({ mainTitle, items }: PortfolioWhyProps) {
  return (
    <div className="portfolio_why">
      <div className="why_wrap show">
        <h3>{textWithOptionalBr(mainTitle)}</h3>
        <div className="portolio_cyber_list">
          <ul className="pdesktp">
            {items.map((item, idx) => (
              <li key={idx} className={`whydesk${idx + 2}`}>
                <div className="port_cyber_con">
                  <div className="port_cyber_con_new">
                    <h4>{textWithOptionalBr(item.title)}</h4>
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
                  <h4>{textWithOptionalBr(item.title)}</h4>
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
