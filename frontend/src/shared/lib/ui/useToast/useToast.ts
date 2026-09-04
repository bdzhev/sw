import { readonly, ref } from 'vue';

import type { ShowToastOptions, ToastEntry } from './useToast.types';

/**
 * Module-level queue rather than a pinia store: nothing here is server state,
 * it never needs devtools time-travel, and a plain ref keeps the call site a
 * one-liner from anywhere in the tree.
 */
const entries = ref<ToastEntry[]>([]);

let nextId = 0;

/**
 * How long a closed entry lingers before it is dropped from the queue.
 *
 * **Not an animation timing.** reka's `Presence` owns the exit and unmounts the
 * node itself the moment the CSS animation ends, so this only garbage-collects
 * the bookkeeping — which is why it is an order of magnitude longer than
 * `--animate-toast-out` and why retuning that token cannot break it.
 */
const REMOVAL_DELAY_MS = 1000;

export const useToast = () => {
  const showToast = ({ title, description, variant = 'neutral' }: ShowToastOptions) => {
    nextId += 1;
    entries.value = [
      ...entries.value,
      { id: nextId, title, description, variant, isOpen: true },
    ];

    return nextId;
  };

  const dismissToast = (id: number) => {
    const isStillOpen = entries.value.some((entry) => {
      return entry.id === id && entry.isOpen;
    });

    /**
     * Guard the timer as much as the state: reka closes on its own duration, on
     * a swipe and on the close button, and all three land here.
     */
    if (!isStillOpen) {
      return;
    }

    entries.value = entries.value.map((entry) => {
      return entry.id === id ? { ...entry, isOpen: false } : entry;
    });

    setTimeout(() => {
      entries.value = entries.value.filter((entry) => {
        return entry.id !== id;
      });
    }, REMOVAL_DELAY_MS);
  };

  return { toasts: readonly(entries), showToast, dismissToast };
};
