import type { RouteRecordRaw } from 'vue-router';

import { characterQueries, getCharacter } from '@shared/api/characters';
import { getMe } from '@shared/api/auth';
import { setToken } from '@shared/lib/auth/token';
import { LandingLayout, DefaultLayout, ResultLayout } from '@shared/ui/layouts';

import { queryClient } from '../queryClient';

export const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('@pages/landing'),
    meta: { layout: LandingLayout },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@pages/sign-in'),
    meta: { layout: LandingLayout },
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@pages/sign-up'),
    meta: { layout: LandingLayout },
  },
  {
    path: '/auth/callback',
    name: 'auth-callback',
    component: () => import('@pages/landing'),
    beforeEnter: async (to, _from, next) => {
      const token = to.query.token as string | undefined;
      if (!token) return next({ name: 'home' });
      setToken(token);
      try {
        const user = await getMe();
        // Make user available globally via useUser's setUser
        const { useUser } = await import('@entities/user');
        useUser().setUser(user);
      } catch {
        // proceed anyway — useUser will handle state
      }
      next({ name: 'app_home' });
    },
  },
  {
    path: '/app',
    meta: { requiresAuth: true, layout: DefaultLayout },
    children: [
      {
        path: '',
        name: 'app_home',
        component: () => import('@pages/dashboard'),
        meta: { layout: DefaultLayout },
      },
      {
        path: 'builder/:id?',
        name: 'app_builder',
        component: () => import('@pages/builder'),
        meta: { layout: DefaultLayout },
        beforeEnter: async (to, _from, next) => {
          const rawId = to.params.id;
          const id = Array.isArray(rawId) ? rawId[0] : rawId;

          if (!id) {
            next({ name: 'app_home' });
            return;
          }

          try {
            await queryClient.fetchQuery({
              queryKey: characterQueries.character(id),
              queryFn: async () => getCharacter(id),
            });
            next();
          } catch {
            next({ name: 'app_home' });
          }
        },
      },
      {
        path: 'settings',
        name: 'app_settings',
        component: () => import('@pages/settings'),
        meta: { layout: DefaultLayout },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: import('@pages/not-found'),
    meta: { layout: ResultLayout },
  },
];
