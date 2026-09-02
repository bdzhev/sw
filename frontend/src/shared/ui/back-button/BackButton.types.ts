import type { RouteLocationRaw } from 'vue-router';

export interface BackButtonProps {
  to: RouteLocationRaw;
  /**
   * The accessible name. Icon-only, so it has none of its own — and "Back" alone
   * tells a screen-reader user nothing about where they are going.
   */
  label: string;
}
