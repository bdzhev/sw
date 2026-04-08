import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onBeforeUnmount, nextTick } from 'vue';

import { Device, getDevice } from '../../system/device';

import type { UseHorizontalScrollAnimationOptions } from './types';

const scrubByDevice: Record<Device, number | boolean> = {
  // instant
  [Device.Mobile]: true,
  [Device.Tablet]: true,
  [Device.Desktop]: 0.5,
};

const endMultiplierByDevice: Record<Device, number> = {
  [Device.Mobile]: 3,
  [Device.Tablet]: 2,
  [Device.Desktop]: 1,
};

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

    scrollTween = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        // markers: true,
        start: 'top top',
        end: () => {
          const device = getDevice();

          return (
            wrapper.offsetWidth *
            (sections.length - 1) *
            endMultiplierByDevice[device]
          );
        },
        pin: true,
        scrub: scrubByDevice[getDevice()],
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: { min: 0.2, max: 0.5 },
          ease: 'power1.inOut',
        },
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
