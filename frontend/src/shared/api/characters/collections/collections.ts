import { http } from '@shared/lib/http';

import {
  CollectionKey,
  type CollectionCreate,
  type CollectionPatch,
  type CollectionRow,
} from './collections.types';

/**
 * The URL segment each collection is served from. Separate from `CollectionKey`
 * because three of them disagree with the field name they carry on the sheet.
 *
 * Reads are absent on purpose: `GET /character/:id` already returns all five, so
 * a tab never fetches its own collection.
 */
export const COLLECTION_SEGMENTS: Record<CollectionKey, string> = {
  [CollectionKey.ATTACKS]: 'attacks',
  [CollectionKey.TRAITS]: 'traits',
  [CollectionKey.CLASS_RESOURCES]: 'resources',
  [CollectionKey.INVENTORY_ITEMS]: 'items',
  [CollectionKey.SPELLS]: 'spells',
};

const basePath = (characterId: string, key: CollectionKey): string => {
  return `/character/${characterId}/${COLLECTION_SEGMENTS[key]}`;
};

export const createCollectionRow = <K extends CollectionKey>(
  key: K,
  characterId: string,
  body: CollectionCreate<K>,
): Promise<CollectionRow[K]> => {
  return http.post<CollectionRow[K]>(basePath(characterId, key), body);
};

export const updateCollectionRow = <K extends CollectionKey>(
  key: K,
  characterId: string,
  rowId: string,
  patch: CollectionPatch<K>,
): Promise<CollectionRow[K]> => {
  return http.patch<CollectionRow[K]>(`${basePath(characterId, key)}/${rowId}`, patch);
};

export const deleteCollectionRow = async (
  key: CollectionKey,
  characterId: string,
  rowId: string,
): Promise<void> => {
  await http.delete(`${basePath(characterId, key)}/${rowId}`);
};
