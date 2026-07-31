export type DrawerSide = 'left' | 'right';

export interface DrawerProps {
  /**
   * Which edge the drawer is anchored to. It is also the swipe direction that
   * closes it.
   */
  side?: DrawerSide;
  /**
   * Visually hidden, but required: it is what the dialog's `aria-labelledby`
   * points at, so a screen reader announces the drawer as something.
   */
  title: string;
}
