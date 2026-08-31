import { http } from '@shared/lib/http';

import type {
  CharacterDetail,
  CharacterIdentity,
  CharacterSheet,
  CharactersPage,
  CreateCharacterPayload,
  SheetPatch,
  UpdateCharacterPayload,
} from './types';

export const PAGE_SIZE = 10;

/** Mirrors MAX_CHARACTERS_PER_USER in the backend's characters.routes.ts. */
export const MAX_CHARACTERS = 50;

/**
 * Mirrors MAX_ITEMS_PER_CHARACTER in the backend's
 * collections/items/items.routes.ts. Mirrored so the Add control can disable
 * itself rather than firing a request the server will answer with a 409; the
 * server check stays as the backstop for a client that got there anyway.
 */
export const MAX_ITEMS = 200;

/**
 * Two mount points, one rule: `/characters` (plural) is collection-level — the
 * paginated list and create. `/character/:id` (singular) is one character and
 * everything scoped to it.
 */
export const getCharacterSummaries = (offset: number): Promise<CharactersPage> => {
  return http.get<CharactersPage>(`/characters?offset=${offset}&limit=${PAGE_SIZE}`);
};

export const getCharacter = (id: string): Promise<CharacterDetail> => {
  return http.get<CharacterDetail>(`/character/${id}`);
};

export const createCharacter = (
  payload: CreateCharacterPayload,
): Promise<CharacterIdentity> => {
  return http.post<CharacterIdentity>('/characters', payload);
};

export const updateCharacter = ({
  id,
  ...patch
}: UpdateCharacterPayload): Promise<CharacterIdentity> => {
  return http.patch<CharacterIdentity>(`/character/${id}`, patch);
};

/** The autosave controller's `character` target. Absolute values, never deltas. */
export const updateCharacterSheet = (
  id: string,
  patch: SheetPatch,
): Promise<CharacterSheet> => {
  return http.patch<CharacterSheet>(`/character/${id}/sheet`, patch);
};

export const deleteCharacter = async (id: string): Promise<void> => {
  await http.delete(`/character/${id}`);
};
