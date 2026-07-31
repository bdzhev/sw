import { readonly, ref } from 'vue';

import type { ShowToastOptions, ToastEntry } from './useToast.types';

/**
 * Module-level queue rather than a pinia store: nothing here is server state,
 * it never needs devtools time-travel, and a plain ref keeps the call site a
 * one-liner from anywhere in the tree.
 */
const entries = ref<ToastEntry[]>([]);

let nextId = 0;

export const useToast = () => {
  const showToast = ({ title, description, variant = 'neutral' }: ShowToastOptions) => {
    nextId += 1;
    entries.value = [...entries.value, { id: nextId, title, description, variant }];

    return nextId;
  };

  const dismissToast = (id: number) => {
    entries.value = entries.value.filter((entry) => {
      return entry.id !== id;
    });
  };

  return { toasts: readonly(entries), showToast, dismissToast };
};
