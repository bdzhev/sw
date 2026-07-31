import type { InfiniteData } from '@tanstack/vue-query';

import type { CharacterDetail, CharactersPage } from '@shared/api/characters';

export interface UseUpdateCharacterOptions {
  onSuccess?: () => void;
}

/** Shape `setQueryData` hands back for the paginated characters list. */
export type CharactersCache = InfiniteData<CharactersPage> | undefined;

/** Shape `setQueryData` hands back for one character's full detail. */
export type CharacterDetailCache = CharacterDetail | undefined;
