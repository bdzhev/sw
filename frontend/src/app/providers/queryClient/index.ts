import { QueryClient } from '@tanstack/vue-query';

import type { ApiError } from '@shared/lib/http';

declare module '@tanstack/vue-query' {
  interface Register {
    defaultError: ApiError;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});
