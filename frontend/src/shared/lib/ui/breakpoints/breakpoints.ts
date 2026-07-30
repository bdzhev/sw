/**
 * Twin of the --breakpoint-* tokens in src/main.css. Change both together.
 *
 * Values are px because that is what matchMedia, @vueuse/core's useBreakpoints
 * and GSAP's matchMedia all want. 40/48/64rem at the 16px root = 640/768/1024.
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
} as const;

export type BreakpointName = keyof typeof breakpoints;

/**
 * Media query matching a Tailwind `<name>:` variant, so JS gates and CSS
 * variants can never disagree about where a layout switches.
 */
export const mediaFrom = (name: BreakpointName): string => {
  return `(min-width: ${breakpoints[name]}px)`;
};

export const mediaBelow = (name: BreakpointName): string => {
  return `(max-width: ${breakpoints[name] - 0.02}px)`;
};
