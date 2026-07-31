import { useWindowVirtualizer } from '@tanstack/vue-virtual';
import { useEventListener } from '@vueuse/core';
import { computed, ref, toValue, watch } from 'vue';

import { useBreakpoint } from '../useBreakpoint';
import type { UseVirtualGridOptions, VirtualGridRow } from './useVirtualGrid.types';

const DEFAULT_OVERSCAN = 2;

/**
 * Window-scrolled virtualization for a responsive card grid: one virtual item
 * is a whole row, so the browser keeps the grid's own column layout and only
 * the row count is virtual.
 *
 * The window scroller (rather than an inner scroll box) is deliberate — pages
 * here scroll the document, and an inner scroller would also need its own
 * scrollbar affordance, which `main.css` hides globally.
 *
 * Consumers must render `data-index="row.index"` on each row element and pass
 * `measureRow` as its `ref`: TanStack reads that attribute to attribute a
 * measurement to the right row.
 */
export const useVirtualGrid = <T>({
  items,
  container,
  estimatedRowHeight,
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

  const rows = computed(() => {
    const perRow = columns.value;
    const source = items.value;

    return Array.from({ length: Math.ceil(source.length / perRow) }, (_, index) => {
      return source.slice(index * perRow, index * perRow + perRow);
    });
  });

  /**
   * Distance from the top of the document to the container. The window
   * virtualizer measures against the document, so without this the rows sit
   * offset by however much markup precedes the grid.
   */
  const scrollMargin = ref(0);

  const measureScrollMargin = () => {
    const element = container.value;

    if (element) {
      scrollMargin.value = element.getBoundingClientRect().top + window.scrollY;
    }
  };

  watch(container, measureScrollMargin, { immediate: true, flush: 'post' });
  useEventListener(window, 'resize', measureScrollMargin);

  const virtualizer = useWindowVirtualizer(
    computed(() => {
      return {
        count: rows.value.length,
        estimateSize: () => {
          return estimatedRowHeight;
        },
        overscan,
        scrollMargin: scrollMargin.value,
      };
    }),
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

  const measureRow = (element: unknown) => {
    if (element instanceof Element) {
      virtualizer.value.measureElement(element);
    }
  };

  /** A column-count change invalidates every cached row height. */
  watch(columns, () => {
    virtualizer.value.measure();
  });

  watch(visibleRows, (currentRows) => {
    const lastRendered = currentRows[currentRows.length - 1];

    if (!lastRendered || rows.value.length === 0) {
      return;
    }

    if (lastRendered.index >= rows.value.length - 1) {
      onEndReached?.();
    }
  });

  return { rows, columns, visibleRows, totalHeight, measureRow };
};
