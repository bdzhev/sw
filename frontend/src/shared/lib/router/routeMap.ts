import type {
  ParamValue,
  ParamValueZeroOrMore,
  ParamValueZeroOrOne,
  RouteRecordInfo,
} from 'vue-router';

import { RouteName } from './routeName';

/**
 * The typed twin of `app/providers/router/routes.ts`. Declaring it makes
 * `useRoute(name).params` a checked shape, and rejects an unknown route name, an
 * unknown param and a wrong param type in `push` / `RouterLink`. It cannot catch
 * an omitted `params` object — vue-router types that optional. Change a path or a
 * param here in the same commit as the route itself.
 *
 * A param written `:id` is `ParamValue`, `:id?` is `ParamValueZeroOrOne` (a
 * missing optional param normalizes to `''`, not `undefined`), and a catch-all is
 * an array. The two type arguments are raw (what you may pass to `push`) and
 * normalized (what you read off `route.params`).
 *
 * Building a location in a `computed` needs an explicit `RouteLocationRaw`: in an
 * object literal an enum member widens to the whole enum and stops matching.
 */
export interface RouteNamedMap {
  [RouteName.HOME]: RouteRecordInfo<
    RouteName.HOME,
    '/',
    Record<string, never>,
    Record<string, never>
  >;
  [RouteName.LOGIN]: RouteRecordInfo<
    RouteName.LOGIN,
    '/login',
    Record<string, never>,
    Record<string, never>
  >;
  [RouteName.SIGNUP]: RouteRecordInfo<
    RouteName.SIGNUP,
    '/signup',
    Record<string, never>,
    Record<string, never>
  >;
  [RouteName.APP_HOME]: RouteRecordInfo<
    RouteName.APP_HOME,
    '/app',
    Record<string, never>,
    Record<string, never>
  >;
  [RouteName.APP_BUILDER]: RouteRecordInfo<
    RouteName.APP_BUILDER,
    '/app/builder/:id?',
    { id?: ParamValueZeroOrOne<true> },
    { id: ParamValueZeroOrOne<false> }
  >;
  [RouteName.APP_CHARACTER]: RouteRecordInfo<
    RouteName.APP_CHARACTER,
    '/app/character/:id/:tab?',
    { id: ParamValue<true>; tab?: ParamValueZeroOrOne<true> },
    { id: ParamValue<false>; tab: ParamValueZeroOrOne<false> }
  >;
  [RouteName.APP_CHARACTER_ITEMS]: RouteRecordInfo<
    RouteName.APP_CHARACTER_ITEMS,
    '/app/character/:id/items',
    { id: ParamValue<true> },
    { id: ParamValue<false> }
  >;
  [RouteName.APP_CHARACTER_SETTINGS]: RouteRecordInfo<
    RouteName.APP_CHARACTER_SETTINGS,
    '/app/character/:id/settings',
    { id: ParamValue<true> },
    { id: ParamValue<false> }
  >;
  [RouteName.APP_SETTINGS]: RouteRecordInfo<
    RouteName.APP_SETTINGS,
    '/app/settings',
    Record<string, never>,
    Record<string, never>
  >;
  [RouteName.NOT_FOUND]: RouteRecordInfo<
    RouteName.NOT_FOUND,
    '/:pathMatch(.*)*',
    { pathMatch?: ParamValueZeroOrMore<true> },
    { pathMatch: ParamValue<false>[] }
  >;
}

/** The three surfaces of one character: the sheet, its items page, its settings page. */
export type CharacterRouteName =
  | RouteName.APP_CHARACTER
  | RouteName.APP_CHARACTER_ITEMS
  | RouteName.APP_CHARACTER_SETTINGS;

declare module 'vue-router' {
  interface TypesConfig {
    RouteNamedMap: RouteNamedMap;
  }
}
