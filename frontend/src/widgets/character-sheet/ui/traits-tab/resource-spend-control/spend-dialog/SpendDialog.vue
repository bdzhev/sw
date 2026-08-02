<script setup lang="ts">
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
import { Input } from '@shared/ui/input';
import { Text } from '@shared/ui/text';

import { useResourceSpend } from '@widgets/character-sheet/model/traits/useResourceSpend';

import type { SpendDialogProps } from './SpendDialog.types';
import { SubAbilityOption } from './sub-ability-option';

const props = withDefaults(defineProps<SpendDialogProps>(), { isSaving: false });

const emit = defineEmits<{
  'update:open': [open: boolean];
  spend: [amount: number];
}>();

const FLAT_COST = 1;

const {
  label,
  remaining,
  subAbilities,
  hasSubAbilities,
  isExhausted,
  isUntracked,
  amountLabel,
  selectedAbilityName,
  selectAbility,
  isAbilityDisabled,
  spend,
  handleSubmit,
} = useResourceSpend({
  getResource: () => {
    return props.resource;
  },
  isOpen: () => {
    return props.open;
  },
  onSpend: (amount) => {
    emit('spend', amount);
    emit('update:open', false);
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

      <DialogContent :aria-describedby="undefined">
        <DialogHeader>
          <div class="flex min-w-0 flex-col gap-1">
            <DialogTitle class="truncate">Use {{ label }}</DialogTitle>

            <Text size="xs" theme="secondary">{{ remaining }} remaining</Text>
          </div>

          <DialogCloseButton />
        </DialogHeader>

        <DialogBody>
          <Text v-if="isUntracked" size="sm" theme="warning" class="pb-3">
            This pool has no max yet, so there is nothing to spend. Set one from the
            resource's edit form.
          </Text>

          <ul v-if="hasSubAbilities" class="flex flex-col gap-2 pb-4">
            <SubAbilityOption
              v-for="ability in subAbilities"
              :key="ability.name"
              :ability="ability"
              :is-selected="selectedAbilityName === ability.name"
              :is-disabled="props.isSaving || isAbilityDisabled(ability)"
              @select="selectAbility(ability)"
            />
          </ul>

          <form class="flex flex-col gap-1" @submit.prevent="handleSubmit">
            <Text size="sm" theme="secondary">{{ amountLabel }}</Text>

            <div class="flex items-start gap-2">
              <div class="min-w-0 flex-1">
                <Input name="amount" type="number" placeholder="0" />
              </div>

              <Button
                type="submit"
                class="min-h-11"
                :is-disabled="isExhausted || props.isSaving"
              >
                Spend
              </Button>
            </div>
          </form>
        </DialogBody>

        <DialogFooter>
          <Button
            v-if="!hasSubAbilities"
            width="full"
            class="min-h-11"
            :is-disabled="isExhausted || props.isSaving"
            @click="spend(FLAT_COST)"
          >
            Use one
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
