<script setup lang="ts">
import { useForm } from 'vee-validate';

import { DialogBody, DialogFooter } from '@shared/ui/dialog';
import { FormInput } from '@shared/ui/form-input';

import { useCreateCharacter } from '@entities/characters';

import {
  CancelButton,
  CharacterFormProvider,
  ClassSelect,
  RaceSelect,
  SubmitButton,
} from '@features/character-form';

import { initialValues } from '../../config';
import { createCharacterSchema } from '../../model/schema';

const emit = defineEmits<{ submit: []; cancel: [] }>();

const { createCharacter, isCreatingCharacter } = useCreateCharacter();

const form = useForm({
  validationSchema: createCharacterSchema,
  initialValues,
  keepValuesOnUnmount: true,
});

/**
 * Awaited on purpose: firing and closing immediately discards the rejection,
 * so a rejected create looked identical to a successful one.
 */
const submitCharacter = form.handleSubmit(async (values) => {
  try {
    await createCharacter(values);
  } catch {
    return;
  }

  form.resetForm();
  emit('submit');
});

const handleSubmit = (event?: Event) => {
  void submitCharacter(event);
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <CharacterFormProvider :form-context="form" @submit="handleSubmit">
    <DialogBody>
      <div class="flex flex-col gap-4">
        <FormInput name="name" label="Name" placeholder="Character's name" />

        <ClassSelect name="characterClass" />

        <RaceSelect name="race" />
      </div>
    </DialogBody>

    <DialogFooter>
      <div class="flex flex-row justify-end gap-2">
        <CancelButton :is-loading="isCreatingCharacter" @cancel="handleCancel">
          Cancel
        </CancelButton>

        <SubmitButton :is-loading="isCreatingCharacter">Create</SubmitButton>
      </div>
    </DialogFooter>
  </CharacterFormProvider>
</template>
