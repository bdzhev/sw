<script setup lang="ts">
import { computed } from 'vue';

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

import {
  castableSlots,
  spellLevelLabel,
} from '@widgets/character-sheet/lib/spellcasting';

import type { CastDialogProps } from './CastDialog.types';
import { SlotOption } from './slot-option';

const props = withDefaults(defineProps<CastDialogProps>(), { isSaving: false });

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{
  cast: [slotLevel: number];
}>();

/**
 * Its own level and everything above it. The app lists the legal options rather
 * than picking one — it knows the rule, not which slot the player meant.
 */
const options = computed(() => {
  return props.spellLevel === null ? [] : castableSlots(props.spellLevel, props.slots);
});

const description = computed(() => {
  return props.spellLevel === null
    ? ''
    : `${spellLevelLabel(props.spellLevel)}. Pick the slot to spend.`;
});

const handleSelect = (slotLevel: number): void => {
  emit('cast', slotLevel);
  open.value = false;
};
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay />

      <DialogContent :aria-describedby="undefined">
        <DialogHeader>
          <div class="flex min-w-0 flex-col gap-1">
            <DialogTitle class="truncate">Cast {{ props.spellName }}</DialogTitle>

            <Text size="xs" theme="secondary">{{ description }}</Text>
          </div>

          <DialogCloseButton />
        </DialogHeader>

        <DialogBody class="pb-6">
          <ul v-if="options.length" class="flex flex-col gap-2">
            <SlotOption
              v-for="option in options"
              :key="option.slotLevel"
              :castable-slot="option"
              :is-saving="props.isSaving"
              @select="handleSelect"
            />
          </ul>

          <Text v-else size="sm" theme="secondary">
            No slot pool at this level or above. Set your maxima in the slot section
            first.
          </Text>
        </DialogBody>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
