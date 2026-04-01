/**
 * Inline $(document).ready() that called .jConveyorTicker() was stripped from the fragment.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function initTriollaConveyorTicker(root: HTMLElement): void {
  const $ = (window as any).jQuery;
  if (!$?.fn?.jConveyorTicker) return;

  const $el = $(root).find(".company_triker");
  if (!$el.length || $el.data("jConveyorTicker")) return;

  $el.jConveyorTicker({ force_loop: true });
}
