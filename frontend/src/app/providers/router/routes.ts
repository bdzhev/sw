import type { RouteRecordRaw } from 'vue-router';

import { RouteName } from '@shared/lib/router';
import {
  LandingLayout,
  DefaultLayout,
  ResultLayout,
  AuthLayout,
} from '@shared/ui/layouts';

export const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: RouteName.HOME,
    component: () => {
      return import('@pages/landing');
    },
    meta: { layout: LandingLayout },
  },
  {
    path: '/login',
    name: RouteName.LOGIN,
    component: () => {
      return import('@pages/sign-in');
    },
    meta: { layout: AuthLayout },
  },
  {
    path: '/signup',
    name: RouteName.SIGNUP,
    component: () => {
      return import('@pages/sign-up');
    },
    meta: { layout: AuthLayout },
  },
  {
    path: '/app',
    meta: { requiresAuth: true, layout: DefaultLayout },
    children: [
      {
        path: '',
        name: RouteName.APP_HOME,
        component: () => {
          return import('@pages/dashboard');
        },
        meta: { layout: DefaultLayout },
      },
      {
        path: 'builder/:id?',
        name: RouteName.APP_BUILDER,
        component: () => {
          return import('@pages/builder');
        },
        meta: { layout: DefaultLayout },
        beforeEnter: (to, _from, next) => {
          const rawId = to.params.id;
          const id = Array.isArray(rawId) ? rawId[0] : rawId;

          if (!id) {
            next({ name: RouteName.APP_HOME });

            return;
          }

          next();
        },
      },
      {
        path: 'character/:id',
        name: RouteName.APP_CHARACTER,
        component: () => {
          return import('@pages/character');
        },
        meta: { layout: DefaultLayout },
      },
      {
        path: 'settings',
        name: RouteName.APP_SETTINGS,
        component: () => {
          return import('@pages/settings');
        },
        meta: { layout: DefaultLayout },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteName.NOT_FOUND,
    component: () => {
      return import('@pages/not-found');
    },
    meta: { layout: ResultLayout },
  },
];
