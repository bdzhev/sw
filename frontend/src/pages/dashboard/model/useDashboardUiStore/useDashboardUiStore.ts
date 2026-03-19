import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDashboardUiStore = defineStore('dashboardUi', () => {
  const isNewCharacterFormOpen = ref(false);

  const toggleIsNewCharacterFormOpen = (isOpen: boolean) => {
    isNewCharacterFormOpen.value = isOpen;
  };

  return {
    isNewCharacterFormOpen,
    toggleIsNewCharacterFormOpen,
  };
});
