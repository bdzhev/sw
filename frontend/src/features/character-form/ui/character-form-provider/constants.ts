import type { InjectionKey } from 'vue';

import type { CharacterFormContext } from './types';

/** A symbol, so a typo is a type error rather than an `undefined` at runtime. */
export const CHARACTER_FORM_CTX_KEY: InjectionKey<CharacterFormContext> =
  Symbol('characterFormContext');
