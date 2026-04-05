/**
 * Inline $(document).ready() blocks that called .owlCarousel() were stripped from the body
 * fragment. Without this, .learslider / .bullet_slider / .abmobile stay unstyled lists (1 column).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

function triollaSnapshotIsRtl(root: HTMLElement): boolean {
  if (root.classList.contains("rtl")) return true;
  return (getComputedStyle(root).direction || "ltr").toLowerCase() === "rtl";
}

export function initTriollaOwlCarousels(root: HTMLElement): void {
  const $ = (window as any).jQuery;
  if (!$?.fn?.owlCarousel) return;

  const $root = $(root);
  const rtl = triollaSnapshotIsRtl(root);

  const navPair = (prevSel: string, nextSel: string): [string, string] => {
    const prev = root.querySelector(prevSel);
    const next = root.querySelector(nextSel);
    return [prev?.outerHTML ?? "‹", next?.outerHTML ?? "›"];
  };

  const learNav = navPair(".le-prev", ".le-next");

  $root.find("ul.learslider.owl-carousel").each((_i: number, el: Element) => {
    const $el = $(el);
    if ($el.hasClass("owl-loaded")) return;
    $el.owlCarousel({
      nav: true,
      loop: true,
      autoplay: false,
      dots: false,
      margin: 46,
      navText: learNav,
      slideSpeed: 2000,
      smartSpeed: 2000,
      items: 4,
      rtl,
      responsiveClass: true,
      responsive: {
        1366: { items: 4, margin: 46 },
        1024: { items: 4, margin: 20 },
        768: { items: 2, margin: 20 },
        0: { items: 1.4, margin: 20, dots: true },
      },
    });
  });

  $root.find(".abmobile.owl-carousel").each((_i: number, el: Element) => {
    const $el = $(el);
    if ($el.hasClass("owl-loaded")) return;
    $el.owlCarousel({
      nav: false,
      loop: true,
      autoplay: false,
      dots: true,
      margin: 17,
      slideSpeed: 1000,
      smartSpeed: 1000,
      items: 1.6,
      rtl,
      navText: ["", ""],
      responsiveClass: true,
    });
  });

  /* Portfolio “Why choose us” mobile strip — was inline in triolla-io-b2b-body.html (`$('.pmobile').owlCarousel`). */
  $root.find(".pmobile.owl-carousel").each((_i: number, el: Element) => {
    const $el = $(el);
    if ($el.hasClass("owl-loaded")) return;
    $el.owlCarousel({
      nav: false,
      loop: true,
      autoplay: false,
      dots: true,
      margin: 18,
      singleItem: true,
      slideSpeed: 1000,
      smartSpeed: 1000,
      items: 1.6,
      rtl,
      navText: ["", ""],
      responsiveClass: true,
    });
  });

  $root.find(".bullet_slider.owl-carousel").each((_i: number, el: Element) => {
    const $el = $(el);
    if ($el.hasClass("owl-loaded")) return;
    $el.owlCarousel({
      nav: true,
      loop: true,
      autoplay: false,
      dots: false,
      margin: 0,
      slideSpeed: 2000,
      smartSpeed: 2000,
      items: 4,
      rtl,
      navText: ["", ""],
      responsiveClass: true,
      responsive: {
        1366: { items: 4 },
        1024: { items: 4 },
        768: { items: 3.4 },
        512: { items: 2.4 },
        0: { items: 1.4 },
      },
    });
  });
}
