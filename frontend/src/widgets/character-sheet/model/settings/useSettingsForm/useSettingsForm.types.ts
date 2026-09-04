import type { ComputedRef } from 'vue';

import type { CharacterIdentity } from '@shared/api/characters';

export interface UseSettingsFormOptions {
  /** undefined until the character query resolves. */
  getCharacter: () => CharacterIdentity | undefined;
  /**
   * Called after a successful save. Supplied by the caller rather than fired
   * from in here: a toast is not something a form composable should be able to
   * do behind its own interface, and the page is what owns its chrome.
   */
  onSaved?: () => void;
}

export interface UseSettingsForm {
  isSaving: ComputedRef<boolean>;
  isDirty: ComputedRef<boolean>;
  handleSubmit: (event?: Event) => void;
}
