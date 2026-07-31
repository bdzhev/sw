import { noop, useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  addCharacter as addCharacterRequest,
  characterQueries,
} from '@shared/api/characters';
import { getApiErrorMessage } from '@shared/lib/http';
import { useToast } from '@shared/lib/ui';

import type { UseAddCharacterOptions } from './useAddCharacter.types';

export const useAddCharacter = (options?: UseAddCharacterOptions) => {
  const { onSuccess = noop } = options || {};

  const qc = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: characterQueries.addCharacter(),
    mutationFn: addCharacterRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: characterQueries.characters() });
      onSuccess();
    },
    /**
     * Without this a failed create is silent: the list is newest-first, so
     * "my character didn't appear" is indistinguishable from a lost request.
     */
    onError: (error) => {
      showToast({
        title: 'Could not create the character',
        description: getApiErrorMessage(error, 'Please try again.'),
        variant: 'error',
      });
    },
  });

  return { addCharacter: mutateAsync, isAddingCharacter: isPending };
};
