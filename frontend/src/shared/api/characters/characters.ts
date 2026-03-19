import { http } from '@shared/lib/http';

import type { CharacterData, AddCharacterPayload, UpdateCharacterPayload } from './types';

export const PAGE_SIZE = 10;

const mapCharacter = (raw: any): CharacterData => {
  const { class: characterClass, ...rest } = raw;
  return { ...rest, characterClass };
};

export const getCharactersInfo = async (): Promise<CharacterData[]> => {
  const data = await http.get<any[]>('/characters');
  return data.map(mapCharacter);
};

export const getCharacter = async (id: string): Promise<CharacterData> => {
  const data = await http.get<any>(`/characters/${id}`);
  return mapCharacter(data);
};

export const addCharacter = async (payload: AddCharacterPayload): Promise<{ character: CharacterData }> => {
  const data = await http.post<any>('/characters', { ...payload, class: payload.characterClass });
  return { character: mapCharacter(data.character) };
};

export const updateCharacter = async (payload: UpdateCharacterPayload): Promise<{ character: CharacterData }> => {
  const data = await http.patch<any>(`/characters/${payload.id}`, { name: payload.name });
  return { character: mapCharacter(data.character) };
};

export const deleteCharacter = async (id: string): Promise<{ character: CharacterData }> => {
  const data = await http.delete<any>(`/characters/${id}`);
  return { character: mapCharacter(data.character) };
};
