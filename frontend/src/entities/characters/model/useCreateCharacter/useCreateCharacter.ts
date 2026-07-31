import { noop, useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  createCharacter as createCharacterRequest,
  characterQueries,
} from '@shared/api/characters';
import { getApiErrorMessage } from '@shared/lib/http';
import { useToast } from '@shared/lib/ui';

import type { UseCreateCharacterOptions } from './useCreateCharacter.types';

export const useCreateCharacter = (options?: UseCreateCharacterOptions) => {
  const { onSuccess = noop } = options || {};

  const qc = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: characterQueries.createCharacter(),
    mutationFn: createCharacterRequest,
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

  return { createCharacter: mutateAsync, isCreatingCharacter: isPending };
};
