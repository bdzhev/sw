import { VueQueryPlugin } from '@tanstack/vue-query';
import { createHead } from '@unhead/vue/client';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import { router, queryClient, i18n, setupLocaleGuard } from './providers';

export const createMainApp = () => {
  const app = createApp(App)
    .use(createPinia())
    .use(createHead())
    .use(router)
    .use(VueQueryPlugin, { queryClient })
    .use(i18n);

  setupLocaleGuard(router);

  return app;
};
