import { createRouter, createWebHistory } from 'vue-router';

import { useUser } from '@entities/user';

import { routes } from './routes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const { isLoggedIn, isLoading, loadUser } = useUser();

  if (isLoading.value) {
    await loadUser();
  }

  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth);
  const isAuthPage = ['/login', '/signup'].includes(to.path);

  if (requiresAuth && !isLoggedIn.value) {
    return { name: 'login' };
  }

  if (isAuthPage && isLoggedIn.value) {
    return { name: 'app_home' };
  }

  return true;
});
