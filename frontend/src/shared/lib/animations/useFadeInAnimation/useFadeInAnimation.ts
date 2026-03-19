import { gsap } from 'gsap';

import type { UseFadeInAnimationOptions } from './useFadeInAnimation.types';

export const useFadeInAnimation = (options?: UseFadeInAnimationOptions) => {
  const {
    duration = 1,
    y = 100,
    stagger = 0.05,
    delay = 0,
    shouldRevert,
  } = options || {};

  return (elements: Element[], textSplit?: globalThis.SplitText) => {
    gsap.from(elements, {
      duration: duration,
      y: y,
      autoAlpha: 0,
      stagger: stagger,
      delay,
      ease: 'power2.out',
      onComplete: () => {
        if (textSplit && shouldRevert) {
          return textSplit.revert();
        }
      },
    });
  };
};
