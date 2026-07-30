export interface UseHorizontalScrollAnimationOptions {
  wrapperSelector: string;
  rowSelector: string;
  childrenSelector: string;
  /**
   * Media query the pinned horizontal scroll is restricted to. Defaults to md
   * and up — below it the consumer is expected to lay its panels out as a plain
   * vertical stack, since pinning plus scrub plus snap is the least reliable
   * combination there is on a touch device with collapsing browser chrome.
   */
  mediaQuery?: string;
}
