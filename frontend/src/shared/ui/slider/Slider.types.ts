export interface SliderProps {
  name: string;
  /** Accessible name for the thumb. The old `title` prop was never declared, so it
   *  fell through as the native attribute — a hover tooltip, useless on touch. */
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  shouldShowTicks?: boolean;
}
