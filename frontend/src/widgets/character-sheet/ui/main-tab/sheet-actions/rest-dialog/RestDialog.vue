<script setup lang="ts">
import { computed } from 'vue';

import { RestType } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import {
  DialogBody,
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
import { Text } from '@shared/ui/text';

import {
  DICE_SPENT_HINT,
  REST_DESCRIPTIONS,
  REST_LABELS,
  REST_SUBMIT_LABELS,
  REST_SUMMARY_TITLE,
  RESTING_LABELS,
} from '@widgets/character-sheet/config/rest';
import { useRest, useRestForm } from '@widgets/character-sheet/model/rest';

import { RestSummary } from './rest-summary';
import type { RestDialogProps } from './RestDialog.types';

const props = defineProps<RestDialogProps>();

const open = defineModel<boolean>('open', { required: true });

const isOpen = (): boolean => {
  return open.value;
};

const { isResting, summary, hasRested, remainingDice, slotsHint, restShort, restLong } =
  useRest({ isOpen });

const { submit } = useRestForm({
  getRemainingDice: () => {
    return remainingDice.value;
  },
  isOpen,
  onSubmit: (values) => {
    void restShort(values.diceSpent, values.healingRolled);
  },
});

const isShortRest = computed(() => {
  return props.type === RestType.SHORT;
});

/** The dialog keeps its title until the rest lands, then reports on it. */
const title = computed(() => {
  return hasRested.value ? REST_SUMMARY_TITLE : REST_LABELS[props.type];
});

const submitLabel = computed(() => {
  return isResting.value ? RESTING_LABELS[props.type] : REST_SUBMIT_LABELS[props.type];
});

const handleSubmit = (event?: Event): void => {
  submit(event);
};

const handleLongRest = (): void => {
  void restLong();
};

const handleDone = (): void => {
  open.value = false;
};
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent :aria-describedby="undefined">
        <DialogHeader>
          <DialogTitle>{{ title }}</DialogTitle>

          <DialogCloseButton />
        </DialogHeader>

        <DialogBody>
          <RestSummary v-if="hasRested" :lines="summary" />

          <div v-else class="flex flex-col gap-4">
            <Text size="sm" theme="secondary">{{ REST_DESCRIPTIONS[props.type] }}</Text>

            <Text v-if="isShortRest && slotsHint" size="xs" theme="secondary">
              {{ slotsHint }}
            </Text>

            <!-- A long rest takes no input: everything it restores is stored. -->
            <form
              v-if="isShortRest"
              class="flex flex-col gap-4"
              @submit.prevent="handleSubmit"
            >
              <FormInput
                name="diceSpent"
                :label="`Hit dice to spend — ${remainingDice} left`"
                input-mode="numeric"
                placeholder="0"
              />

              <div class="flex flex-col gap-1">
                <FormInput
                  name="healingRolled"
                  label="Total healing rolled"
                  input-mode="numeric"
                  placeholder="0"
                />

                <Text size="xxs" theme="secondary">{{ DICE_SPENT_HINT }}</Text>
              </div>

              <Button
                type="submit"
                width="full"
                class="min-h-11"
                :is-loading="isResting"
                :is-disabled="isResting"
              >
                {{ submitLabel }}
              </Button>
            </form>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button v-if="hasRested" width="full" class="min-h-11" @click="handleDone">
            Done
          </Button>

          <Button
            v-else-if="!isShortRest"
            width="full"
            class="min-h-11"
            :is-loading="isResting"
            :is-disabled="isResting"
            @click="handleLongRest"
          >
            {{ submitLabel }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
