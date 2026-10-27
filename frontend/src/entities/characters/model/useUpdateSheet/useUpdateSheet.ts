import { useMutation } from '@tanstack/vue-query';

import { updateCharacterSheet } from '@shared/api/characters';

import type { UpdateSheetVariables } from './useUpdateSheet.types';

/**
 * The sheet-row PATCH, as a mutation so it shows up in the TanStack devtools and
 * in `useIsMutating` alongside every other write in the app.
 *
 * Deliberately thin. It owns transport and nothing else: no `onSuccess` cache
 * write, because only `useSheetAutosave` knows what is still pending and has to
 * merge the acked row *under* it; and no `onError` toast, because the sheet's
 * `StatusBar` is where a failed save is surfaced.
 *
 * **`retry: false` is load-bearing - do not turn it on.** TanStack retries with
 * the variables captured when `mutate` was called, so a retry would resend the
 * payload that already failed. The store retries instead, re-reading the current
 * working copy at send time, which is the whole reason a stale write cannot land.
 */
export const useUpdateSheet = () => {
  const { mutateAsync: updateSheet } = useMutation({
    mutationFn: (variables: UpdateSheetVariables) => {
      return updateCharacterSheet(variables.id, variables.patch);
    },
    retry: false,
  });

  return { updateSheet };
};
