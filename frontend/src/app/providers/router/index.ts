import { createRouter, createWebHistory } from "vue-router";

import { RouteName } from "@shared/lib/router";

import { useUser } from "@entities/user";

import { routes } from "./routes";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const { isLoggedIn, isLoading, loadUser } = useUser();

  if (isLoading.value) {
    await loadUser();
  }

  const requiresAuth = to.matched.some((record) => {
    return record.meta?.requiresAuth;
  });

  const isAuthPage = [RouteName.LOGIN, RouteName.SIGNUP].includes(
    to.name as RouteName,
  );

  if (requiresAuth && !isLoggedIn.value) {
    return { name: RouteName.LOGIN };
  }

  if (isAuthPage && isLoggedIn.value) {
    return { name: RouteName.APP_HOME };
  }

  return true;
});
