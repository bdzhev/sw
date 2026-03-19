import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { nextTick, onBeforeUnmount } from 'vue';

import type { UseScrollSmootherOptions } from './useScrollSmoother.types';

export const useScrollSmoother = (options: UseScrollSmootherOptions) => {
  const { smooth = 1, speed = 0.5, wrapperSelector, contentSelector } = options;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  let smoother: ScrollSmoother | null = null;

  /**
   * Need to wait for the elements to be rendered first.
   */
  nextTick(() => {
    smoother = ScrollSmoother.create({
      smooth: smooth,
      speed: speed,
      smoothTouch: 0.1,
      wrapper: wrapperSelector,
      content: contentSelector,
    });
  });

  onBeforeUnmount(() => {
    smoother?.kill();
    smoother = null;
  });
};
