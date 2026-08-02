<script setup lang="ts">
import { Pin } from 'lucide-vue-next';

import { Button } from '@shared/ui/button';
import {
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@shared/ui/dialog';
import { FormInput } from '@shared/ui/form-input';
import { FormSwitch } from '@shared/ui/form-switch';
import { Select } from '@shared/ui/select';
import { Text } from '@shared/ui/text';
import { Textarea } from '@shared/ui/textarea';

import {
  RESET_TRIGGER_OPTIONS,
  RESOURCE_OPTIONS,
} from '@widgets/character-sheet/config/traits';
import {
  useResourceForm,
  type ResourceSubmitValues,
} from '@widgets/character-sheet/model/traits';

import type { ResourceDialogProps } from './ResourceDialog.types';

const props = withDefaults(defineProps<ResourceDialogProps>(), { isSaving: false });

const emit = defineEmits<{
  'update:open': [open: boolean];
  submit: [values: ResourceSubmitValues];
}>();

const { title, isEditing, isCustomResource, maxHint, sourcedTriggerHint, handleSubmit } =
  useResourceForm({
    getResource: () => {
      return props.resource;
    },
    isOpen: () => {
      return props.open;
    },
    onSubmit: (values) => {
      emit('submit', values);
    },
  });

const handleOpenChange = (isOpen: boolean): void => {
  emit('update:open', isOpen);
};
</script>

<template>
  <DialogRoot :open="props.open" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent
        :disable-outside-close="props.isSaving"
        :aria-describedby="undefined"
      >
        <form @submit.prevent="handleSubmit">
          <DialogHeader>
            <DialogTitle>{{ title }}</DialogTitle>

            <DialogCloseButton />
          </DialogHeader>

          <DialogBody>
            <div class="flex flex-col gap-2">
              <Select
                name="resource"
                :options="RESOURCE_OPTIONS"
                placeholder="Which resource?"
              />

              <FormInput
                v-if="isCustomResource"
                name="customName"
                placeholder="Resource name"
              />

              <div class="flex flex-col">
                <FormInput name="maxValue" type="number" placeholder="Max" />

                <Text size="xs" theme="secondary" class="pb-2">{{ maxHint }}</Text>
              </div>

              <FormInput
                v-if="isEditing"
                name="current"
                type="number"
                placeholder="Current"
              />

              <div class="flex flex-col">
                <Select
                  name="resetTrigger"
                  :options="RESET_TRIGGER_OPTIONS"
                  placeholder="Resets on…"
                />

                <Text v-if="sourcedTriggerHint" size="xs" theme="secondary" class="pb-2">
                  {{ sourcedTriggerHint }}
                </Text>
              </div>

              <Textarea
                name="description"
                label="Description"
                :rows="4"
                placeholder="What does this resource do? Your own words are fine."
              />

              <FormSwitch name="quickReference" label="Pin to quick reference">
                <template #icon>
                  <Pin :size="16" aria-hidden="true" />
                </template>
              </FormSwitch>
            </div>
          </DialogBody>

          <DialogFooter>
            <div class="flex flex-row items-center justify-end gap-2">
              <DialogClose as-child>
                <Button variant="secondary" :is-disabled="props.isSaving">Cancel</Button>
              </DialogClose>

              <Button type="submit" :is-loading="props.isSaving">Save</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
