import { useForm } from 'vee-validate';
import { computed, watch } from 'vue';

import type { CharacterIdentity } from '@shared/api/characters';

import { useUpdateCharacter } from '@entities/characters';

import { settingsFormSchema } from './settingsForm.schema';
import type { UseSettingsForm, UseSettingsFormOptions } from './useSettingsForm.types';

const blankValues = (): Record<string, unknown> => {
  return { name: '', lore: '', appearance: '' };
};

const valuesFromCharacter = (character: CharacterIdentity): Record<string, unknown> => {
  return {
    name: character.name,
    lore: character.lore ?? '',
    appearance: character.appearance ?? '',
  };
};

/**
 * The identity row's form — the explicit-save channel, never the autosave one.
 * A whole-form submit into `character_sheets` would make this a second writer of
 * the row the autosave controller owns, racing it with a stale object.
 */
export const useSettingsForm = (options: UseSettingsFormOptions): UseSettingsForm => {
  const { getCharacter, onSaved } = options;

  const form = useForm({
    validationSchema: settingsFormSchema,
    initialValues: blankValues(),
  });

  const { updateCharacter, isUpdating } = useUpdateCharacter({
    onSuccess: onSaved,
  });

  const isSaving = computed(() => {
    return isUpdating.value;
  });

  const isDirty = computed(() => {
    return form.meta.value.dirty;
  });

  const submit = form.handleSubmit((values) => {
    const character = getCharacter();

    if (!character) {
      return;
    }

    const lore = values.lore.trim();
    const appearance = values.appearance.trim();

    updateCharacter({
      id: character.id,
      name: values.name.trim(),
      // An emptied textarea clears the column rather than storing '' — the row
      // types both as nullable and the read path already handles null.
      lore: lore || null,
      appearance: appearance || null,
    });

    form.resetForm({ values: { ...values, lore, appearance } });
  });

  const handleSubmit = (event?: Event): void => {
    void submit(event);
  };

  /** Fills the boxes once the query resolves, and again if the row changes under us. */
  watch(
    getCharacter,
    (character) => {
      if (!character || form.meta.value.dirty) {
        return;
      }

      form.resetForm({ values: valuesFromCharacter(character) });
    },
    { immediate: true },
  );

  return { isSaving, isDirty, handleSubmit };
};
