import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { nextTick } from 'vue';

import type {
  splitType,
  UseTextAnimationOptions,
} from './useTextAnimation.types';

const getElementsBySplitType = (
  type: splitType,
  splitText: globalThis.SplitText,
) => {
  switch (type) {
    case 'words':
      return splitText.words;
    case 'chars':
      return splitText.chars;
    default:
      return splitText.words;
  }
};

/**
 * Line support is not supported yet due to edge cases
 * with line splitting, which must be handled separately.
 * For more info see: https://gsap.com/docs/v3/Plugins/SplitText/
 *
 * To avoid flashing, always apply visibility: hidden to your
 * elems, otherwise, cringe.
 */
export const useTextAnimation = (options: UseTextAnimationOptions) => {
  const { type, elementSelector, animate } = options;
  gsap.registerPlugin(SplitText, ScrollTrigger);

  /**
   * Need to wait for the elements to be rendered.
   */
  nextTick(() => {
    /**
     * Let's find the el to remove the invisibility.
     */
    const el = document.querySelector(elementSelector);

    if (!el) {
      return;
    }
    /**
     * In order to calculate the positions of text accurately,
     * fonts must be already loaded.
     */
    document.fonts.ready.then(() => {
      gsap.set(el, { visibility: 'visible' });

      const splitText = SplitText.create(elementSelector, { type });
      const elements = getElementsBySplitType(type, splitText);

      animate(elements, splitText);
    });
  });
};
