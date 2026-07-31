import { usePreferredReducedMotion } from '@vueuse/core';

import { useFadeInAnimation, useTextAnimation } from '@shared/lib/animations';
import { useBreakpoint } from '@shared/lib/ui';

/**
 * The slide-in distance is tuned to the headline's size, so it shrinks with it —
 * 200px under a 4xl mobile headline overshoots badly.
 */
const CATCH_PHRASE_OFFSET = 200;
const MOBILE_CATCH_PHRASE_OFFSET = 80;
const DESCRIPTION_OFFSET = 100;
const MOBILE_DESCRIPTION_OFFSET = 40;

/**
 * Reduced motion still has to run the animation, just flat: the elements start
 * `invisible` in the markup and it is the animation that reveals them.
 */
const REDUCED_MOTION_DURATION = 0.01;

export const useTopSectionAnimation = () => {
  const { isMobile } = useBreakpoint();
  const preferredMotion = usePreferredReducedMotion();

  /**
   * Read once, at setup: these animations play a single time on mount, so there
   * is nothing to rebuild if the viewport changes afterwards.
   */
  const isReduced = preferredMotion.value === 'reduce';

  const catchPhraseOffset = isMobile.value
    ? MOBILE_CATCH_PHRASE_OFFSET
    : CATCH_PHRASE_OFFSET;

  const descriptionOffset = isMobile.value
    ? MOBILE_DESCRIPTION_OFFSET
    : DESCRIPTION_OFFSET;

  /**
   * Reverting to DOM is visible after animation completion in this particular case.
   * Intentionally decided not to revert for the main title to keep things smooth.
   */
  const animateCatchPhrase = useFadeInAnimation({
    duration: isReduced ? REDUCED_MOTION_DURATION : 1.25,
    y: isReduced ? 0 : catchPhraseOffset,
    stagger: isReduced ? 0 : undefined,
  });

  const animateDescription = useFadeInAnimation({
    duration: isReduced ? REDUCED_MOTION_DURATION : undefined,
    y: isReduced ? 0 : descriptionOffset,
    delay: isReduced ? 0 : 0.8,
    stagger: isReduced ? 0 : undefined,
    shouldRevert: true,
  });

  useTextAnimation({
    elementSelector: '#landingSlogan',
    type: 'chars',
    animate: animateCatchPhrase,
  });

  useTextAnimation({
    elementSelector: '#landingSloganDescription1',
    type: 'words',
    animate: animateDescription,
  });

  useTextAnimation({
    elementSelector: '#landingSloganDescription2',
    type: 'words',
    animate: animateDescription,
  });
};
