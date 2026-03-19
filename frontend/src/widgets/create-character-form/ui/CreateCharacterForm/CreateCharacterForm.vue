<script setup lang="ts">
import { useForm } from 'vee-validate';

import { useAddCharacter } from '@entities/characters';

import {
  CfProvider,
  CfBody,
  CfContent,
  CfFooter,
  CfHeader,
  CfInput,
  CfClassSelect,
  CfRaceSelect,
  CfHeaderTitle,
  CfHeaderDescription,
  CfFooterCancelButton,
  CfFooterSubmitButton,
} from '@features/character-form';

import { initialValues } from '../../config';
import { createCharacterSchema } from '../../model/schema';

import type { CreateCharacterFormProps } from './CreateCharacterForm.props';

const props = defineProps<CreateCharacterFormProps>();

const { addCharacter, isAddingCharacter } = useAddCharacter();

const form = useForm({
  validationSchema: createCharacterSchema,
  initialValues,
  keepValuesOnUnmount: true,
});

const handleSubmit = form.handleSubmit((values) => {
  addCharacter(values);
  form.resetForm();
  props.onSubmit?.();
});

const { meta } = form;
</script>

<template>
  <CfProvider :form-context="form" :on-submit="handleSubmit">
    <CfContent>
      <CfHeader>
        <CfHeaderTitle>{{ 'Create a new character' }}</CfHeaderTitle>

        <CfHeaderDescription>
          {{
            "Enter a name, race and class for you new character. You won't be able to change the class or the race."
          }}
        </CfHeaderDescription>
      </CfHeader>

      <CfBody class="gap-1">
        <CfInput
          name="name"
          :validate-on-change="false"
          placeholder="Character's name"
        />

        <CfClassSelect name="class" />

        <CfRaceSelect name="race" />
      </CfBody>

      <CfFooter class="items-center justify-end">
        <div class="flex flex-row gap-2">
          <CfFooterCancelButton
            :is-loading="isAddingCharacter"
            v-on:cancel-click="props?.onCancel"
          >
            Cancel
          </CfFooterCancelButton>

          <CfFooterSubmitButton
            :is-disabled="!meta.dirty || !meta.valid"
            :is-loading="isAddingCharacter"
          >
            Create
          </CfFooterSubmitButton>
        </div>
      </CfFooter>
    </CfContent>
  </CfProvider>
</template>
