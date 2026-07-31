import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useSidebarUi = defineStore('sidebarUi', {
  state: () => {
    return {
      /**
       * The rail's collapsed state, and therefore md-and-up only — below that
       * the navigation is a drawer, which has no collapsed form. Persisted.
       */
      isCollapsed: useLocalStorage('isSidebarCollapsed', false),
      /**
       * The mobile drawer. Deliberately **not** persisted: a reload must never
       * restore an open overlay on top of the page.
       */
      isDrawerOpen: false,
    };
  },
  actions: {
    toggleCollapsed() {
      this.isCollapsed = !this.isCollapsed;
    },
    setDrawerOpen(isOpen: boolean) {
      this.isDrawerOpen = isOpen;
    },
    closeDrawer() {
      this.isDrawerOpen = false;
    },
  },
});
