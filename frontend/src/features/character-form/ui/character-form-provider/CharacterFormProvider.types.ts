import type { CharacterFormContext } from './types';

export interface CharacterFormProviderProps {
  /** The `useForm` return the consumer owns; the buttons read it through inject. */
  formContext: CharacterFormContext;
}
