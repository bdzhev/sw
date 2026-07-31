import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { nextTick, onBeforeUnmount } from 'vue';

import { mediaFrom } from '../../ui/breakpoints';
import type { UseHorizontalScrollAnimationOptions } from './types';

/**
 * How much page scroll one panel-width of horizontal travel costs. 1 is the 1:1
 * mapping — the row moves exactly as fast as the wheel — which reads right with
 * a pointer. Touch gets a shorter distance: a flick covers far less than a wheel
 * spin, and at 1:1 a phone needs several swipes per panel.
 */
const TOUCH_END_MULTIPLIER = 0.5;
const DESKTOP_END_MULTIPLIER = 1;

export const useHorizontalScrollAnimation = (
  options: UseHorizontalScrollAnimationOptions,
) => {
  const {
    wrapperSelector,
    rowSelector,
    childrenSelector,
    mediaQuery = mediaFrom('md'),
  } = options;

  gsap.registerPlugin(ScrollTrigger);

  /**
   * Without this, every mobile browser chrome collapse counts as a resize and
   * refreshes ScrollTrigger mid-pin, which reads as the section jumping.
   */
  ScrollTrigger.config({ ignoreMobileResize: true });

  /**
   * Registered through matchMedia so crossing a breakpoint rebuilds the tween
   * instead of leaving desktop tuning (or the pin itself) applied to a phone.
   * `isDesktop` is a separate condition purely so the tuning below re-resolves
   * when the viewport crosses lg.
   */
  const scrollMedia = gsap.matchMedia();

  nextTick(() => {
    scrollMedia.add({ isEnabled: mediaQuery, isDesktop: mediaFrom('lg') }, (context) => {
      const isDesktop = Boolean(context.conditions?.isDesktop);

      const sections = gsap.utils.toArray<HTMLElement>(childrenSelector);
      const wrapper = document.querySelector<HTMLElement>(wrapperSelector);
      const row = document.querySelector(rowSelector);

      if (!wrapper || !sections.length || !row) {
        return;
      }

      const scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          /**
           * `+=` matters: a bare number is an absolute scroll position, so the
           * pin length silently depended on how tall everything above the
           * section happened to be.
           */
          end: () => {
            const multiplier = isDesktop ? DESKTOP_END_MULTIPLIER : TOUCH_END_MULTIPLIER;

            return `+=${wrapper.offsetWidth * (sections.length - 1) * multiplier}`;
          },
          pin: true,
          anticipatePin: 1,
          scrub: isDesktop ? 0.5 : true,
          /**
           * Snapping competes with touch momentum, so it stays a
           * pointer-device affordance.
           */
          snap: isDesktop
            ? {
                snapTo: 1 / (sections.length - 1),
                duration: { min: 0.2, max: 0.5 },
                ease: 'power1.inOut',
              }
            : undefined,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        scrollTween.scrollTrigger?.kill();
        scrollTween.kill();
      };
    });
  });

  onBeforeUnmount(() => {
    scrollMedia.revert();
  });
};
