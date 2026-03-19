import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useSidebarUi = defineStore('sidebarUi', {
  state: () => {
    return {
      isCollapsed: useLocalStorage('isSidebarCollapsed', false),
    };
  },
  actions: {
    toggleCollapsed() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
});
