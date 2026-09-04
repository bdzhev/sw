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
import { FormSelect } from '@shared/ui/form-select';
import { FormSwitch } from '@shared/ui/form-switch';
import { Textarea } from '@shared/ui/textarea';

import { TRAIT_TAG_OPTIONS } from '@widgets/character-sheet/config/traits';
import {
  useTraitForm,
  type TraitSubmitValues,
} from '@widgets/character-sheet/model/traits';

import type { TraitDialogProps } from './TraitDialog.types';

const props = withDefaults(defineProps<TraitDialogProps>(), { isSaving: false });

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  submit: [values: TraitSubmitValues];
}>();

const { title, handleSubmit } = useTraitForm({
  getTrait: () => {
    return props.trait;
  },
  isOpen: () => {
    return open.value;
  },
  onSubmit: (values) => {
    emit('submit', values);
  },
});
</script>

<template>
  <DialogRoot v-model:open="open">
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
              <FormInput name="name" placeholder="Trait name" />

              <FormSelect
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

              <FormSwitch name="quickReference" label="Pin to quick reference">
                <template #icon>
                  <Pin :size="16" aria-hidden="true" />
                </template>
              </FormSwitch>
            </div>
          </DialogBody>

          <DialogFooter>
            <div class="flex flex-row flex-wrap items-center justify-end gap-2">
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
