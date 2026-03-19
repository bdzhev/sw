export type splitType = 'words' | 'chars';

export interface UseTextAnimationOptions {
  elementSelector: string;
  type: splitType;
  animate: (elements: Element[], splitText?: globalThis.SplitText) => void;
}
