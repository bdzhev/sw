import type { SplitText } from 'gsap/SplitText';

export type splitType = 'words' | 'chars';

export interface UseTextAnimationOptions {
  elementSelector: string;
  type: splitType;
  animate: (elements: Element[], splitText?: SplitText) => void;
}
