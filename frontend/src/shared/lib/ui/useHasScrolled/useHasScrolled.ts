import { useWindowScroll } from '@vueuse/core';
import { watch } from 'vue';

import type { UseHasScrolledOptions } from './useHasScrolled.types';

export const useHasScrolled = ({
  threshold,
  throttle = 200,
  setHasScrolled,
}: UseHasScrolledOptions) => {
  const { y } = useWindowScroll({ throttle });

  watch(
    () => y.value,
    (newY) => {
      setHasScrolled(newY > threshold);
    },
    { immediate: true },
  );
};
