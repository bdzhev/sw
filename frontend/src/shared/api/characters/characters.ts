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

/** The autosave controller's target. Absolute values, never deltas. */
export const updateCharacterSheet = (
  id: string,
  patch: SheetPatch,
): Promise<CharacterSheet> => {
  return http.patch<CharacterSheet>(`/character/${id}/sheet`, patch);
};

/**
 * The same write, as a best-effort during page teardown. `keepalive` is what lets
 * it outlive the document; `navigator.sendBeacon` cannot stand in because it is
 * POST-only and every autosave target is a PATCH. Rejections are swallowed on
 * purpose - there is no one left to tell, and the localStorage buffer is the real
 * durability net.
 */
export const sendSheetPatchOnTeardown = (id: string, patch: SheetPatch): void => {
  http.patch(`/character/${id}/sheet`, patch, { keepalive: true }).catch(() => {
    /* the document is going away */
  });
};

/**
 * The three atomic actions - rest, level-up, setup. Each returns the full new
 * state for the controller to adopt, rather than a partial the client has to
 * reconcile.
 */
export const runCharacterAction = <T>(
  id: string,
  endpoint: string,
  body: unknown,
): Promise<T> => {
  return http.post<T>(`/character/${id}/${endpoint}`, body);
};

export const deleteCharacter = async (id: string): Promise<void> => {
  await http.delete(`/character/${id}`);
};
