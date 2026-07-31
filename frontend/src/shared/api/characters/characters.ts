import { http } from '@shared/lib/http';

import type {
  CharacterData,
  CharactersPage,
  AddCharacterPayload,
  UpdateCharacterPayload,
  RawCharacterData,
  RawBaseCharacterData,
  RawCharactersPage,
} from './types';

export const PAGE_SIZE = 10;

/** Mirrors MAX_CHARACTERS_PER_USER in the backend's characters.routes.ts. */
export const MAX_CHARACTERS = 50;

const mapBaseData = (raw: RawBaseCharacterData) => {
  const { class: characterClass, ...rest } = raw;

  return { ...rest, characterClass };
};

const mapFullData = (raw: RawCharacterData) => {
  const { class: characterClass, ...rest } = raw;

  return { ...rest, characterClass };
};

export const getCharactersInfo = async (offset: number): Promise<CharactersPage> => {
  const data = await http.get<RawCharactersPage>(
    `/characters?offset=${offset}&limit=${PAGE_SIZE}`,
  );

  return { items: data.items.map(mapBaseData), total: data.total };
};

export const getCharacter = async (id: string): Promise<CharacterData> => {
  const data = await http.get<RawCharacterData>(`/character/${id}`);

  return mapFullData(data);
};

export const addCharacter = async (
  payload: AddCharacterPayload,
): Promise<CharacterData> => {
  const data = await http.post<RawCharacterData>('/characters', {
    ...payload,
    class: payload.characterClass,
  });

  return mapFullData(data);
};

export const updateCharacter = async (
  payload: UpdateCharacterPayload,
): Promise<CharacterData> => {
  const data = await http.patch<RawCharacterData>(`/character/${payload.id}`, {
    name: payload.name,
  });

  return mapFullData(data);
};

export const deleteCharacter = async (id: string): Promise<void> => {
  await http.delete<RawCharacterData>(`/character/${id}`);
};
