import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { nextTick, onBeforeUnmount } from 'vue';

import { mediaFrom } from '../../ui/breakpoints';
import { createStickyEase } from './stickyEase';
import type { UseHorizontalScrollAnimationOptions } from './types';

/**
 * How much page scroll one panel-width of horizontal travel costs. Not the wheel
 * cost: ScrollSmoother runs on the same md-and-up range as the pin and its
 * `speed` below 1 multiplies whatever is set here, so 0.5 reads as roughly 1:1.
 */
const TOUCH_END_MULTIPLIER = 0.5;
const DESKTOP_END_MULTIPLIER = 0.5;

const DEFAULT_STICKINESS = 0.75;

export const useHorizontalScrollAnimation = (
  options: UseHorizontalScrollAnimationOptions,
) => {
  const {
    wrapperSelector,
    childrenSelector,
    mediaQuery = mediaFrom('md'),
    stickiness = DEFAULT_STICKINESS,
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

      /**
       * Two is the real minimum: a single panel leaves the sticky ease with no
       * gap to divide by.
       */
      if (!wrapper || sections.length < 2) {
        return;
      }

      const scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: createStickyEase(sections.length - 1, stickiness),
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
          /**
           * Locked to scroll position, not eased into it: the smoother already
           * eases, and a scrub duration on top of that is what made the row
           * visibly trail the wheel.
           */
          scrub: true,
          /**
           * Snapping competes with touch momentum, so it stays a
           * pointer-device affordance.
           */
          snap: isDesktop
            ? {
                snapTo: 1 / (sections.length - 1),
                duration: { min: 0.1, max: 0.25 },
                ease: 'power2.out',
                /**
                 * Both default to on, and together they are what made a nudge
                 * forward get pulled to the next panel rather than back to the
                 * nearest one. Off, snap only finishes what the ease started.
                 */
                directional: false,
                inertia: false,
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
