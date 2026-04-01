"use client";

import { ensurePortfolioFaqWrapShown } from "./mountTriollaFaqAccordion";

/**
 * Inject shared FAQ + pre-footer strip (`bottom_com_sec` / `blogmidbot`) before `.footer`.
 * Hebrew snapshots often ship embedded English FAQ from the EN mirror — replace when the title is not Hebrew.
 */
export async function injectSharedFaq(
  root: HTMLElement,
  lang: "en" | "he",
): Promise<void> {
  const faqFragmentUrl =
    lang === "he" ? "/fragments/_shared-faq-he.html" : "/fragments/_shared-faq.html";

  const existingFaqBlock = root.querySelector(".portfolio_faq");
  if (existingFaqBlock?.querySelector(".port_faq_sec")) {
    if (lang === "en") {
      ensurePortfolioFaqWrapShown(root);
      return;
    }
    const heading =
      existingFaqBlock.querySelector(".port_faq_top h3")?.textContent ?? "";
    if (/[\u0590-\u05FF]/.test(heading)) {
      ensurePortfolioFaqWrapShown(root);
      return;
    }
    existingFaqBlock.remove();
  }

  try {
    const faqRes = await fetch(faqFragmentUrl);
    if (!faqRes.ok) return;
    const faqHtml = await faqRes.text();

    const oldFaq = root.querySelector(".port_faq_top");
    if (oldFaq) {
      let parent = oldFaq.parentElement;
      while (parent && !parent.classList.contains("port_faq_sec")) {
        parent = parent.parentElement;
      }
      if (parent) parent.remove();
    }

    const footer = root.querySelector(".footer");
    if (footer) {
      footer.insertAdjacentHTML("beforebegin", faqHtml);
    } else {
      root.insertAdjacentHTML("beforeend", faqHtml);
    }
    ensurePortfolioFaqWrapShown(root);
  } catch (e) {
    console.warn("Failed to inject shared FAQ:", e);
  }
}

/**
 * Many Hebrew snapshot fragments still embed the English `#contactus` strip. Normalize copy in-place.
 */
export function localizeContactStripForHebrew(root: HTMLElement): void {
  const strip = root.querySelector(".blogmidbot");
  if (!strip) return;

  const pairs: [string, string][] = [
    ["Wanna Chat? Get In Touch", "רוצים לדבר? צרו קשר"],
    ["Trusted by 1000+ companies:", "זוכה לאמון של יותר מ-1000 חברות:"],
    ["Give us a call:", "התקשרו אלינו:"],
    ["TLV ", "תל אביב "],
    ["NY & SF", "ניו יורק וסן פרנסיסקו"],
    ["Mail:", "אימייל:"],
    ["HQ Address:", "כתובת המשרד:"],
    ["Schedule a<Br /> Free Consultation", "תאמו<Br /> פגישת ייעוץ חינם"],
    ["Schedule a<br /> Free Consultation", "תאמו<br /> פגישת ייעוץ חינם"],
    ["Schedule a<Br/> Free Consultation", "תאמו<Br/> פגישת ייעוץ חינם"],
    ["Let&#039;s Go!", "שלחו"],
    ["(Required)", "(חובה)"],
    [">Full Name<span", ">שם מלא<span"],
    ["placeholder='Full Name'", "placeholder='שם מלא'"],
    ["for='input_1_1'>Full Name", "for='input_1_1'>שם מלא"],
    [">Phone<span", ">טלפון<span"],
    ["placeholder='Phone'", "placeholder='טלפון'"],
    ["for='input_1_3'>Phone", "for='input_1_3'>טלפון"],
    [">Email<span", ">אימייל<span"],
    ["placeholder='Email'", "placeholder='אימייל'"],
    ["for='input_1_4'>Email", "for='input_1_4'>אימייל"],
    [
      "This field is for validation purposes and should be left unchanged.",
      "שדה לבדיקה; יש להשאיר ריק.",
    ],
  ];

  let html = strip.innerHTML;
  for (const [from, to] of pairs) {
    if (html.includes(from)) html = html.split(from).join(to);
  }
  strip.innerHTML = html;

  strip
    .querySelectorAll('.blogmidbotlft a[href*="/cdn-cgi/l/email-protection"]')
    .forEach((a) => {
      a.setAttribute("href", "mailto:fun@triolla.io");
      a.replaceChildren();
      a.appendChild(document.createTextNode("Fun@triolla.io"));
    });
}

export async function injectSharedFooter(root: HTMLElement): Promise<void> {
  try {
    const footerRes = await fetch("/fragments/_shared-footer.html");
    if (!footerRes.ok) return;
    const footerHtml = await footerRes.text();

    const oldFooter = root.querySelector(".footer");
    if (oldFooter) oldFooter.remove();

    root.insertAdjacentHTML("beforeend", footerHtml);
  } catch (e) {
    console.warn("Failed to inject shared footer:", e);
  }
}
