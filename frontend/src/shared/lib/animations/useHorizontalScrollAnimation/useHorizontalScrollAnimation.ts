import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onBeforeUnmount, nextTick } from 'vue';

interface UseHorizontalScrollAnimationOptions {
  wrapperSelector: string;
  rowSelector: string;
  childrenSelector: string;
}

export const useHorizontalScrollAnimation = (
  options: UseHorizontalScrollAnimationOptions,
) => {
  const { wrapperSelector, rowSelector, childrenSelector } = options;

  gsap.registerPlugin(ScrollTrigger);

  let scrollTween: GSAPTween | null = null;

  nextTick(() => {
    const sections = gsap.utils.toArray(childrenSelector);
    const wrapper = document.querySelector(wrapperSelector) as HTMLElement;
    const row = document.querySelector(rowSelector);

    if (!wrapper || !sections.length || !row) {
      return;
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        // markers: true,
        start: 'top top',
        end: () => wrapper.offsetWidth * (sections.length - 1),
        pin: true,
        scrub: isMobile ? 0.4 : 0.1,
        invalidateOnRefresh: true,
      },
    });
  });

  onBeforeUnmount(() => {
    if (scrollTween) {
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
      scrollTween = null;
    }
  });
};
