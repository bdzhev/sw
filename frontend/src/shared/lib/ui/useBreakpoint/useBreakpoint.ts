import { useBreakpoints } from '@vueuse/core';

import { breakpoints } from '../breakpoints';

/**
 * Reactive counterpart to the `sm:`/`md:`/`lg:` variants, for the cases CSS
 * cannot express — GSAP offsets, canvas sizing, whether to mount a component
 * at all. Prefer a Tailwind variant whenever the answer is only visual.
 *
 * `isMobile` is deliberately "below md", the same line the layouts switch on.
 */
export const useBreakpoint = () => {
  const bp = useBreakpoints(breakpoints);

  return {
    isMobile: bp.smaller('md'),
    isTablet: bp.between('md', 'lg'),
    isDesktop: bp.greaterOrEqual('lg'),
    isCompact: bp.smaller('sm'),
  };
};
