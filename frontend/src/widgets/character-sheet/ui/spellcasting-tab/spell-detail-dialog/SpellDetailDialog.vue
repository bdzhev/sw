<script setup lang="ts">
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
import { Text } from '@shared/ui/text';

import { useSpellMeta } from '@widgets/character-sheet/model/spellcasting';

import { SpellDetails } from '../spell-details';
import type { SpellDetailDialogProps } from './SpellDetailDialog.types';

const props = defineProps<SpellDetailDialogProps>();

const emit = defineEmits<{ 'update:open': [open: boolean] }>();

/** An empty shell keeps `useSpellMeta` unconditional while nothing is selected. */
const EMPTY_SPELL = {
  id: '',
  spellId: null,
  customName: null,
  customDescription: null,
  customLevel: null,
  sortOrder: 0,
  createdAt: '',
  spell: null,
  isCustom: true,
};

const {
  name,
  metaLine,
  description,
  higherLevel,
  castingTime,
  rangeText,
  duration,
  components,
} = useSpellMeta(() => {
  return props.spell ?? EMPTY_SPELL;
});

const handleOpenChange = (isOpen: boolean): void => {
  emit('update:open', isOpen);
};
</script>

<template>
  <DialogRoot :open="props.open" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent :aria-describedby="undefined">
        <DialogHeader>
          <div class="flex min-w-0 flex-col gap-1">
            <DialogTitle class="truncate">{{ name }}</DialogTitle>

            <Text v-if="metaLine" size="xs" theme="secondary">{{ metaLine }}</Text>
          </div>

          <DialogCloseButton />
        </DialogHeader>

        <DialogBody class="pb-6">
          <SpellDetails
            :casting-time="castingTime"
            :range-text="rangeText"
            :components="components"
            :duration="duration"
            :description="description"
            :higher-level="higherLevel"
          />
        </DialogBody>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
