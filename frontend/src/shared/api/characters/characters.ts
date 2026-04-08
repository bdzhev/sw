import { http } from '@shared/lib/http';

import type {
  BaseCharacterData,
  CharacterData,
  AddCharacterPayload,
  UpdateCharacterPayload,
  RawCharacterData,
  RawBaseCharacterData,
} from './types';

export const PAGE_SIZE = 10;

const mapBaseData = (raw: RawBaseCharacterData) => {
  const { class: characterClass, ...rest } = raw;

  return { ...rest, characterClass };
};

const mapFullData = (raw: RawCharacterData) => {
  const { class: characterClass, ...rest } = raw;

  return { ...rest, characterClass };
};

export const getCharactersInfo = async (
  offset: number,
): Promise<BaseCharacterData[]> => {
  const data = await http.get<RawBaseCharacterData[]>(
    `/characters?offset=${offset}&limit=${PAGE_SIZE}`,
  );

  return data.map(mapBaseData);
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
