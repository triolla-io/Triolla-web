/**
 * Triolla `all.js` registers footer column / social / contact accordion handlers on
 * `jQuery(document).ready`. Portfolio snapshot pages load that bundle before the footer
 * HTML exists, so those handlers never attach — mobile menus stay closed.
 *
 * Call this after `injectSharedFooter` (or any time the `.footer` markup is finalized).
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function mountTriollaFooterAccordion(root: HTMLElement): () => void {
  const $ = (window as any).jQuery;
  if (!$) return () => {};

  const $footer = $(root).find(".footer").first();
  if (!$footer.length) return () => {};

  const ns = ".triollaFooterAccordion";

  const initMenuColumns = () => {
    const $cols = $footer.find(".footer_menu_col");
    if (!$cols.length) return;
    $cols.removeClass("active");
    $cols.find("> h3").next().stop(true, true).hide();
    const $first = $cols.first();
    $first.addClass("active");
    $first.find("> h3").first().next().stop(true, true).slideDown(350);
  };

  const onMenuHeading = function (this: HTMLElement) {
    const $h3 = $(this);
    const $col = $h3.closest(".footer_menu_col");
    const $panel = $h3.next();
    if ($col.hasClass("active")) {
      $col.removeClass("active");
      $panel.slideUp(350);
    } else {
      $footer.find(".footer_menu_col").removeClass("active");
      $footer.find(".footer_menu_col > h3").next().slideUp(350);
      $col.addClass("active");
      $panel.slideDown(350);
    }
  };

  const onSocialHeading = function (this: HTMLElement) {
    const $h3 = $(this);
    $h3.parent().toggleClass("active");
    $h3.next().slideToggle(350);
  };

  const onContactHeading = function (this: HTMLElement) {
    const $h3 = $(this);
    $h3.parent().toggleClass("active");
    $h3.next().slideToggle(350);
  };

  $footer.find(".footer_menu_col > h3").off(`click${ns}`).off("click");
  $footer.find(".footer_socail > h3").off(`click${ns}`).off("click");
  $footer.find(".footer_contact > h3").off(`click${ns}`).off("click");

  initMenuColumns();

  $footer.find(".footer_menu_col > h3").on(`click${ns}`, onMenuHeading);
  $footer.find(".footer_socail > h3").on(`click${ns}`, onSocialHeading);
  $footer.find(".footer_contact > h3").on(`click${ns}`, onContactHeading);

  return () => {
    $footer.find(".footer_menu_col > h3").off(`click${ns}`);
    $footer.find(".footer_socail > h3").off(`click${ns}`);
    $footer.find(".footer_contact > h3").off(`click${ns}`);
  };
}
