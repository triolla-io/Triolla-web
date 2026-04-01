/**
 * Theme CSS keeps `.port_faq_top` and accordion cues hidden until `.portfolio_faq_wrap.show`
 * (scroll/reveal scripts add it on WordPress). Snapshots that already embed the FAQ block
 * must get this class on the client or the heading, subtitle, and +/- icons stay invisible.
 */
export function ensurePortfolioFaqWrapShown(root: HTMLElement): void {
  root.querySelectorAll(".portfolio_faq_wrap").forEach((wrap) => {
    if (wrap.querySelector(".port_faq_sec")) wrap.classList.add("show");
  });
}

/**
 * Replaces stripped inline jQuery handlers on .faqtitle a (slideToggle + .active).
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function mountTriollaFaqAccordion(root: HTMLElement): () => void {
  const $ = (window as any).jQuery;
  if (!$) return () => {};

  const $root = $(root);
  const handler = function (this: HTMLElement, e: Event) {
    e.preventDefault();
    const $a = $(this);
    const $box = $a.parent().parent();
    if ($box.hasClass("active")) {
      $box.removeClass("active");
      $a.parent().next().slideUp(350);
    } else {
      $root.find(".faqtitle a").parent().parent().removeClass("active");
      $root.find(".faqdetail").slideUp(350);
      $box.addClass("active");
      $a.parent().next().slideDown(350);
    }
  };

  $root.find(".faqtitle a").on("click.triollaFaq", handler);

  return () => {
    $root.find(".faqtitle a").off("click.triollaFaq", handler);
  };
}
