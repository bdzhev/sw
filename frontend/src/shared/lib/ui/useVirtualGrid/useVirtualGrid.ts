import { useWindowVirtualizer } from '@tanstack/vue-virtual';
import { useDebounceFn, useEventListener, useIntersectionObserver } from '@vueuse/core';
import { computed, ref, toValue, watch } from 'vue';

import { useBreakpoint } from '../useBreakpoint';
import type { UseVirtualGridOptions, VirtualGridRow } from './useVirtualGrid.types';

const DEFAULT_OVERSCAN = 2;

/** Long enough to sit out a drag-resize, short enough not to be seen. */
const MARGIN_DEBOUNCE_MS = 150;

/**
 * Window-scrolled virtualization for a responsive grid of **fixed-height**
 * rows: one virtual item is a whole row of N cards, and every row is exactly
 * `rowHeight` px tall.
 *
 * Fixed-pitch on purpose. The earlier version measured each row from the DOM,
 * which means keeping three caches in sync (chunking, per-row heights,
 * container offset) whose invalidation timings all differ — and it produced a
 * string of offset-drift bugs (rows lost past the container, blank space when
 * scrolling back up). With a constant pitch there is nothing to measure and
 * nothing to invalidate: offset = index × pitch is correct by construction.
 * The cost is the requirement that cards be uniform fixed-height, which the
 * consumer owns.
 *
 * The window scroller (rather than an inner scroll box) is deliberate — pages
 * here scroll the document, and an inner scroller would also need its own
 * scrollbar affordance, which `main.css` hides globally.
 */
export const useVirtualGrid = <T>({
  items,
  container,
  sentinel,
  rowHeight,
  columnCount,
  overscan = DEFAULT_OVERSCAN,
  onEndReached,
}: UseVirtualGridOptions<T>) => {
  const { isDesktop, isCompact } = useBreakpoint();

  const columns = computed(() => {
    if (columnCount !== undefined) {
      return Math.max(1, toValue(columnCount));
    }

    if (isDesktop.value) {
      return 3;
    }

    return isCompact.value ? 1 : 2;
  });

  const pitch = computed(() => {
    return toValue(rowHeight);
  });

  const rows = computed(() => {
    const perRow = columns.value;
    const source = items.value;

    return Array.from({ length: Math.ceil(source.length / perRow) }, (_, index) => {
      return source.slice(index * perRow, index * perRow + perRow);
    });
  });

  /**
   * Distance from the top of the document to the container. The window
   * virtualizer positions against the document, so without this the rows sit
   * offset by however much markup precedes the grid.
   */
  const scrollMargin = ref(0);

  const measureScrollMargin = () => {
    const element = container.value;

    if (element) {
      scrollMargin.value = element.getBoundingClientRect().top + window.scrollY;
    }
  };

  /**
   * This virtualizes against the *window*, so an ancestor with its own scrollbar
   * freezes it: `window.scrollY` never moves, one screen of rows renders and the
   * rest of the container stays blank. Cost a lot of debugging once — warn early.
   */
  const warnOnScrollableAncestor = () => {
    if (!import.meta.env.DEV) {
      return;
    }

    let node = container.value?.parentElement ?? null;

    while (node && node !== document.body) {
      const { overflowY } = getComputedStyle(node);

      if (overflowY === 'auto' || overflowY === 'scroll') {
        console.warn(
          '[useVirtualGrid] scrollable ancestor found, window virtualization will not update:',
          node,
        );

        return;
      }

      node = node.parentElement;
    }
  };

  const virtualizer = useWindowVirtualizer(
    computed(() => {
      return {
        count: rows.value.length,
        estimateSize: () => {
          return pitch.value;
        },
        overscan,
        scrollMargin: scrollMargin.value,
      };
    }),
  );

  /**
   * `estimateSize` is captured by the virtualizer's memo, so a pitch change
   * (the lg gap differs from the mobile one) needs an explicit recompute.
   * Cheap: with no DOM measurement the cache being cleared holds estimates
   * only, and they are exact.
   */
  watch(pitch, () => {
    virtualizer.value.measure();
  });

  watch(
    container,
    () => {
      measureScrollMargin();
      warnOnScrollableAncestor();
    },
    { immediate: true, flush: 'post' },
  );

  /** Debounced: a drag-resize streams events, and the margin is one number. */
  useEventListener(
    window,
    'resize',
    useDebounceFn(measureScrollMargin, MARGIN_DEBOUNCE_MS),
  );

  const visibleRows = computed<VirtualGridRow<T>[]>(() => {
    return virtualizer.value.getVirtualItems().map((virtualRow) => {
      return {
        index: virtualRow.index,
        items: rows.value[virtualRow.index] ?? [],
        offset: virtualRow.start - scrollMargin.value,
      };
    });
  });

  const totalHeight = computed(() => {
    return virtualizer.value.getTotalSize();
  });

  if (sentinel) {
    useIntersectionObserver(sentinel, (entries) => {
      if (
        entries.some((entry) => {
          return entry.isIntersecting;
        })
      ) {
        onEndReached?.();
      }
    });
  }

  return { rows, columns, visibleRows, totalHeight };
};
