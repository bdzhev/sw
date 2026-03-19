import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useHeaderUiStore = defineStore('landingUi', () => {
  const hasScrolled = ref(false);

  const setHasScrolled = (newValue: boolean) => {
    hasScrolled.value = newValue;
  };

  const resetHasScrolled = () => {
    hasScrolled.value = false;
  };

  return {
    hasScrolled,

    setHasScrolled,
    resetHasScrolled,
  };
});
