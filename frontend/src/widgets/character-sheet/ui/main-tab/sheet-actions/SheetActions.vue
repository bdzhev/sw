<script setup lang="ts">
import { BedDouble, ChevronsUp, Coffee } from 'lucide-vue-next';
import { ref } from 'vue';

import { RestType } from '@shared/api/characters';
import { Button } from '@shared/ui/button';
import {
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger,
} from '@shared/ui/tooltip';

import { REST_LABELS } from '@widgets/character-sheet/config/rest';
import { SheetSection } from '@widgets/character-sheet/ui/sheet-section';

import { RestDialog } from './rest-dialog';

const LEVEL_UP_HINT = 'Levelling up arrives in a later update.';

/**
 * Both buttons open the same dialog. State this shallow stays local refs — the
 * emitter and the owner are the same component, so a UI store would be a
 * singleton standing in for a `ref`.
 */
const isRestOpen = ref(false);
const restType = ref<RestType>(RestType.SHORT);

const openRest = (type: RestType): void => {
  restType.value = type;
  isRestOpen.value = true;
};

const handleShortRestClick = (): void => {
  openRest(RestType.SHORT);
};

const handleLongRestClick = (): void => {
  openRest(RestType.LONG);
};
</script>

<template>
  <SheetSection title="Actions" variant="plain" :heading-level="3">
    <!-- Wraps rather than overflowing: the buttons cannot shrink below their labels. -->
    <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <Button width="full" class="min-h-11 sm:w-fit" @click="handleShortRestClick">
        <Coffee :size="18" class="mr-1" />
        {{ REST_LABELS[RestType.SHORT] }}
      </Button>

      <Button width="full" class="min-h-11 sm:w-fit" @click="handleLongRestClick">
        <BedDouble :size="18" class="mr-1" />
        {{ REST_LABELS[RestType.LONG] }}
      </Button>

      <TooltipRoot>
        <!-- A disabled button swallows pointer events, so the span is the trigger. -->
        <TooltipTrigger as="span" tabindex="0" class="inline-flex w-full sm:w-fit">
          <Button is-disabled variant="secondary" width="full" class="min-h-11">
            <ChevronsUp :size="18" class="mr-1" />
            Level up
          </Button>
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent class="max-w-64">{{ LEVEL_UP_HINT }}</TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </div>

    <RestDialog v-model:open="isRestOpen" :type="restType" />
  </SheetSection>
</template>
