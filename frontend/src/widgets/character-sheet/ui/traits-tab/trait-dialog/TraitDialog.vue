<script setup lang="ts">
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
import { Input } from '@shared/ui/input';
import { Select } from '@shared/ui/select';
import { Textarea } from '@shared/ui/textarea';

import { TRAIT_TAG_OPTIONS } from '@widgets/character-sheet/config/traits';
import {
  useTraitForm,
  type TraitSubmitValues,
} from '@widgets/character-sheet/model/traits/useTraitForm';

import { PinField } from '../pin-field';
import type { TraitDialogProps } from './TraitDialog.types';

const props = withDefaults(defineProps<TraitDialogProps>(), { isSaving: false });

const emit = defineEmits<{
  'update:open': [open: boolean];
  submit: [values: TraitSubmitValues];
}>();

const { title, handleSubmit } = useTraitForm({
  getTrait: () => {
    return props.trait;
  },
  isOpen: () => {
    return props.open;
  },
  onSubmit: (values) => {
    emit('submit', values);
  },
});
</script>

<template>
  <DialogRoot
    :open="props.open"
    @update:open="
      (isOpen) => {
        return emit('update:open', isOpen);
      }
    "
  >
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
              <Input name="name" placeholder="Trait name" />

              <Select
                name="tag"
                :options="TRAIT_TAG_OPTIONS"
                placeholder="Tag — race, class or other"
              />

              <Textarea
                name="description"
                label="Description"
                :rows="5"
                placeholder="Whatever you need to remember, in your own words."
              />

              <PinField name="quickReference" />
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
