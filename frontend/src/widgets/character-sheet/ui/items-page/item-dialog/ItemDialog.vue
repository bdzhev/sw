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
import { FormNumberField } from '@shared/ui/form-number-field';
import { FormSwitch } from '@shared/ui/form-switch';
import { Text } from '@shared/ui/text';
import { Textarea } from '@shared/ui/textarea';

import { ABILITIES } from '@entities/characters';

import {
  ITEM_QUANTITY_LIMIT,
  ITEM_USES_LIMIT,
  STAT_MODIFIER_LIMIT,
} from '@widgets/character-sheet/config/equipment';
import {
  useItemForm,
  type ItemSubmitValues,
} from '@widgets/character-sheet/model/equipment';

import type { ItemDialogProps } from './ItemDialog.types';

const props = withDefaults(defineProps<ItemDialogProps>(), { isSaving: false });

const emit = defineEmits<{
  'update:open': [open: boolean];
  submit: [values: ItemSubmitValues];
}>();

const { title, hasBonuses, hasLimitedUses, handleSubmit } = useItemForm({
  getItem: () => {
    return props.item;
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
        <form class="flex min-h-0 flex-col" @submit.prevent="handleSubmit">
          <DialogHeader>
            <DialogTitle>{{ title }}</DialogTitle>

            <DialogCloseButton />
          </DialogHeader>

          <DialogBody>
            <div class="flex flex-col gap-4">
              <FormInput
                name="name"
                label="Name"
                placeholder="Healing potion, rope, belt of giant strength…"
              />

              <FormNumberField
                name="quantity"
                label="Quantity"
                has-stepper
                :min="0"
                :max="ITEM_QUANTITY_LIMIT"
                decrement-label="One fewer"
                increment-label="One more"
              />

              <FormSwitch name="isEquipped" label="Equipped" />

              <!--
                Behind a switch, like ResourceDialog's custom-name field: most
                items are rope and potions, and six empty ability boxes on every
                one of them is noise.
              -->
              <FormSwitch name="hasBonuses" label="Grants an ability bonus" />

              <div v-if="hasBonuses" class="flex flex-col gap-2">
                <div class="grid grid-cols-3 gap-2">
                  <FormNumberField
                    v-for="ability in ABILITIES"
                    :key="ability.stat"
                    :name="ability.stat"
                    :label="ability.abbr"
                    size="sm"
                    :min="-STAT_MODIFIER_LIMIT"
                    :max="STAT_MODIFIER_LIMIT"
                  />
                </div>

                <Text size="xs" theme="secondary">
                  Only counted while the item is equipped. The totals are derived, so
                  unequipping or deleting it removes exactly its contribution.
                </Text>
              </div>

              <FormSwitch name="hasLimitedUses" label="Limited uses" />

              <div v-if="hasLimitedUses" class="flex flex-col gap-4">
                <div class="grid grid-cols-2 gap-2">
                  <FormNumberField
                    name="maxUses"
                    label="Max uses"
                    size="sm"
                    :min="0"
                    :max="ITEM_USES_LIMIT"
                  />

                  <FormNumberField
                    name="usesRemaining"
                    label="Remaining"
                    size="sm"
                    :min="0"
                    :max="ITEM_USES_LIMIT"
                  />
                </div>

                <FormSwitch name="resetOnLongRest" label="Resets on a long rest" />
              </div>

              <Textarea
                name="description"
                label="Description"
                :rows="4"
                placeholder="What does it do? Your own words are fine."
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
