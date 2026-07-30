import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { nextTick, onBeforeUnmount } from 'vue';

import { mediaFrom } from '../../ui/breakpoints';
import type { UseScrollSmootherOptions } from './useScrollSmoother.types';

export const useScrollSmoother = (options: UseScrollSmootherOptions) => {
  const {
    smooth = 1,
    speed = 0.5,
    wrapperSelector,
    contentSelector,
    mediaQuery = mediaFrom('md'),
  } = options;

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  /**
   * matchMedia rather than a one-off check at mount: the smoother has to be
   * built and torn down as the viewport crosses the breakpoint, otherwise a
   * rotate or a resized window leaves the wrong behaviour in place.
   */
  const smootherMedia = gsap.matchMedia();

  /**
   * Need to wait for the elements to be rendered first.
   */
  nextTick(() => {
    smootherMedia.add(mediaQuery, () => {
      const smoother = ScrollSmoother.create({
        smooth: smooth,
        speed: speed,
        wrapper: wrapperSelector,
        content: contentSelector,
      });

      return () => {
        smoother.kill();
      };
    });
  });

  onBeforeUnmount(() => {
    smootherMedia.revert();
  });
};
