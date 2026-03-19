import { useRoute } from 'vue-router';

export const useRouteParam = () => {
  const route = useRoute();

  const rawId = route.params.id;

  const characterId = Array.isArray(rawId) ? rawId[0] : rawId;

  return { characterId };
};
