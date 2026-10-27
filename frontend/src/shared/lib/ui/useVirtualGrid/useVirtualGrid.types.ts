import type { MaybeRefOrGetter, Ref } from 'vue';

export interface UseVirtualGridOptions<T> {
  /** The full, flat collection. Rows are derived from it, never stored. */
  items: Ref<readonly T[]> | Readonly<Ref<readonly T[]>>;
  /** The positioned element the rows are absolutely placed inside. */
  container: Readonly<Ref<HTMLElement | null>>;
  /**
   * An empty element rendered *after* the grid. Intersecting it is what asks
   * for the next page, so the request can only be triggered by scrolling
   * towards the end — never by scrolling back up.
   */
  sentinel?: Readonly<Ref<HTMLElement | null>>;
  /**
   * Exact height of one row including its bottom gap, in px. A constant per
   * layout, not an estimate: rows must be fixed-height (uniform cards), which
   * is what lets this composable skip DOM measurement entirely.
   */
  rowHeight: MaybeRefOrGetter<number>;
  /** Defaults to the app's own 1 / 2 / 3 grid, by breakpoint. */
  columnCount?: MaybeRefOrGetter<number>;
  /** Rows rendered beyond the viewport on each side. */
  overscan?: number;
  /** Called when the sentinel scrolls into view. The caller owns the guards. */
  onEndReached?: () => void;
}

export interface VirtualGridRow<T> {
  index: number;
  items: readonly T[];
  /** Pixels to translate the row by inside the container. */
  offset: number;
}
