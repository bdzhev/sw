export interface UseScrollSmootherOptions {
  wrapperSelector: string;
  contentSelector: string;
  smooth?: number;
  speed?: number;
  /**
   * Media query the smoother is restricted to. Defaults to md and up: on touch
   * the smoother's transformed wrapper fights native momentum scrolling and
   * makes viewport-height units resolve unpredictably as the browser chrome
   * collapses.
   */
  mediaQuery?: string;
}
