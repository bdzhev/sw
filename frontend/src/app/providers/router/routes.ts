import type { RouteRecordRaw } from 'vue-router';

import { RouteName } from '@shared/lib/router';
import {
  LandingLayout,
  DefaultLayout,
  ResultLayout,
  AuthLayout,
  SheetLayout,
  BuilderLayout,
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
        meta: { layout: BuilderLayout },
        /** `to.name` is a literal in the typed route map, so it narrows `params`. */
        beforeEnter: (to, _from, next) => {
          if (to.name === RouteName.APP_BUILDER && to.params.id) {
            next();

            return;
          }

          next({ name: RouteName.APP_HOME });
        },
      },
      {
        // The tab is a route param so a tab is deep-linkable, the back button
        // works, and the sheet survives the mid-combat refresh the save
        // strategy is designed for. Missing tab redirects to main.
        path: 'character/:id/:tab?',
        name: RouteName.APP_CHARACTER,
        component: () => {
          return import('@pages/character');
        },
        meta: { layout: SheetLayout },
        beforeEnter: (to, _from, next) => {
          if (to.name !== RouteName.APP_CHARACTER || to.params.tab) {
            next();

            return;
          }

          next({
            name: RouteName.APP_CHARACTER,
            params: { id: to.params.id, tab: 'main' },
          });
        },
      },
      {
        // A page rather than a sixth tab: it carries its own header and shows
        // none of the sheet's chrome. `items` would also match the `:tab?` route
        // above, but router ranking scores a static segment over a param, so
        // this wins regardless of declaration order.
        path: 'character/:id/items',
        name: RouteName.APP_CHARACTER_ITEMS,
        component: () => {
          return import('@pages/character-items');
        },
        meta: { layout: SheetLayout },
      },
      {
        // Same ranking as the items page above: a static segment outranks the
        // `:tab?` param, so this wins regardless of declaration order.
        path: 'character/:id/settings',
        name: RouteName.APP_CHARACTER_SETTINGS,
        component: () => {
          return import('@pages/character-settings');
        },
        meta: { layout: SheetLayout },
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
