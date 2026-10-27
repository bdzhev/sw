import type {
  CharacterDetail,
  CollectionKey,
  CollectionRow,
} from '@shared/api/characters';

export interface UseCharacterCollectionOptions {
  characterId: string;
}

/** Shape `setQueryData` hands back for one character's full detail. */
export type CharacterDetailCache = CharacterDetail | undefined;

export interface UpdateRowVariables<K extends CollectionKey> {
  rowId: string;
  patch: Partial<Omit<CollectionRow[K], 'id' | 'characterId' | 'createdAt'>>;
}
