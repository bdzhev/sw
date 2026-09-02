import { useRoute } from 'vue-router';

import { RouteName } from '@shared/lib/router';

export const useRouteParam = () => {
  /**
   * Naming the route is what types `params`: `:id?` normalizes to `''` when it
   * is missing, and the route's own `beforeEnter` redirects in that case.
   */
  const route = useRoute(RouteName.APP_BUILDER);

  const characterId = route.params.id;

  return { characterId };
};
