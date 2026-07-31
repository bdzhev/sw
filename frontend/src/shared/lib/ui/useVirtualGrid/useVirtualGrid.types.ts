import type { MaybeRefOrGetter, Ref } from 'vue';

export interface UseVirtualGridOptions<T> {
  /** The full, flat collection. Rows are derived from it, never stored. */
  items: Ref<readonly T[]> | Readonly<Ref<readonly T[]>>;
  /** The positioned element the rows are absolutely placed inside. */
  container: Readonly<Ref<HTMLElement | null>>;
  /** Starting guess per row; `measureRow` corrects it from the real DOM. */
  estimatedRowHeight: number;
  /** Defaults to the app's own 1 / 2 / 3 grid, by breakpoint. */
  columnCount?: MaybeRefOrGetter<number>;
  /** Rows rendered beyond the viewport on each side. */
  overscan?: number;
  /**
   * Called when the last row becomes visible. The caller owns the guards
   * (has-more, already-fetching) — this only reports the position.
   */
  onEndReached?: () => void;
}

export interface VirtualGridRow<T> {
  index: number;
  items: readonly T[];
  /** Pixels to translate the row by inside the container. */
  offset: number;
}
