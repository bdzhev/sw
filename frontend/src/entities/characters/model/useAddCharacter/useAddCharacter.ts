import { noop, useMutation, useQueryClient } from '@tanstack/vue-query';

import {
  addCharacter as addCharacterRequest,
  characterQueries,
} from '@shared/api/characters';

import type { UseAddCharacterOptions } from './useAddCharacter.types';

export const useAddCharacter = (options?: UseAddCharacterOptions) => {
  const { onSuccess = noop } = options || {};

  const qc = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: characterQueries.addCharacter(),
    mutationFn: addCharacterRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: characterQueries.characters() });
      onSuccess();
    },
  });

  return { addCharacter: mutateAsync, isAddingCharacter: isPending };
};
