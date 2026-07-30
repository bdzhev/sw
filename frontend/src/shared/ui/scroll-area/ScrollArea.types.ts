export type ScrollAreaOrientation = 'vertical' | 'horizontal';

export type ScrollAreaType = 'auto' | 'always' | 'scroll' | 'hover';

export interface ScrollAreaProps {
  /** Axis the scrollbar is rendered for. Defaults to `vertical`. */
  orientation?: ScrollAreaOrientation;
  /**
   * When the scrollbar is visible.
   * `auto` — only while the content overflows.
   * `always` — permanently.
   * `scroll` — only while scrolling.
   * `hover` — while scrolling and on hover. Defaults to `hover`.
   */
  type?: ScrollAreaType;
  /** Milliseconds before the scrollbar hides after scrolling stops. Defaults to `600`. */
  scrollHideDelay?: number;
  /**
   * Fade the top/bottom edge when there is scrollable content past it.
   * Vertical only — has no effect on a horizontal orientation. Defaults to `false`.
   */
  shouldFade?: boolean;
}
