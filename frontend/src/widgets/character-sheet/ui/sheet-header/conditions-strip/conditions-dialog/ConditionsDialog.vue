<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import { Button } from '@shared/ui/button';
import {
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from '@shared/ui/dialog';
import { Input } from '@shared/ui/input';
import { Text } from '@shared/ui/text';
import { ToggleChipGroup, type ToggleChipOption } from '@shared/ui/toggle-chip-group';

import {
  CONDITION_MAX_LENGTH,
  CONDITION_OPTIONS,
  MAX_CONDITIONS,
} from '@widgets/character-sheet/config/header';

import type { ConditionsDialogProps } from './ConditionsDialog.types';

const props = defineProps<ConditionsDialogProps>();

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  update: [conditions: string[]];
}>();

const draft = ref('');

/**
 * The SRD list plus whatever else is already set. The chip group's model is the
 * whole array, so a stored condition missing from the options would be dropped
 * the moment any chip was toggled.
 */
const options = computed<ToggleChipOption[]>(() => {
  const known = new Set(
    CONDITION_OPTIONS.map((option) => {
      return option.value;
    }),
  );

  const custom = props.conditions
    .filter((condition) => {
      return !known.has(condition);
    })
    .map((condition) => {
      return { value: condition, label: condition };
    });

  return [...CONDITION_OPTIONS, ...custom];
});

const isFull = computed(() => {
  return props.conditions.length >= MAX_CONDITIONS;
});

const selected = computed({
  get: (): string[] => {
    return [...props.conditions];
  },
  set: (value: string[]): void => {
    if (value.length > MAX_CONDITIONS) {
      return;
    }

    emit('update', value);
  },
});

const handleCustomSubmit = (): void => {
  const entry = draft.value.trim().toLowerCase();

  draft.value = '';

  if (!entry || isFull.value) {
    return;
  }

  const isAlreadySet = props.conditions.some((condition) => {
    return condition.toLowerCase() === entry;
  });

  if (isAlreadySet) {
    return;
  }

  emit('update', [...props.conditions, entry]);
};
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent :aria-describedby="undefined">
        <DialogHeader>
          <DialogTitle>Conditions</DialogTitle>

          <DialogCloseButton />
        </DialogHeader>

        <DialogBody class="pb-6">
          <div class="flex flex-col gap-4">
            <ToggleChipGroup
              v-model="selected"
              :options="options"
              legend="Conditions"
              is-legend-hidden
            />

            <form @submit.prevent="handleCustomSubmit">
              <Input
                v-model="draft"
                label="Something else"
                placeholder="Exhaustion 3, cursed…"
                :maxlength="CONDITION_MAX_LENGTH"
                :is-disabled="isFull"
              >
                <template #right>
                  <Button
                    type="submit"
                    variant="transparent"
                    size="xs"
                    is-icon-only
                    class="mr-1"
                    :is-disabled="isFull"
                    aria-label="Add this condition"
                  >
                    <Plus :size="18" />
                  </Button>
                </template>
              </Input>
            </form>

            <Text size="xs" theme="secondary">
              {{
                isFull
                  ? `That is ${MAX_CONDITIONS} conditions, the ceiling. Remove one to add another.`
                  : 'Badges only — nothing here changes a number on the sheet.'
              }}
            </Text>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
