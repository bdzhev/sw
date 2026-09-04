import { VueQueryPlugin } from '@tanstack/vue-query';
import { createHead } from '@unhead/vue/client';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { router, queryClient, i18n, setupLocaleGuard } from './providers';
// import { renderProfiler } from './providers/dev/renderProfiler';

export const createMainApp = () => {
  const app = createApp(App)
    .use(createPinia())
    .use(createHead())
    .use(router)
    .use(VueQueryPlugin, { queryClient })
    .use(i18n);

  setupLocaleGuard(router);

  /**
   * Uncomment with its import above to flash every component as it re-renders.
   * Keep both commented: the commented import is what keeps the profiler out of
   * the production bundle.
   */
  // app.use(renderProfiler);

  return app;
};
